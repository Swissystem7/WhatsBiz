from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.models import Business, BotConfig
from app.schemas import OnboardingRequest, OnboardingResponse

router = APIRouter(prefix="/api", tags=["onboarding"])
SEED_KNOWLEDGE = {
    "מסעדה": "תפריט ושעות פעילות לדוגמה בלבד; יש לעדכן בפרטי העסק.",
    "קליניקה": "יש ליצור קשר לקבלת מחיר וזמינות.",
    "חנות": "החזרות בתוך 14 יום עם קבלה.",
    "שירותים": "מחירים לפי הצעת מחיר.",
    "אחר": "אנא צרו קשר לפרטים נוספים.",
}


@router.post("/onboarding", response_model=OnboardingResponse)
async def create_business(req: OnboardingRequest, db: AsyncSession = Depends(get_db)):
    business = Business(name=req.name, industry=req.industry, phone=req.phone, description=req.description)
    db.add(business)
    await db.flush()
    db.add(BotConfig(
        business_id=business.id,
        greeting=req.greeting,
        tone=req.tone,
        languages=req.languages,
        knowledge=req.knowledge or SEED_KNOWLEDGE.get(req.industry, ""),
    ))
    await db.commit()
    return OnboardingResponse(business_id=business.id, webhook_token=business.webhook_token, name=business.name)
