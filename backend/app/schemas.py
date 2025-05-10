from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import date, time

# -------- AUTH SCHEMAS --------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class SocialLoginRequest(BaseModel):
    id_token: str


class LoginRequest(BaseModel):
    identifier: str 
    password: str


class UserTypeModel(BaseModel):
    user_type: str = Field(..., description="Either 'event_goer' or 'event_organizer'")


# -------- PROFILE SCHEMAS --------
class UserProfileResponse(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    username: Optional[str]
    display_name: Optional[str]
    bio: Optional[str]
    profile_picture_url: Optional[str]
    preferences: Optional[List[str]]

    class Config:
        orm_mode = True


class UpdateProfileRequest(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    username: Optional[str]
    bio: Optional[str]


class MediaAssetResponse(BaseModel):
    asset_ID: int
    cdn_URL: str
    asset_Type: str  # e.g., "image", "video"

    class Config:
        orm_mode = True


class EventBase(BaseModel):
    event_ID: int
    event_Name: str
    event_Location: Optional[str]
    event_Date: date
    start_Time: time
    end_Time: Optional[str]
    event_Description: Optional[str]
    is_Free: bool
    is_Paid: bool
    event_Status: Optional[str]
    media: List[MediaAssetResponse] = [] 

    class Config:
        orm_mode = True

class FullEventGoerProfileResponse(UserProfileResponse):
    saved_events: List[EventBase] = []
    upcoming_events: List[EventBase] = []
    past_events: List[EventBase] = []
    rsvp_events: List[EventBase] = []
    following_count: int



class OrganizerProfileCreateRequest(BaseModel):
    username: str = Field(..., description="Unique username with no spaces")
    first_name: str
    last_name: str
    company_name: str
    business_description: Optional[str] = None
    #trn_number: Optional[str] = None
    event_types: List[str]
    city: str
    country: str
    is_business_registered: bool = Field(..., description="Indicates whether the organizer has a registered business")

# For API responses
class OrganizerProfileResponse(BaseModel):
    organizer_id: int
    user_id: int
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    company_name: Optional[str]
    business_description: Optional[str]
    event_types: List[str]
    verification_status: str
    trust_score: int
    city: Optional[str]
    country: Optional[str]
    profile_picture_url: Optional[str]

    class Config:
        orm_mode = True
