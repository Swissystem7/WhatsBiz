# WhatsBiz

דמו מקומי של בוט שירות לעסקים המבוסס על FastAPI. ללא
`ANTHROPIC_API_KEY` הוא פועל במצב דמו ואינו פונה לשירות חיצוני.

## הרצה ובדיקות

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
python -m uvicorn app.main:app
pytest -q
```
