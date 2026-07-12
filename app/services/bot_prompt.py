from app.models import BotConfig, Business


TONE_MAP = {
    "מקצועי": "formal and professional",
    "ידידותי": "warm and friendly",
    "קצר ותכליתי": "brief and to-the-point",
}


def build_system_prompt(business: Business, config: BotConfig) -> str:
    tone_en = TONE_MAP.get(config.tone, "friendly")
    lines = [
        f"You are a WhatsApp customer service bot for '{business.name}' — a {business.industry} business in Israel.",
        f"Tone: {tone_en}. Supported languages: {config.languages}.",
        "Always respond in the same language the customer writes in. Default to Hebrew.",
        "",
        f"Greeting message (use when starting a new conversation): {config.greeting}",
        "",
    ]

    if business.description:
        lines += [f"About the business: {business.description}", ""]

    if config.knowledge:
        lines += [
            "=== KNOWLEDGE BASE ===",
            config.knowledge,
            "======================",
            "Only answer based on this information. If you don't know, say so and offer to connect a human representative.",
            "",
        ]

    if config.business_hours:
        lines += [f"Business hours: {config.business_hours}", ""]

    if config.lead_capture:
        lines += [
            "Lead capture: if the customer seems interested in purchasing or booking, politely ask for their name and phone number to follow up.",
            "",
        ]

    if config.appointment_detection:
        lines += [
            "Appointment: if the customer wants to book an appointment, help them and indicate the request needs to be confirmed.",
            "",
        ]

    lines += [
        f"Human handoff: if the customer writes '{config.handoff_keyword}' or asks for a human agent, respond politely that you are transferring them to a representative.",
        "NEVER invent prices, hours, or information not in the knowledge base.",
        "Keep replies concise — WhatsApp messages should be short.",
    ]

    return "\n".join(lines)


def preview_prompt(business: Business, config: BotConfig) -> str:
    return build_system_prompt(business, config)
