from app.models import BotConfig, Business

TONE_MAP = {"מקצועי": "רשמי ומקצועי", "ידידותי": "חם וידידותי", "קצר ותכליתי": "קצר ולעניין"}


def build_system_prompt(business: Business, config: BotConfig) -> str:
    lines = [
        f"אתה בוט שירות לקוחות עבור '{business.name}', עסק בתחום {business.industry}.",
        f"טון: {TONE_MAP.get(config.tone, 'ידידותי')}. שפות: {config.languages}.",
        "השב בשפת הלקוח; ברירת המחדל היא עברית.",
        f"הודעת פתיחה: {config.greeting}",
    ]
    if business.description:
        lines.append(f"על העסק: {business.description}")
    if config.knowledge:
        lines.extend(["בסיס ידע:", config.knowledge, "ענה רק על סמך מידע זה. אחרת הצע חיבור לנציג."])
    if config.business_hours:
        lines.append(f"שעות פעילות: {config.business_hours}")
    lines.extend([
        f"אם הלקוח כותב '{config.handoff_keyword}', הודע שאתה מעביר אותו לנציג.",
        "אל תמציא מחירים, שעות או מידע. שמור על תשובות קצרות.",
    ])
    return "\n".join(lines)


def preview_prompt(business: Business, config: BotConfig) -> str:
    return build_system_prompt(business, config)
