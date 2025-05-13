import tensorflow as tf
import numpy as np
from typing import List
from sqlalchemy.orm import Session
from app.models.event import Event
from app.models.organizers import Organizer
from app.models.userprofiles import UserProfile

MODEL_PATH = "app/ml/models/saved_models/fyp_model.h5"

def extract_event_features(user_id: int, event: Event, db: Session) -> List[float]:
    """
    Extracts ML input features for a given user and event.
    - category_match: 1 if event category is in user's preferences
    - location_match: 1 if user's city == event location
    - trust_score: organizer's trust score
    """
    user_profile = db.query(UserProfile).filter_by(user_id=user_id).first()
    organizer = db.query(Organizer).filter_by(user_ID=event.organizer_id).first()

    if not user_profile or not event or not organizer:
        return [0, 0, 0]  # fallback values

    preferences = user_profile.preferences or []
    category_match = int(event.event_category in preferences)

    location_match = int(
        user_profile.city and event.event_location and
        user_profile.city.lower() == event.event_location.lower()
    )

    trust_score = organizer.trust_score or 0

    return [category_match, location_match, trust_score]

def get_ml_ranked_events(user_id: int, db: Session, top_n: int = 10) -> List[Event]:
    """
    Ranks all events using the trained ML model.
    """
    model = tf.keras.models.load_model(MODEL_PATH)
    all_events = db.query(Event).all()

    results = []
    for event in all_events:
        features = extract_event_features(user_id, event, db)
        input_vector = np.array([features])
        score = model.predict(input_vector, verbose=0)[0][0]
        results.append((event, score))

    sorted_events = sorted(results, key=lambda x: x[1], reverse=True)
    return [e[0] for e in sorted_events[:top_n]]
