from app.config import ANTHROPIC_API_KEY, DEMO_MODE

DEMO_REPLIES = [
    "שלום! שמחתי לשמוע ממך. איך אוכל לעזור?",
    "תודה על פנייתך! אוכל לחבר אותך לנציג שלנו.",
    "בשמחה, ספר לי יותר — מה בדיוק אתה מחפש?",
]
_demo_idx = 0


async def get_claude_reply(system_prompt: str, history: list[dict]) -> str:
    global _demo_idx
    if DEMO_MODE:
        reply = DEMO_REPLIES[_demo_idx % len(DEMO_REPLIES)]
        _demo_idx += 1
        return reply
    import anthropic
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    response = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        system=system_prompt,
        messages=history,
    )
    return response.content[0].text
