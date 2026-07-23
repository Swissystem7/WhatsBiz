from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from app.models import Business, BotConfig, Conversation, Message
from app.schemas import ChatRequest, ChatResponse, ConversationOut, MessageOut
from app.services.bot_prompt import build_system_prompt
from app.services.claude import get_claude_reply

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat/demo", response_model=ChatResponse)
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    biz = await db.get(Business, req.business_id)
    if not biz:
        raise HTTPException(404, "Business not found")
    result = await db.execute(select(BotConfig).where(BotConfig.business_id == req.business_id))
    cfg = result.scalar_one_or_none()
    if not cfg:
        raise HTTPException(404, "Bot config not found")
    conv = await db.get(Conversation, req.conversation_id) if req.conversation_id else None
    if not conv:
        conv = Conversation(business_id=req.business_id, customer_name=req.customer_name)
        db.add(conv)
        await db.flush()
    hist_result = await db.execute(select(Message).where(Message.conversation_id == conv.id).order_by(Message.id))
    history = [{"role": m.role, "content": m.content} for m in hist_result.scalars().all()]
    if cfg.handoff_keyword.lower() in req.message.lower():
        reply = "מיד אחבר אותך לנציג שלנו. אנא המתן רגע."
        conv.needs_human = True
    else:
        history.append({"role": "user", "content": req.message})
        reply = await get_claude_reply(build_system_prompt(biz, cfg), history)
        if any(word in reply for word in ["שם", "טלפון", "פרטים", "ליצור קשר"]):
            conv.is_lead = True
    db.add(Message(conversation_id=conv.id, role="user", content=req.message))
    db.add(Message(conversation_id=conv.id, role="assistant", content=reply))
    await db.commit()
    return ChatResponse(conversation_id=conv.id, reply=reply, needs_human=conv.needs_human, is_lead=conv.is_lead)


@router.get("/businesses/{business_id}/conversations", response_model=list[ConversationOut])
async def list_conversations(business_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Conversation).where(Conversation.business_id == business_id).order_by(Conversation.created_at.desc()))
    return result.scalars().all()


@router.get("/conversations/{conv_id}/messages", response_model=list[MessageOut])
async def list_messages(conv_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Message).where(Message.conversation_id == conv_id).order_by(Message.id))
    return result.scalars().all()


@router.delete("/conversations/{conv_id}")
async def delete_conversation(conv_id: str, db: AsyncSession = Depends(get_db)):
    conv = await db.get(Conversation, conv_id)
    if conv:
        msgs = await db.execute(select(Message).where(Message.conversation_id == conv_id))
        for message in msgs.scalars().all():
            await db.delete(message)
        await db.delete(conv)
        await db.commit()
    return {"ok": True}
