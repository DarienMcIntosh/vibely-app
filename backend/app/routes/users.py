from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.auth_dependencies import get_current_user
from app.services.interaction_services import get_public_user_profile
from app.schemas import PublicUserProfileResponse

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/{user_id}", response_model=PublicUserProfileResponse)
def view_user_profile(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    profile = get_public_user_profile(db, user_id)
    if not profile:
        return {"error": "User not found"}
    return profile
