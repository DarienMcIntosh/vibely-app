import firebase_admin
from firebase_admin import credentials, storage
import uuid
import os
from app.config import FIREBASE_CREDENTIALS_PATH, FIREBASE_STORAGE_BUCKET

# Initialize Firebase app
cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
firebase_admin.initialize_app(cred, {
    'storageBucket': FIREBASE_STORAGE_BUCKET
})

def upload_file_to_firebase(file_path: str, destination_folder: str) -> str:
    """
    Uploads a file to Firebase Storage and returns the public URL.
    """
    bucket = storage.bucket()

    filename = f"{destination_folder}/{uuid.uuid4().hex}{os.path.splitext(file_path)[1]}"
    blob = bucket.blob(filename)

    blob.upload_from_filename(file_path)
    blob.make_public()

    return blob.public_url
