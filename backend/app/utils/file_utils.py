# app/utils/file_utils.py
import os
import uuid
from fastapi import UploadFile
import shutil
from app.models.mediaassets import MediaAsset
from sqlalchemy.orm import Session
from app.utils.firebase import upload_file_to_firebase



async def upload_to_storage(file: UploadFile) -> str:
    """Upload file to cloud storage or local storage and return URL"""
 
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    

    upload_dir = "uploads/profile_pictures"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, unique_filename)
    

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
   
    return f"/static/{upload_dir}/{unique_filename}"


async def save_temp_file(file: UploadFile) -> str:
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)

    # Defensive check
    if not file.filename:
        raise ValueError("Uploaded file has no filename.")

    temp_path = os.path.join(temp_dir, file.filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return temp_path


def delete_temp_file(path: str):
    """Safely delete a temporary file if it exists."""
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"Warning: Failed to delete temp file {path}. Reason: {e}")


async def upload_and_store_file(
    db: Session,
    file: UploadFile,
    user_id: int,
    asset_type: str,
    folder: str = "profile_pictures"
) -> int:
    temp_path = await save_temp_file(file)
    try:
        cdn_url = upload_file_to_firebase(temp_path, folder)

        media_asset = MediaAsset(
            user_ID=user_id,
            asset_Type=asset_type,
            cdn_URL=cdn_url,
            original_Filename=file.filename,
            file_Size=os.path.getsize(temp_path),
            status="active"
        )
        db.add(media_asset)
        db.commit()
        db.refresh(media_asset)
        return media_asset.asset_ID
    finally:
        delete_temp_file(temp_path)
