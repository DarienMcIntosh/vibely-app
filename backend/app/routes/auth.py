from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
from app.schemas import RegisterRequest, SocialLoginRequest, UserTypeModel, LoginRequest
from app.services.auth_services import register_user, social_login, login_user
from app.services.profile_services import complete_attendee_profile
from app.utils.jwt_handler import get_current_user_id
from app.services.user_service import update_user_role
from app.database import get_db

router = APIRouter(prefix="/api", tags=["Authentication"])

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
    preferences: List[str] = Form(...),
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

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data.identifier, data.password)
