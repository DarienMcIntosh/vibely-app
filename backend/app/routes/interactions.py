from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.interaction_services import log_event_interaction, rsvp_to_event, toggle_save_event, log_event_view
from app.database import get_db
from app.utils.auth_dependencies import get_current_user


router = APIRouter()

@router.post("/interactions/log", tags=["Interactions"])
def test_log_interaction(
    event_id: int,
    rsvp: bool = False,
    saved: bool = False,
    clicked: bool = False,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return log_event_interaction(
        db,
        user_id=current_user.user_ID,
        event_id=event_id,
        rsvp=rsvp,
        saved=saved,
        clicked=clicked
    )


@router.post("/{event_id}/rsvp")
def rsvp(event_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return rsvp_to_event(db, user_id=current_user.user_ID, event_id=event_id)

@router.post("/{event_id}/save")
def save(event_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return toggle_save_event(db, user_id=current_user.user_ID, event_id=event_id)

@router.post("/{event_id}/view")
def view(event_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return log_event_view(db, user_id=current_user.user_ID, event_id=event_id)