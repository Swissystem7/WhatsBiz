from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class OnboardingRequest(BaseModel):
    name: str
    industry: str
    phone: str = ""
    description: str = ""
    greeting: str = "שלום! איך אפשר לעזור לך?"
    tone: str = "ידידותי"
    languages: str = "עברית"
    knowledge: str = ""


class OnboardingResponse(BaseModel):
    business_id: str
    webhook_token: str
    name: str


class BotConfigUpdate(BaseModel):
    greeting: Optional[str] = None
    tone: Optional[str] = None
    languages: Optional[str] = None
    knowledge: Optional[str] = None
    business_hours: Optional[str] = None
    offline_message: Optional[str] = None
    lead_capture: Optional[bool] = None
    appointment_detection: Optional[bool] = None
    handoff_keyword: Optional[str] = None


class BotConfigResponse(BaseModel):
    greeting: str
    tone: str
    languages: str
    knowledge: str
    business_hours: str
    offline_message: str
    lead_capture: bool
    appointment_detection: bool
    handoff_keyword: str
    system_prompt_preview: str


class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime


class ConversationOut(BaseModel):
    id: str
    customer_name: str
    needs_human: bool
    is_lead: bool
    created_at: datetime


class ChatRequest(BaseModel):
    business_id: str
    conversation_id: Optional[str] = None
    message: str
    customer_name: str = "לקוח"


class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    needs_human: bool
    is_lead: bool
