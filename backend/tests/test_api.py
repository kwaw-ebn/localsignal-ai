import os
os.environ["DATABASE_URL"]="sqlite:///./test_isolation.db"
from fastapi.testclient import TestClient
from app.main import app

def auth(client,name="Test User"):
    email=f"{name.replace(' ','').lower()}-{os.urandom(4).hex()}@example.com"
    result=client.post("/api/auth/register",json={"name":name,"email":email,"password":"securepass123"}).json()
    return {"Authorization":f"Bearer {result['access_token']}"}

def test_health():
    with TestClient(app) as client:
        response=client.get("/health")
        assert response.status_code==200
        assert response.json()["status"]=="ok"

def test_business_crud():
    payload={"name":"Test Business","website":"https://example.com","industry":"Services","city":"Accra","country":"Ghana"}
    with TestClient(app) as client:
        headers=auth(client);created=client.post("/api/businesses",json=payload,headers=headers)
        assert created.status_code==201
        item_id=created.json()["id"]
        assert client.get(f"/api/businesses/{item_id}",headers=headers).json()["name"]=="Test Business"
        assert client.delete(f"/api/businesses/{item_id}",headers=headers).status_code==204

def test_competitor_persistence():
    business={"name":"API Business","website":"https://example.com","industry":"Services","city":"Accra","country":"Ghana"}
    with TestClient(app) as client:
        headers=auth(client);business_id=client.post("/api/businesses",json=business,headers=headers).json()["id"]
        competitor={"business_id":business_id,"name":"Nearby Company","website":"https://competitor.com","category":"Services","location":"Accra","rating":4.5,"reviews":25}
        created=client.post("/api/competitors",json=competitor,headers=headers)
        assert created.status_code==201
        rows=client.get(f"/api/competitors?business_id={business_id}",headers=headers).json()
        assert len(rows)==1 and rows[0]["name"]=="Nearby Company"

def test_authentication_flow():
    email=f"user-{os.urandom(4).hex()}@example.com"
    with TestClient(app) as client:
        registered=client.post("/api/auth/register",json={"name":"Test User","email":email,"password":"securepass123"})
        assert registered.status_code==201
        token=registered.json()["access_token"]
        assert client.get("/api/auth/me",headers={"Authorization":f"Bearer {token}"}).status_code==200
        assert client.post("/api/auth/login",json={"email":email,"password":"wrongpass"}).status_code==401

def test_cross_user_isolation():
    business={"name":"Private Business","website":"https://example.com","industry":"Services","city":"Accra","country":"Ghana"}
    with TestClient(app) as client:
        owner=auth(client,"Owner");other=auth(client,"Other")
        business_id=client.post("/api/businesses",json=business,headers=owner).json()["id"]
        assert client.get(f"/api/businesses/{business_id}",headers=other).status_code==404
        assert client.get("/api/businesses",headers=other).json()==[]
        competitor={"business_id":business_id,"name":"Hidden Competitor","website":"https://competitor.com","category":"Services","location":"Accra","rating":4,"reviews":10}
        assert client.post("/api/competitors",json=competitor,headers=other).status_code==404
