# app/utils/file_utils.py
import os
import uuid
from fastapi import UploadFile

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