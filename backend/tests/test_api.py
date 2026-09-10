import os
os.environ["DATABASE_URL"]="sqlite:///./test_localsignal.db"
from fastapi.testclient import TestClient
from app.main import app

def test_health():
    with TestClient(app) as client:
        response=client.get("/health")
        assert response.status_code==200
        assert response.json()["status"]=="ok"

def test_business_crud():
    payload={"name":"Test Business","website":"https://example.com","industry":"Services","city":"Accra","country":"Ghana"}
    with TestClient(app) as client:
        created=client.post("/api/businesses",json=payload)
        assert created.status_code==201
        item_id=created.json()["id"]
        assert client.get(f"/api/businesses/{item_id}").json()["name"]=="Test Business"
        assert client.delete(f"/api/businesses/{item_id}").status_code==204
