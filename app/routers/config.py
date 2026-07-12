from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from app.models import Business, BotConfig
from app.schemas import BotConfigUpdate, BotConfigResponse
from app.services.bot_prompt import preview_prompt

router = APIRouter(prefix="/api/businesses", tags=["config"])


async def _get_business_and_config(business_id: str, db: AsyncSession):
    biz = await db.get(Business, business_id)
    if not biz:
        raise HTTPException(404, "Business not found")
    result = await db.execute(select(BotConfig).where(BotConfig.business_id == business_id))
    cfg = result.scalar_one_or_none()
    if not cfg:
        raise HTTPException(404, "Config not found")
    return biz, cfg


@router.get("/{business_id}/config", response_model=BotConfigResponse)
async def get_config(business_id: str, db: AsyncSession = Depends(get_db)):
    biz, cfg = await _get_business_and_config(business_id, db)
    return BotConfigResponse(
        greeting=cfg.greeting,
        tone=cfg.tone,
        languages=cfg.languages,
        knowledge=cfg.knowledge,
        business_hours=cfg.business_hours,
        offline_message=cfg.offline_message,
        lead_capture=cfg.lead_capture,
        appointment_detection=cfg.appointment_detection,
        handoff_keyword=cfg.handoff_keyword,
        system_prompt_preview=preview_prompt(biz, cfg),
    )


@router.put("/{business_id}/config", response_model=BotConfigResponse)
async def update_config(business_id: str, req: BotConfigUpdate, db: AsyncSession = Depends(get_db)):
    biz, cfg = await _get_business_and_config(business_id, db)
    for field, value in req.model_dump(exclude_none=True).items():
        setattr(cfg, field, value)
    await db.commit()
    return BotConfigResponse(
        greeting=cfg.greeting,
        tone=cfg.tone,
        languages=cfg.languages,
        knowledge=cfg.knowledge,
        business_hours=cfg.business_hours,
        offline_message=cfg.offline_message,
        lead_capture=cfg.lead_capture,
        appointment_detection=cfg.appointment_detection,
        handoff_keyword=cfg.handoff_keyword,
        system_prompt_preview=preview_prompt(biz, cfg),
    )
