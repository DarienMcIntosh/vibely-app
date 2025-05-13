from app.models import User, Event, EventAttendee, Follow, Organizer
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict
from app.services.ml_fyp_services import get_ml_ranked_events
from app.models.eventinteractions import EventInteraction

def get_user_data(user_id: int, db: Session) -> Dict:
    user = db.query(User).filter(User.user_ID == user_id).first()

    preferences = user.profile.preferences if user.profile else []
    city = user.city
    country = user.country

    followed_organizers = [
        f.following_ID for f in db.query(Follow).filter_by(follower_ID=user_id).all()
    ]

    rsvp_history = [
        a.event.event_Category for a in db.query(EventAttendee).filter_by(user_ID=user_id).all()
        if hasattr(a, "event") and a.event
    ]

    return {
        "city": city,
        "country": country,
        "preferences": preferences,
        "followed_organizers": followed_organizers,
        "rsvp_history": rsvp_history
    }


def get_event_data(event: Event, db: Session) -> Dict:
    rsvp_count = db.query(EventAttendee).filter_by(event_ID=event.event_ID).count()
    organizer = db.query(Organizer).filter_by(user_ID=event.organizer_ID).first()
    trust_score = getattr(organizer, "trust_score", 0)
    return {
        "rsvp_count": rsvp_count,
        "trust_score": trust_score
    }


def calculate_event_score(user_data: Dict, event: Event, event_data: Dict) -> int:
    score = 0

    if user_data["city"] and user_data["city"].lower() == (event.event_Location or "").lower():
        score += 12
    elif user_data["country"] and user_data["country"].lower() in (event.event_Location or "").lower():
        score += 6

    if event.event_Category in user_data["preferences"]:
        score += 15

    if event.organizer_ID in user_data["followed_organizers"]:
        score += 10

    if event.event_Category in user_data["rsvp_history"]:
        score += 8

    score += min(10, event_data["rsvp_count"])

    if (datetime.utcnow() - event.created_At).days < 3:
        score += 10
    if event_data["rsvp_count"] >= 50:
        score += 5

    if event.celebrity:
        score += 8

    if event.is_Free:
        score += 5

    if event_data["trust_score"] >= 80:
        score += 10
    elif event_data["trust_score"] >= 60:
        score += 5

    return score


def get_top_fyp_events(user_id: int, db: Session, top_n: int = 10) -> List[Event]:
    user_data = get_user_data(user_id, db)
    all_events = db.query(Event).all()
    scored = []

    for event in all_events:
        event_data = get_event_data(event, db)
        score = calculate_event_score(user_data, event, event_data)
        scored.append((event, score))

    sorted_events = sorted(scored, key=lambda x: x[1], reverse=True)
    return [e[0] for e in sorted_events[:top_n]]


def get_hybrid_fyp_events(user_id: int, db: Session, top_n: int = 10):
    """
    Uses ML model if user has >=100 interactions (RSVPs, saves, clicks),
    else falls back to rule-based FYP logic.
    """
    interaction_count = db.query(EventInteraction).filter_by(user_id=user_id).count()

    if interaction_count >= 100:
        return get_ml_ranked_events(user_id, db, top_n)

    return get_top_fyp_events(user_id, db, top_n)
