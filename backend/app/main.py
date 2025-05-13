from fastapi import FastAPI
from app.routes import auth, profile, events, interactions
from app.database import engine
from app.models import user



user.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(events.router)
app.include_router(interactions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to viberly API"}
