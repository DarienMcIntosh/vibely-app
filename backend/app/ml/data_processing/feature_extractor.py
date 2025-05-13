from sqlalchemy.orm import Session
import pandas as pd
from app.models.eventinteractions import EventInteraction
from app.models.event import Event
from app.models.organizers import Organizer
from app.models.userprofiles import UserProfile

def build_training_dataset(db: Session):
    rows = []

    interactions = db.query(EventInteraction).all()

    for i in interactions:
        event = i.event
        user_profile = i.user.profile
        organizer = event.organizer if event else None

        if not (event and user_profile and organizer):
            continue

        # Feature: category match
        interests = user_profile.preferences or []
        category_match = int(event.event_Category in interests)

        # Feature: location match
        location_match = int(user_profile.city and event.event_Location and
                             user_profile.city.lower() == event.event_Location.lower())

        # Feature: trust score
        trust_score = organizer.trust_score or 0

        # Target label
        label = int(i.rsvp or i.saved)

        rows.append({
            "user_id": i.user_id,
            "event_id": i.event_id,
            "category_match": category_match,
            "location_match": location_match,
            "trust_score": trust_score,
            "rsvp": int(i.rsvp),
            "saved": int(i.saved),
            "clicked": int(i.clicked),
            "label": label
        })

    df = pd.DataFrame(rows)
    return df
