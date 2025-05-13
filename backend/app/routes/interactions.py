from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.interaction_services import (
    rsvp_to_event, toggle_save, toggle_like,
    add_comment, log_share, log_event_view
)
from app.database import get_db
from app.utils.auth_dependencies import get_current_user
from app.schemas import (
    RSVPRequest, RSVPResponse, SaveRequest, SaveResponse,
    LikeRequest, CommentCreateRequest, CommentResponse,
    ShareRequest, ShareResponse
)


router = APIRouter(prefix="/api/interactions", tags=["Interactions"])

# ----------- BASIC INTERACTION LOGGING -----------

# ----------- RSVP -----------
@router.post("/rsvp", response_model=RSVPResponse)
def rsvp(request: RSVPRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return rsvp_to_event(db, user_id=current_user.user_ID, request=request)

# ----------- SAVE -----------
@router.post("/save", response_model=SaveResponse)
def save_event(request: SaveRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return toggle_save(db, user_id=current_user.user_ID, event_id=request.event_ID)

# ----------- LIKE -----------
@router.post("/like")
def like_event(request: LikeRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return toggle_like(db, current_user.user_ID, request)

# ----------- COMMENT -----------
@router.post("/comment", response_model=CommentResponse)
def comment_event(request: CommentCreateRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return add_comment(db, current_user.user_ID, request)

# ----------- SHARE -----------
@router.post("/share", response_model=ShareResponse)
def share_event(request: ShareRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return log_share(db, current_user.user_ID, request)

# ----------- EVENT VIEW -----------
@router.post("/view")
def view_event(event_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return log_event_view(db, current_user.user_ID, event_id)
