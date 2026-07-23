# WhatsBiz

WhatsBiz — בוט WhatsApp לעסקים (Python/FastAPI): ניהול לקוחות ותבניות הודעות.

## הרצה מקומית

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

## בדיקות

```bash
python -m pytest -q
```

### הערה על מצב דמו

אם `ANTHROPIC_API_KEY` לא מוגדר, האפליקציה עובדת אוטומטית ב-`demo_mode`.
