from app.models.user import User
from app.utils.jwt_handler import create_access_token
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from fastapi import HTTPException
import requests
from app.config import AUTH0_DOMAIN

def register_user(db: Session, email: str, password: str):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists.")
    
    hashed_pw = bcrypt.hash(password)

    user = User(
        username=email.split("@")[0], #tempora username from email until usernm is provided
        email=email,
        hash_Password=hashed_pw,
        account_Status = "pending",
        user_Type = "standard"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.user_ID)})
    return {"access_token": token, "token_type": "bearer", "user_id": user.user_ID}

def social_login(db: Session, id_token: str):
    url = f"https://{AUTH0_DOMAIN}/userinfo"
    headers = {"Authorization": f"Bearer {id_token}"}
    respond = requests.get(url, headers=headers)

    if not respond.ok:
        raise HTTPException(status_code=400, detail="Invalid Auth0 token.")
    
    userinfo = respond.json()
    email = userinfo.get("email")
    name = userinfo.get("name", "")

    if not email:
        raise HTTPException(status_code=400, detail="Email not available from Auth0.")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            username=email.split("@")[0],
            email=email,
            auth_provider="auth0",
            user_Type="standard",
            account_Status="active"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": str(user.user_ID)})
    return {"access_token": token, "token_type": "bearer"}
