from sqlalchemy.orm import Session
from app.models.eventinteractions import EventInteraction
from datetime import datetime
from app.models.eventinteractions import EventInteraction
from app.models.eventattendees import EventAttendee
from app.models.event import Event
from app.models.saveditems import SavedItem

def log_event_interaction(
    db: Session,
    user_id: int,
    event_id: int,
    rsvp: bool = False,
    saved: bool = False,
    clicked: bool = False
) -> EventInteraction:
    interaction = EventInteraction(
        user_id=user_id,
        event_id=event_id,
        rsvp=rsvp,
        saved=saved,
        clicked=clicked,
        interaction_date=datetime.utcnow()
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction

def rsvp_to_event(db: Session, user_id: int, event_id: int):
    # Check if already RSVPed
    existing = db.query(EventAttendee).filter_by(user_id=user_id, event_id=event_id).first()
    if existing:
        return {"status": "already_rsvped"}

    rsvp = EventAttendee(user_id=user_id, event_id=event_id, timestamp=datetime.utcnow())
    db.add(rsvp)

    # Log interaction
    interaction = EventInteraction(
        user_id=user_id,
        event_id=event_id,
        rsvp=True,
        interaction_date=datetime.utcnow()
    )
    db.add(interaction)
    db.commit()

    return {"status": "rsvp_successful"}

def toggle_save_event(db: Session, user_id: int, event_id: int):
    existing = db.query(SavedItem).filter_by(user_id=user_id, entity_ID=event_id, entity_Type="event").first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "unsaved"}

    save = SavedItem(
        user_id=user_id,
        entity_ID=event_id,
        entity_Type="event",
        created_At=datetime.utcnow()
    )
    db.add(save)

    # Log interaction
    interaction = EventInteraction(
        user_id=user_id,
        event_id=event_id,
        saved=True,
        interaction_date=datetime.utcnow()
    )
    db.add(interaction)
    db.commit()

    return {"status": "saved"}

def log_event_view(db: Session, user_id: int, event_id: int):
    interaction = EventInteraction(
        user_id=user_id,
        event_id=event_id,
        clicked=True,
        interaction_date=datetime.utcnow()
    )
    db.add(interaction)
    db.commit()
    return {"status": "view_logged"}
