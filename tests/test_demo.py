import os

os.environ.pop("ANTHROPIC_API_KEY", None)
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

from fastapi.testclient import TestClient
from app.main import app


def test_health_and_demo_path():
    with TestClient(app) as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json()["demo_mode"] is True
        created = client.post("/api/onboarding", json={"name": "עסק בדיקה", "industry": "מסעדה"})
        assert created.status_code == 200
        business_id = created.json()["business_id"]
        config = client.get(f"/api/businesses/{business_id}/config")
        assert config.json()["greeting"] == "שלום! איך אפשר לעזור לך?"
        chat = client.post("/api/chat/demo", json={"business_id": business_id, "message": "שלום"})
        assert chat.status_code == 200
        assert "שלום" in chat.json()["reply"]
