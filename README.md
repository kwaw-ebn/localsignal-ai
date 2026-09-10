# LocalSignal AI

AI powered local market intelligence for small businesses.

## MVP

The first release focuses on five modules: business overview, competitor intelligence, local visibility, reputation intelligence, and an AI action center.

## Run locally

```bash
npm install
npm run dev
```

Run the API in a second terminal:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API documentation is available at `http://localhost:8000/docs`.

Create or upgrade database tables with `cd backend && alembic upgrade head`.

## Architecture

- Frontend: React + TypeScript + Vite
- Backend: FastAPI with SQLAlchemy
- Database and authentication: Supabase/PostgreSQL (next milestone)

## Roadmap

- [x] Responsive executive dashboard prototype
- [x] Business onboarding with browser saved workspace data
- [x] Functional dashboard navigation and module empty states
- [ ] Supabase authentication and cloud persistence
- [x] Competitor CRUD, search, summary metrics, and browser persistence
- [ ] Automated competitor comparison engine
- [x] Local keyword tracking, rank movement, search, and browser persistence
- [x] Reviews, ratings, sentiment, themes, filtering, and reputation insights
- [x] Interactive rules based website audit interface and saved reports
- [ ] Live FastAPI website crawler and audit API
- [x] Deterministic signal and priority rules engine
- [x] Evidence grounded action center with status tracking
- [ ] LLM interpretation layer backed by structured evidence
- [x] FastAPI health and CRUD endpoints with SQLite/PostgreSQL support
- [x] Persistent database models and automated API tests
- [x] Connect onboarding and browser data migration to the FastAPI API
- [x] API-first collection hooks for competitor, keyword, and review CRUD
- [x] Account registration, login, password hashing, and expiring access tokens
- [x] Authenticated APIs and cross user workspace isolation
- [x] Alembic database migrations and initial production schema
- [x] Docker Compose and Render deployment blueprints
