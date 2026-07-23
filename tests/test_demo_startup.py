import importlib
import sys

from fastapi.testclient import TestClient


def _load_test_client():
    for module in [
        "app.main",
        "app.db",
        "app.config",
        "app.models",
        "app.routers.onboarding",
        "app.routers.config",
        "app.routers.chat",
        "app.services.claude",
    ]:
        sys.modules.pop(module, None)

    main = importlib.import_module("app.main")
    return TestClient(main.app)


def test_health_in_demo_mode_without_api_key(monkeypatch, tmp_path):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{tmp_path / 'health.db'}")

    with _load_test_client() as client:
        response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["demo_mode"] is True


def test_onboarding_and_demo_chat_flow(monkeypatch, tmp_path):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{tmp_path / 'chat.db'}")

    with _load_test_client() as client:
        onboarding_response = client.post(
            "/api/onboarding",
            json={"name": "עסק בדיקה", "industry": "מסעדה"},
        )
        assert onboarding_response.status_code == 200
        business_id = onboarding_response.json()["business_id"]

        demo_chat_response = client.post(
            "/api/chat/demo",
            json={"business_id": business_id, "message": "שלום"},
        )
        assert demo_chat_response.status_code == 200
        assert demo_chat_response.json()["reply"] == "שלום! שמחתי לשמוע ממך. איך אוכל לעזור?"

        handoff_response = client.post(
            "/api/chat/demo",
            json={"business_id": business_id, "message": "אפשר נציג?"},
        )
        assert handoff_response.status_code == 200
        assert handoff_response.json()["needs_human"] is True
        assert "נציג" in handoff_response.json()["reply"]
