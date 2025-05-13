from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import EventCreate
from app.services.event_services import create_event
from app.models.user import User
from app.models.organizers import Organizer
from fastapi.responses import JSONResponse
from app.utils.auth_dependencies import get_current_user
import json

router = APIRouter()

@router.post("/organizer/events", status_code=201)
async def create_event_for_organizer(
    request: str = Form(...),
    media: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Parse the incoming JSON string to a Pydantic model
        parsed_request = EventCreate(**json.loads(request))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request format: {str(e)}")

    # Validate organizer
    organizer = db.query(Organizer).filter(Organizer.user_ID == current_user.user_ID).first()
    if not organizer:
        raise HTTPException(status_code=404, detail="Organizer profile not found")
    if current_user.account_Status in ["banned", "restricted"]:
        raise HTTPException(status_code=403, detail="Organizer is not allowed to post events")

    # Check media type
    if not media.content_type.startswith("image/") and not media.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Only image or video files are allowed")

    try:
        result = await create_event(
            db=db,
            organizer_id=organizer.organizer_ID,
            event_data=parsed_request,
            media=media
        )
        return JSONResponse(content={"status": "success", "event_id": result.event_ID}, status_code=201)
    except Exception as e:
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=400)


