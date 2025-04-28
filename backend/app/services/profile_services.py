import os
import shutil
from app.utils.firebase import upload_file_to_firebase
from app.models.user import User
from app.models.userprofiles import UserProfile
from app.models.mediaassets import MediaAsset
from sqlalchemy.orm import Session
from fastapi import UploadFile
from typing import Optional, List

def complete_attendee_profile(
    db: Session,
    user_id: int,
    display_name: str,
    first_name: str,
    last_name: str,
    city: str,
    country: str,
    preferences: list,
    bio: Optional[str]= None,
    profile_picture: Optional[UploadFile] = None
):
    try:
        # Update user table
        user = db.query(User).filter(User.user_ID == user_id).first()
        if not user:
            return {"status": "error", "message": "User not found"}

        user.username = display_name.replace(" ", "_").lower()  # ✅ Update username in users table
        user.first_Name = first_name
        user.last_Name = last_name
        user.city = city
        user.country = country
        user.account_Status = "active"

        profile_picture_id = None

        # Handle Profile Picture Upload
        if profile_picture:
            temp_dir = "temp_uploads"
            os.makedirs(temp_dir, exist_ok=True)
            temp_file_path = os.path.join(temp_dir, profile_picture.filename)

            with open(temp_file_path, "wb") as buffer:
                shutil.copyfileobj(profile_picture.file, buffer)

            firebase_url = upload_file_to_firebase(temp_file_path, "profile_pictures")

            media_asset = MediaAsset(
                user_ID=user_id,
                asset_Type="profile_image",
                cdn_URL=firebase_url,
                original_Filename=profile_picture.filename,
                file_Size=os.path.getsize(temp_file_path),
                status="active"
            )
            db.add(media_asset)
            db.commit()
            db.refresh(media_asset)

            profile_picture_id = media_asset.asset_ID

            os.remove(temp_file_path)

        # Create or Update User Profile
        existing_profile = db.query(UserProfile).filter(UserProfile.user_ID == user_id).first()

        if existing_profile:
            existing_profile.display_Name = display_name  # ✅ Display Name
            existing_profile.bio = bio
            existing_profile.preferences = preferences
            if profile_picture_id:
                existing_profile.profile_PictureID = profile_picture_id
        else:
            new_profile = UserProfile(
                user_ID=user_id,
                display_Name=display_name,
                bio=bio,
                preferences=preferences,
                profile_PictureID=profile_picture_id
            )
            db.add(new_profile)

        db.commit()

        return {
            "status": "success",
            "message": "Profile completed successfully",
            "user_id": user_id
        }
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
