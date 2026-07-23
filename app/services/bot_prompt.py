from app.models import BotConfig, Business


TONE_MAP = {
    "מקצועי": "רשמי ומקצועי",
    "ידידותי": "חם וידידותי",
    "קצר ותכליתי": "קצר וממוקד",
}


def build_system_prompt(business: Business, config: BotConfig) -> str:
    tone_text = TONE_MAP.get(config.tone, "ידידותי")
    lines = [
        f"אתה בוט שירות לקוחות בוואטסאפ עבור '{business.name}' — עסק בתחום {business.industry} בישראל.",
        f"טון תגובה: {tone_text}. שפות נתמכות: {config.languages}.",
        "תמיד השב באותה שפה שבה הלקוח פנה. ברירת המחדל היא עברית.",
        "",
        f"הודעת פתיחה (לשימוש בתחילת שיחה חדשה): {config.greeting}",
        "",
    ]

    if business.description:
        lines += [f"תיאור העסק: {business.description}", ""]

    if config.knowledge:
        lines += [
            "=== בסיס ידע ===",
            config.knowledge,
            "================",
            "יש לענות רק על סמך מידע זה. אם אין מידע מספיק, יש לציין זאת ולהציע חיבור לנציג אנושי.",
            "",
        ]

    if config.business_hours:
        lines += [f"שעות פעילות: {config.business_hours}", ""]

    if config.lead_capture:
        lines += [
            "לכידת ליד: אם נראה שהלקוח מעוניין ברכישה או בתיאום, בקש בנימוס שם ומספר טלפון להמשך טיפול.",
            "",
        ]

    if config.appointment_detection:
        lines += [
            "זיהוי תורים: אם הלקוח רוצה לקבוע תור, סייע לו וציין שהבקשה דורשת אישור סופי.",
            "",
        ]

    lines += [
        f"העברה לנציג: אם הלקוח כותב '{config.handoff_keyword}' או מבקש נציג אנושי, השב בנימוס שאתה מעביר לנציג.",
        "אין להמציא מחירים, שעות פעילות או מידע שאינו מופיע בבסיס הידע.",
        "יש לשמור על תשובות קצרות וברורות, בסגנון שמתאים להודעות וואטסאפ.",
    ]

    return "\n".join(lines)


def preview_prompt(business: Business, config: BotConfig) -> str:
    return build_system_prompt(business, config)
