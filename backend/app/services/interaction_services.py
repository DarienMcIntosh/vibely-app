from sqlalchemy.orm import Session
from datetime import datetime
from app.models import RSVP, Like, SavedItem, Comment, ShareLog, Event, User, EventInteraction, EventAttendee
from app.schemas import *
from app.services.trustscore_services import calculate_trust_score

# -------------------- RSVP --------------------
def rsvp_to_event(db: Session, user_id: int, request: RSVPRequest):
    existing = db.query(RSVP).filter_by(user_ID=user_id, event_ID=request.event_ID).first()
    if existing:
        existing.rsvp_Status = request.rsvp_Status
        existing.note = request.note
        existing.guest_Count = request.guest_Count
        existing.updated_At = datetime.utcnow()
    else:
        new_rsvp = RSVP(user_ID=user_id, **request.dict())
        db.add(new_rsvp)

    db.commit()

    # Log for FYP
    db.add(EventInteraction(
        user_id=user_id,
        event_id=request.event_ID,
        rsvp=True,
        interaction_date=datetime.utcnow()
    ))
    db.commit()

    calculate_trust_score(db, user_id)
    return db.query(RSVP).filter_by(user_ID=user_id, event_ID=request.event_ID).first()

# -------------------- Like --------------------
def toggle_like(db: Session, user_id: int, request: LikeRequest):
    like = db.query(Like).filter_by(user_ID=user_id, entity_ID=request.entity_ID, entity_Type=request.entity_Type).first()
    if like:
        db.delete(like)
    else:
        db.add(Like(user_ID=user_id, **request.dict()))
        db.add(EventInteraction(
            user_id=user_id,
            event_id=request.entity_ID,
            liked=True,
            interaction_date=datetime.utcnow()
        ))
    db.commit()
    calculate_trust_score(db, user_id)
    return True

# -------------------- Save --------------------
def toggle_save(db: Session, user_id: int, request: SaveRequest):
    saved = db.query(SavedItem).filter_by(user_ID=user_id, event_ID=request.event_ID).first()
    if saved:
        db.delete(saved)
        db.commit()
        return {"status": "unsaved"}

    db.add(SavedItem(user_ID=user_id, **request.dict()))
    db.add(EventInteraction(
        user_id=user_id,
        event_id=request.event_ID,
        saved=True,
        interaction_date=datetime.utcnow()
    ))
    db.commit()
    return {"status": "saved"}

# -------------------- Comment --------------------
def add_comment(db: Session, user_id: int, request: CommentCreateRequest):
    comment = Comment(user_ID=user_id, **request.dict())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

# -------------------- Share --------------------
def log_share(db: Session, user_id: int, request: ShareRequest):
    db.add(ShareLog(user_ID=user_id, event_ID=request.event_ID))
    db.add(EventInteraction(
        user_id=user_id,
        event_id=request.event_ID,
        shared=True,
        interaction_date=datetime.utcnow()
    ))
    db.commit()
    return {"status": "shared"}

# -------------------- Public Profile --------------------
def get_public_user_profile(db: Session, target_user_id: int):
    user = db.query(User).filter_by(user_ID=target_user_id).first()
    if not user:
        return None

    follower_count = len(user.followers) if hasattr(user, "followers") else 0
    event_count = db.query(Event).filter_by(organizer_ID=target_user_id).count()

    return PublicUserProfileResponse(
        user_ID=user.user_ID,
        username=user.username,
        display_name=user.display_name,
        bio=user.bio,
        profile_picture_url=user.profile_picture_url,
        joined=user.created_At,
        location=user.city,
        event_count=event_count,
        follower_count=follower_count,
        trust_score=getattr(user.organizer, "trust_score", 0)
    )

# -------------------- Event View --------------------
def log_event_view(db: Session, user_id: int, event_id: int):
    db.add(EventInteraction(
        user_id=user_id,
        event_id=event_id,
        clicked=True,
        interaction_date=datetime.utcnow()
    ))
    db.commit()
    return {"status": "view_logged"}
