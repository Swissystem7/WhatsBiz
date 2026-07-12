from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.models import Business, BotConfig
from app.schemas import OnboardingRequest, OnboardingResponse

router = APIRouter(prefix="/api", tags=["onboarding"])

SEED_KNOWLEDGE = {
    "מסעדה": "תפריט: פיצה ₪55, פסטה ₪49, סלט ₪35. שעות: א'-ה' 12:00-23:00, שישי 12:00-16:00. כשר למהדרין.",
    "קליניקה": "שירותים: ייעוץ ₪350, טיפול ₪250. ד\"ר כהן זמין א'-ד'. ביטוח מקובל: מכבי, מאוחדת.",
    "חנות": "מוצרים מגוונים. החזרות תוך 14 יום עם קבלה. משלוח חינם בקנייה מעל ₪200.",
    "שירותים": "שעות: א'-ה' 8:00-18:00. מחירים לפי הצעת מחיר. ניתן לתיאום בוואטסאפ.",
    "אחר": "אנא צרו קשר לפרטים נוספים.",
}


@router.post("/onboarding", response_model=OnboardingResponse)
async def create_business(req: OnboardingRequest, db: AsyncSession = Depends(get_db)):
    business = Business(
        name=req.name,
        industry=req.industry,
        phone=req.phone,
        description=req.description,
    )
    db.add(business)
    await db.flush()

    knowledge = req.knowledge or SEED_KNOWLEDGE.get(req.industry, "")
    config = BotConfig(
        business_id=business.id,
        greeting=req.greeting,
        tone=req.tone,
        languages=req.languages,
        knowledge=knowledge,
    )
    db.add(config)
    await db.commit()

    return OnboardingResponse(
        business_id=business.id,
        webhook_token=business.webhook_token,
        name=business.name,
    )
