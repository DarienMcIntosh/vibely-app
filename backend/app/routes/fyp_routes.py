from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.utils.auth_dependencies import get_current_user
from app.services.fyp_services import get_hybrid_fyp_events
from app.schemas import EventResponse

router = APIRouter(prefix="/fyp", tags=["FYP"])

@router.get("/", response_model=List[EventResponse])
def get_fyp_events(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_hybrid_fyp_events(current_user.user_ID, db)
