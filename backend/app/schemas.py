from typing import List, Optional, Literal, Union
from pydantic import BaseModel, EmailStr, Field
from datetime import date, time, datetime

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


class RecurringEventPatternCreate(BaseModel):
    frequency: str  # e.g. "daily", "weekly"
    repeat_interval: Optional[int] = 1
    days_of_week: Optional[List[str]] = None
    day_of_month: Optional[int] = None
    month_of_year: Optional[int] = None
    start_date: date
    end_date: Optional[date] = None
    max_occurrences: Optional[int] = None

class EventCreate(BaseModel):
    event_type: str
    event_name: str
    event_location: Optional[str]
    event_category: Optional[str]
    celebrity: Optional[str]
    event_date: date
    start_time: time
    end_time: Optional[time]
    event_description: Optional[str]
    is_free: Optional[bool] = False
    is_paid: Optional[bool] = True
    max_capacity: Optional[int]
    is_recurring: Optional[bool] = False
    recurring_pattern: Optional[RecurringEventPatternCreate] = None


class EventSummary(BaseModel):
    event_id: int
    name: str
    date: date
    start_time: time
    end_time: Optional[time]
    status: str
    thumbnail_url: Optional[str]  # from eventcontent
    rsvp_count: int
    like_count: int

class OrganizerAnalytics(BaseModel):
    total_followers: int
    total_likes_last_7_days: int
    total_rsvps_last_7_days: int
    trust_score: int
    trust_badge: Optional[str]  

class OrganizerProfileViewResponse(BaseModel):
    username: str
    full_name: str
    company_name: Optional[str]
    business_description: Optional[str]
    verification_status: str
    profile_picture_url: Optional[str]
    
    analytics: OrganizerAnalytics
    upcoming_events: List[EventSummary]
    past_events: List[EventSummary]


class FollowResponse(BaseModel):
    follow_ID: int
    follower_ID: int
    following_ID: int
    created_At: datetime

    class Config:
        from_attributes = True

class EventResponse(BaseModel):
    event_ID: int
    event_Name: str
    event_Location: Optional[str]
    event_Category: Optional[str]
    event_Date: date
    start_Time: time
    end_Time: Optional[time]
    is_Free: Optional[bool]
    celebrity: Optional[str]
    created_At: Optional[datetime]

    class Config:
        from_attributes = True  


# -------------------- RSVP --------------------
class RSVPRequest(BaseModel):
    event_ID: int
    rsvp_Status: Literal["confirmed", "cancelled", "pending"] = "confirmed"
    note: Optional[str] = None
    guest_Count: Optional[int] = 1

class RSVPResponse(BaseModel):
    rsvp_ID: int
    user_ID: int
    event_ID: int
    rsvp_Status: str
    note: Optional[str]
    guest_Count: Optional[int]
    created_At: datetime

    class Config:
        from_attributes = True

# -------------------- Like --------------------
class LikeRequest(BaseModel):
    entity_ID: int
    entity_Type: Literal["event", "comment"]

class LikeResponse(BaseModel):
    like_ID: int
    user_ID: int
    entity_ID: int
    entity_Type: str
    created_At: datetime

    class Config:
        from_attributes = True

# -------------------- Save --------------------
class SaveRequest(BaseModel):
    event_ID: int
    collection_Name: Optional[str] = None
    entity_Type: Literal["event"] = "event"

class SaveResponse(BaseModel):
    save_ID: int
    user_ID: int
    event_ID: int
    collection_Name: Optional[str]
    entity_Type: str
    created_At: datetime

    class Config:
        from_attributes = True

# -------------------- Comment --------------------
class CommentCreateRequest(BaseModel):
    event_ID: int
    content: str = Field(..., min_length=1)

class CommentResponse(BaseModel):
    comment_ID: int
    user_ID: int
    event_ID: int
    content: str
    created_At: datetime

    class Config:
        from_attributes = True

# -------------------- Share --------------------
class ShareRequest(BaseModel):
    event_ID: int

class ShareResponse(BaseModel):
    share_ID: int
    user_ID: int
    event_ID: int
    created_At: datetime

    class Config:
        from_attributes = True

# -------------------- Public Profile --------------------
class PublicUserProfileResponse(BaseModel):
    user_ID: int
    username: Optional[str]
    display_name: Optional[str]
    bio: Optional[str]
    profile_picture_url: Optional[str]
    joined: Optional[datetime] = None
    location: Optional[str] = None
    event_count: Optional[int] = 0
    follower_count: Optional[int] = 0
    trust_score: Optional[int] = 0

    class Config:
        from_attributes = True
