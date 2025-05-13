from app.models.user import User
from sqlalchemy.orm import Session
from fastapi import HTTPException

def update_user_role(db: Session, user_id: int, user_type: str):
    user = db.query(User).filter(User.user_ID == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if user_type not in ["event_goer", "event_organizer"]:
        raise HTTPException(status_code=400, detail="Invalid user type.")

    user.user_Type = user_type
    db.commit()
    db.refresh(user)
    
    return {"message": "User type updated successfully.", "user_type": user.user_Type}
