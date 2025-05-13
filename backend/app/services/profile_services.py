import os
from datetime import date
from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.utils.firebase import upload_file_to_firebase
from app.utils.file_utils import save_temp_file, delete_temp_file, upload_and_store_file
from app.models.user import User
from app.models.userprofiles import UserProfile
from app.models.mediaassets import MediaAsset
from app.models.event import Event
from app.models.eventattendees import EventAttendee
from app.models.saveditems import SavedItem
from app.models.follows import Follow
from app.models.eventcontent import EventContent
from app.models.organizers import Organizer
from app.models.trustscore import TrustScore
from app.utils.certificate_utils import extract_business_name_and_reg_no
from app.utils.orc_verifier import verify_with_orc
from app.services.trustscore_services import calculate_trust_score, get_trust_badge
from app.schemas import OrganizerAnalytics, OrganizerProfileViewResponse, EventSummary
from app.models.likes import Like
from datetime import datetime, timedelta

# ---------- Attendee Profile Completion ----------
def complete_attendee_profile(
    db: Session,
    user_id: int,
    display_name: str,
    first_name: str,
    last_name: str,
    city: str,
    country: str,
    preferences: list,
    bio: Optional[str] = None,
    profile_picture: Optional[UploadFile] = None
):
    try:
        user = db.query(User).filter(User.user_ID == user_id).first()
        if not user:
            return {"status": "error", "message": "User not found"}

        user.username = display_name.replace(" ", "_").lower()
        user.first_Name = first_name
        user.last_Name = last_name
        user.city = city
        user.country = country
        user.account_Status = "active"

        profile_picture_id = None
        if profile_picture:
            profile_picture_id = upload_and_store_file(db, profile_picture, user_id, "profile_image")

        user_profile = db.query(UserProfile).filter(UserProfile.user_ID == user_id).first()
        if not user_profile:
            user_profile = UserProfile(user_ID=user_id)
            db.add(user_profile)

        user_profile.display_Name = display_name
        user_profile.bio = bio
        user_profile.preferences = preferences
        if profile_picture_id:
            user_profile.profile_PictureID = profile_picture_id

        db.commit()
        return {"status": "success", "message": "Profile completed successfully", "user_id": user_id}

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ---------- Organizer Profile Completion ----------
async def complete_organizer_profile(
    db: Session,
    user_id: int,
    username: str,
    first_name: str,
    last_name: str,
    company_name: str,
    business_description: str,
    event_types: list,
    city: str,
    country: str,
    is_business_registered: bool,
    profile_picture: Optional[UploadFile] = None,
    certificate: Optional[UploadFile] = None
):
    try:
        # --- Update users table ---
        user = db.query(User).filter(User.user_ID == user_id).first()
        if not user:
            return {"status": "error", "message": "User not found"}

        user.username = username.replace(" ", "_").lower()
        user.first_Name = first_name
        user.last_Name = last_name
        user.city = city
        user.country = country

        # --- Update userprofiles table ---
        user_profile = db.query(UserProfile).filter(UserProfile.user_ID == user_id).first()
        if not user_profile:
            user_profile = UserProfile(user_ID=user_id)
            db.add(user_profile)

        user_profile.display_Name = username

        if profile_picture and profile_picture.filename:
            profile_picture_id = await upload_and_store_file(db, profile_picture, user_id, "profile_image")
            user_profile.profile_PictureID = profile_picture_id

        # --- Certificate Handling ---
        certificate_url = None
        is_verified = False
        temp_cert = None

        if is_business_registered:
            if not certificate or not certificate.filename:
                return {"status": "error", "message": "Certificate is required for registered businesses."}

            temp_cert = await save_temp_file(certificate)

            # Step 1: Extract business info
            ocr_data = extract_business_name_and_reg_no(temp_cert)
            if not ocr_data["business_name"] or not ocr_data["registration_number"]:
                delete_temp_file(temp_cert)
                return {"status": "error", "message": "Could not extract business name or registration number from certificate."}

            # Step 2: ORC verification
            is_verified = verify_with_orc(
                business_name=ocr_data["business_name"],
                reg_no=ocr_data["registration_number"]
            )

            if not is_verified:
                delete_temp_file(temp_cert)
                return {"status": "error", "message": "Business not found in ORC registry."}

            # Step 3: Upload certificate to Firebase
            certificate_url = upload_file_to_firebase(temp_cert, "certificates")

        # Ensure temp file is cleaned up
        if temp_cert:
            delete_temp_file(temp_cert)

        # --- Update organizers table ---
        organizer = db.query(Organizer).filter(Organizer.user_ID == user_id).first()
        if not organizer:
            organizer = Organizer(user_ID=user_id)
            db.add(organizer)

        organizer.company_Name = company_name
        organizer.business_Description = business_description
        organizer.verification_DocumentURL = certificate_url
        organizer.verification_Status = "business_verified" if is_business_registered and is_verified else "pending"
        organizer.event_Types = event_types
        organizer.is_orc_verified = is_verified 

        # --- Add trust score boost if verified ---
        if is_verified:
            existing_trust = db.query(TrustScore).filter(
                TrustScore.user_ID == user_id,
                TrustScore.reason == "Verified business via ORC"
            ).first()

            if not existing_trust:
                trust_boost = TrustScore(
                    user_ID=user_id,
                    score=10,
                    reason="Verified business via ORC"
                )
                db.add(trust_boost)


        db.commit()
        return {"status": "success", "message": "Organizer profile completed successfully"}

    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


