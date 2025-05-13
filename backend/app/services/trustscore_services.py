from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.trustscore import TrustScore
from app.models.user import User
from app.models.organizers import Organizer
from app.models.eventattendees import EventAttendee
from app.models.rsvps import RSVP
from app.models.eventreviews import EventReview
from app.models.likes import Like
from app.models.event import Event
from app.models.eventoccurrences import EventOccurrence
from app.models.eventflags import EventFlag  

def calculate_trust_score(db: Session, user_id: int) -> int:
    base_score = 50

    user = db.query(User).filter(User.user_ID == user_id).first()
    organizer = db.query(Organizer).filter(Organizer.user_ID == user_id).first()
    if not user or not organizer:
        return 0

    trust_records = db.query(TrustScore).filter(TrustScore.user_ID == user_id).all()
    awarded_reasons = [t.reason for t in trust_records]

    # Business Verification
    if organizer.verification_Status == "business_verified" and "Verified business via ORC" not in awarded_reasons:
        db.add(TrustScore(user_ID=user_id, score=10, reason="Verified business via ORC"))
        base_score += 10

    # Event attendance
    attendee_count = db.query(EventAttendee).filter(EventAttendee.user_ID == user_id).count()
    base_score += attendee_count

    # Recent RSVPs
    cutoff = datetime.utcnow() - timedelta(days=30)
    recent_rsvp_count = db.query(RSVP).filter(RSVP.user_ID == user_id, RSVP.created_At >= cutoff).count()
    base_score += recent_rsvp_count

    # Review rating
    reviews = db.query(EventReview).filter(EventReview.user_ID == user_id).all()
    valid_ratings = [r.rating for r in reviews if r.rating]
    if valid_ratings:
        avg_rating = sum(valid_ratings) / len(valid_ratings)
        base_score += round(avg_rating)

    # Likes
    total_likes = db.query(Like).join(Event, Event.event_ID == Like.entity_ID)\
        .filter(Event.organizer_ID == organizer.organizer_ID, Like.entity_Type == "event").count()
    base_score += total_likes // 10

    # Cancellations
    cancelled = db.query(EventOccurrence).join(Event).filter(
        Event.organizer_ID == organizer.organizer_ID,
        EventOccurrence.is_Cancelled == 1
    ).count()
    base_score -= 10 * cancelled

    # Flags
    resolved_flags = db.query(EventFlag).join(Event).filter(
        Event.organizer_ID == organizer.organizer_ID,
        EventFlag.status == "resolved"
    ).count()
    base_score -= 5 * resolved_flags

    # Account status
    if user.account_Status == "restricted":
        base_score -= 10
    elif user.account_Status == "banned":
        base_score -= 20

    # Update and persist
    final_score = max(0, base_score)
    organizer.trust_score = final_score
    db.commit()
    return final_score


def get_trust_badge(score: int) -> str:
    if score >= 90:
        return "Verified Elite"
    elif score >= 60:
        return "Trusted"
    elif score >= 30:
        return "Caution"
    else:
        return "Untrusted"
