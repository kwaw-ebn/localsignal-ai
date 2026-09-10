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

def test_competitor_persistence():
    business={"name":"API Business","website":"https://example.com","industry":"Services","city":"Accra","country":"Ghana"}
    with TestClient(app) as client:
        business_id=client.post("/api/businesses",json=business).json()["id"]
        competitor={"business_id":business_id,"name":"Nearby Company","website":"https://competitor.com","category":"Services","location":"Accra","rating":4.5,"reviews":25}
        created=client.post("/api/competitors",json=competitor)
        assert created.status_code==201
        rows=client.get(f"/api/competitors?business_id={business_id}").json()
        assert len(rows)==1 and rows[0]["name"]=="Nearby Company"