# ---------- Get Event Goer Profile ----------
def get_eventgoer_profile(db: Session, user_id: int):
    user = db.query(User).filter(User.user_ID == user_id).first()
    if not user:
        return None

    profile = db.query(UserProfile).filter(UserProfile.user_ID == user_id).first()
    following_count = db.query(Follow).filter(Follow.follower_ID == user_id).count()
    today = date.today()

    profile_picture_url = None
    if profile and profile.profile_PictureID:
        media = db.query(MediaAsset).filter(MediaAsset.asset_ID == profile.profile_PictureID).first()
        if media:
            profile_picture_url = media.cdn_URL

    rsvp_event_ids = [eid[0] for eid in db.query(EventAttendee.event_ID).filter(EventAttendee.user_ID == user_id).all()]
    rsvp_events = db.query(Event).filter(Event.event_ID.in_(rsvp_event_ids)).all() if rsvp_event_ids else []

    upcoming_events = [get_event(e, db) for e in rsvp_events if e.event_Date and e.event_Date >= today]
    past_events = [get_event(e, db) for e in rsvp_events if e.event_Date and e.event_Date < today]

    saved_event_ids = [eid[0] for eid in db.query(SavedItem.entity_ID)
                       .filter(SavedItem.user_ID == user_id, SavedItem.entity_Type == "event").all()]
    saved_events = db.query(Event).filter(Event.event_ID.in_(saved_event_ids)).all() if saved_event_ids else []

    return {
        "first_name": user.first_Name,
        "last_name": user.last_Name,
        "username": user.username,
        "display_name": profile.display_Name if profile else None,
        "bio": profile.bio if profile else None,
        "preferences": profile.preferences if profile else [],
        "profile_picture_url": profile_picture_url,
        "following_count": following_count,
        "upcoming_events": upcoming_events,
        "past_events": past_events,
        "saved_events": [get_event(e, db) for e in saved_events],
        "rsvp_events": [get_event(e, db) for e in rsvp_events],
    }


