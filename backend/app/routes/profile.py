from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from app.schemas import UserProfileResponse
from app.utils.jwt_handler import get_current_user_id
from app.database import get_db
from app.services.profile_services import get_eventgoer_profile, update_eventgoer_profile, complete_organizer_profile
from typing import List


router = APIRouter(prefix="/api", tags=["Profile"])

@router.get("/profile", response_model=UserProfileResponse)
def view_profile(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    profile = get_eventgoer_profile(db, current_user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile")
async def edit_profile(
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    username: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    result = await update_eventgoer_profile(
        db=db,
        user_id=current_user_id,
        first_name=first_name,
        last_name=last_name,
        username=username,
        bio=bio,
        profile_picture=profile_picture
    )

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])

    return result



@router.post("/complete-organizer-profile")
async def register_organizer_profile(
    username: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    company_name: str = Form(...),
    business_description: str = Form(...),
    event_types: List[str] = Form(...),
    city: str = Form(...),
    country: str = Form(...),
    is_business_registered: bool = Form(...),
    profile_picture: UploadFile = File(None),
    certificate: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    result = await complete_organizer_profile(
        db=db,
        user_id=current_user_id,
        username=username,
        first_name=first_name,
        last_name=last_name,
        company_name=company_name,
        business_description=business_description,
        event_types=event_types,
        city=city,
        country=country,
        is_business_registered=is_business_registered,
        profile_picture=profile_picture,
        certificate=certificate
    )

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])

    return result