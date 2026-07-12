import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


def gen_id() -> str:
    return str(uuid.uuid4())[:8]


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[str] = mapped_column(String(8), primary_key=True, default=gen_id)
    webhook_token: Mapped[str] = mapped_column(String(32), unique=True, default=lambda: str(uuid.uuid4()).replace("-", ""))
    name: Mapped[str] = mapped_column(String(200))
    industry: Mapped[str] = mapped_column(String(50))
    phone: Mapped[str] = mapped_column(String(30), default="")
    description: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    config: Mapped["BotConfig"] = relationship("BotConfig", back_populates="business", uselist=False)
    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="business")


class BotConfig(Base):
    __tablename__ = "bot_configs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    business_id: Mapped[str] = mapped_column(ForeignKey("businesses.id"))
    greeting: Mapped[str] = mapped_column(Text, default="שלום! איך אפשר לעזור לך?")
    tone: Mapped[str] = mapped_column(String(30), default="ידידותי")
    languages: Mapped[str] = mapped_column(String(50), default="עברית")
    knowledge: Mapped[str] = mapped_column(Text, default="")
    business_hours: Mapped[str] = mapped_column(Text, default="")
    offline_message: Mapped[str] = mapped_column(Text, default="אנחנו לא זמינים כרגע. נחזור אליך בהקדם!")
    lead_capture: Mapped[bool] = mapped_column(Boolean, default=True)
    appointment_detection: Mapped[bool] = mapped_column(Boolean, default=True)
    handoff_keyword: Mapped[str] = mapped_column(String(50), default="נציג")

    business: Mapped["Business"] = relationship("Business", back_populates="config")


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[str] = mapped_column(String(8), primary_key=True, default=gen_id)
    business_id: Mapped[str] = mapped_column(ForeignKey("businesses.id"))
    customer_name: Mapped[str] = mapped_column(String(100), default="לקוח")
    customer_phone: Mapped[str] = mapped_column(String(30), default="")
    needs_human: Mapped[bool] = mapped_column(Boolean, default=False)
    is_lead: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    business: Mapped["Business"] = relationship("Business", back_populates="conversations")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="conversation")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    conversation_id: Mapped[str] = mapped_column(ForeignKey("conversations.id"))
    role: Mapped[str] = mapped_column(String(10))  # user / assistant
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")
