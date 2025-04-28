from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict
from app.services.auth_services import register_user, social_login
from app.services.profile_services import complete_attendee_profile
from app.utils.jwt_handler import get_current_user_id
from app.database import get_db
from app.services.user_service import update_user_role
from fastapi import Form
from json import loads
from typing import List

router = APIRouter(prefix="/api", tags=["Authentication"])

# ---------- MODELS ----------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class SocialLoginRequest(BaseModel):
    id_token: str

class UserTypeModel(BaseModel):
    user_type: str = Field(..., description="Either 'event_goer' or 'event_organizer'")


# ---------- ROUTES ----------

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(db, data.email, data.password)

@router.post("/social-login")
def login_with_social(data: SocialLoginRequest, db: Session = Depends(get_db)):
    return social_login(db, data.id_token)

@router.post("/set-user-type")
def update_user_type(
    user_type_data: UserTypeModel,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    return update_user_role(db, current_user_id, user_type_data.user_type)

@router.post("/complete-attendee-profile")
async def update_attendee_profile(
    display_name: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    bio: Optional[str] = Form(None),
    city: str = Form(...),
    country: str = Form(...),
    preferences: List[str]= Form(...),
    profile_picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):

    result = complete_attendee_profile(
        db=db,
        user_id=current_user_id,
        display_name=display_name,
        first_name=first_name,
        last_name=last_name,
        bio=bio,
        city=city,
        country=country,
        preferences=preferences,
        profile_picture=profile_picture
    )

    
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result