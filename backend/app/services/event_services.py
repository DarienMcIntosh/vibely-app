from sqlalchemy.orm import Session
from fastapi import UploadFile
from app.models.event import Event
from app.models.eventoccurrences import EventOccurrence
from app.models.recurringeventpatterns import RecurringEventPattern
from app.models.eventcontent import EventContent
from app.utils.file_utils import upload_and_store_file
from app.schemas import EventCreate

async def create_event(db: Session, organizer_id: int, event_data: EventCreate, media: UploadFile):
    #upload media to Firebase & store in mediaassets
    media_asset_id = await upload_and_store_file(db, media, organizer_id, "event_media")

    #create the event
    new_event = Event(
        organizer_ID=organizer_id,
        event_Type=event_data.event_type,
        event_Name=event_data.event_name,
        event_Location=event_data.event_location,
        event_Category=event_data.event_category,
        celebrity=event_data.celebrity,
        event_Date=event_data.event_date,
        start_Time=event_data.start_time,
        end_Time=event_data.end_time,
        event_Description=event_data.event_description,
        is_Free=event_data.is_free,
        is_Paid=event_data.is_paid,
        max_Capacity=event_data.max_capacity,
        is_Recurring=event_data.is_recurring,
    )
    db.add(new_event)
    db.flush()  # get event_ID

    #add media as primary event content
    db.add(EventContent(
        event_ID=new_event.event_ID,
        asset_ID=media_asset_id,
        content_Type="primary",
        uploaded_By=organizer_id
    ))

    #handles recurrence logic
    if event_data.is_recurring and event_data.recurring_pattern:
        pattern = RecurringEventPattern(
            event_ID=new_event.event_ID,
            frequency=event_data.recurring_pattern.frequency,
            repeat_Interval=event_data.recurring_pattern.repeat_interval,
            days_Of_Week=','.join(event_data.recurring_pattern.days_of_week) if event_data.recurring_pattern.days_of_week else None,
            day_Of_Month=event_data.recurring_pattern.day_of_month,
            month_Of_Year=event_data.recurring_pattern.month_of_year,
            start_Date=event_data.recurring_pattern.start_date,
            end_Date=event_data.recurring_pattern.end_date,
            max_Occurrences=event_data.recurring_pattern.max_occurrences,
        )
        db.add(pattern)
        db.flush()

        db.add(EventOccurrence(
            event_ID=new_event.event_ID,
            pattern_ID=pattern.pattern_ID,
            occurrence_Date=pattern.start_Date,
            start_Time=event_data.start_time,
            end_Time=event_data.end_time,
        ))
    else:
        db.add(EventOccurrence(
            event_ID=new_event.event_ID,
            pattern_ID=None,
            occurrence_Date=event_data.event_date,
            start_Time=event_data.start_time,
            end_Time=event_data.end_time,
        ))

    db.commit()
    db.refresh(new_event)
    return new_event