# ---------- Update Profile ----------
async def update_eventgoer_profile(
    db: Session,
    user_id: int,
    first_name: Optional[str],
    last_name: Optional[str],
    username: Optional[str],
    bio: Optional[str],
    profile_picture: Optional[UploadFile]
):
    try:
        user = db.query(User).filter(User.user_ID == user_id).first()
        if not user:
            return {"status": "error", "message": "User not found"}

        if username:
            user.username = username.replace(" ", "_").lower()
        if first_name:
            user.first_Name = first_name
        if last_name:
            user.last_Name = last_name

        profile_picture_id = None
        if profile_picture:
            profile_picture_id = await upload_and_store_file(db, profile_picture, user_id, "profile_image")

        user_profile = db.query(UserProfile).filter(UserProfile.user_ID == user_id).first()
        if not user_profile:
            user_profile = UserProfile(user_ID=user_id)
            db.add(user_profile)

        if username:
            user_profile.display_Name = username
        if bio:
            user_profile.bio = bio
        if profile_picture_id:
            user_profile.profile_PictureID = profile_picture_id

        db.commit()

        return {
            "status": "success",
            "message": "Profile updated successfully",
            "user": {
                "user_id": user.user_ID,
                "username": user.username,
                "first_name": user.first_Name,
                "last_name": user.last_Name,
                "bio": user_profile.bio,
                "display_name": user_profile.display_Name,
                "profile_picture_url": (
                    db.query(MediaAsset)
                    .filter(MediaAsset.asset_ID == user_profile.profile_PictureID)
                    .first()
                    .cdn_URL if user_profile and user_profile.profile_PictureID else None
                )
            }
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ---------- Helper to enrich event with media ----------
def get_event(event: Event, db: Session):
    media_entries = db.query(EventContent).filter(EventContent.event_ID == event.event_ID).all()
    media = []
    for item in media_entries:
        asset = db.query(MediaAsset).filter(MediaAsset.asset_ID == item.asset_ID).first()
        if asset:
            media.append({
                "asset_ID": asset.asset_ID,
                "cdn_URL": asset.cdn_URL,
                "asset_Type": asset.asset_Type
            })
    return {
        "event_id": event.event_ID,
        "name": event.event_Name,
        "type": event.event_Type,
        "location": event.event_Location,
        "category": event.event_Category,
        "date": event.event_Date.isoformat() if event.event_Date else None,
        "start_time": str(event.start_Time) if event.start_Time else None,
        "end_time": str(event.end_Time) if event.end_Time else None,
        "status": event.event_Status,
        "is_free": bool(event.is_Free),
        "is_paid": bool(event.is_Paid),
        "description": event.event_Description,
        "media": media
    }


def get_recent_engagement_counts(db, event_ids):
    """
    Returns total likes and RSVPs in the last 7 days for a list of event IDs.
    """
    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    total_recent_likes = db.query(Like).filter(
        Like.entity_Type == "event",
        Like.entity_ID.in_(event_ids),
        Like.created_At >= seven_days_ago
    ).count()

    total_recent_rsvps = db.query(EventAttendee).filter(
        EventAttendee.event_ID.in_(event_ids),
        EventAttendee.registration_Time >= seven_days_ago
    ).count()

    return total_recent_likes, total_recent_rsvps


def view_organizer_profile(db: Session, user_id: int) -> OrganizerProfileViewResponse:
    organizer = db.query(Organizer).filter(Organizer.user_ID == user_id).first()
    if not organizer:
        raise Exception("Organizer profile not found")

    user = db.query(User).filter(User.user_ID == user_id).first()
    user_profile = db.query(UserProfile).filter(UserProfile.user_ID == user_id).first()

    profile_pic_url = None
    if user_profile and user_profile.profile_PictureID:
        media = db.query(MediaAsset).filter(MediaAsset.asset_ID == user_profile.profile_PictureID).first()
        profile_pic_url = media.cdn_URL if media else None

    # Get trust score and badge
    score = calculate_trust_score(db, user_id)
    badge = get_trust_badge(score)

    today = date.today()
    all_events = db.query(Event).filter(Event.organizer_ID == organizer.organizer_ID).all()
    event_ids = [event.event_ID for event in all_events]

    # Get likes and rsvps in the last 7 days
    recent_likes, recent_rsvps = get_recent_engagement_counts(db, event_ids)

    upcoming_events = []
    past_events = []

    for event in all_events:
        # Get primary content
        media_thumb = db.query(EventContent).filter(
            EventContent.event_ID == event.event_ID,
            EventContent.content_Type == "primary"
        ).first()

        # Get the actual media URL from mediaassets table
        thumbnail_url = None
        if media_thumb:
            asset = db.query(MediaAsset).filter(MediaAsset.asset_ID == media_thumb.asset_ID).first()
            thumbnail_url = asset.cdn_URL if asset else None

        rsvps = db.query(EventAttendee).filter(EventAttendee.event_ID == event.event_ID).count()
        likes = db.query(Like).filter(Like.entity_ID == event.event_ID, Like.entity_Type == "event").count()

        summary = EventSummary(
            event_id=event.event_ID,
            name=event.event_Name,
            date=event.event_Date,
            start_time=event.start_Time,
            end_time=event.end_Time,
            status=event.event_Status,
            thumbnail_url=thumbnail_url,
            rsvp_count=rsvps,
            like_count=likes
        )

        if event.event_Date >= today:
            upcoming_events.append(summary)
        else:
            past_events.append(summary)

    analytics = OrganizerAnalytics(
        total_followers=db.query(Follow).filter(Follow.following_ID == user_id).count(),
        total_likes_last_7_days=recent_likes,
        total_rsvps_last_7_days=recent_rsvps,
        trust_score=score,
        trust_badge=badge
    )

    return OrganizerProfileViewResponse(
        username=user.username,
        full_name=f"{user.first_Name} {user.last_Name}",
        company_name=organizer.company_Name,
        business_description=organizer.business_Description,
        verification_status=organizer.verification_Status,
        profile_picture_url=profile_pic_url,
        analytics=analytics,
        upcoming_events=upcoming_events,
        past_events=past_events
    )
