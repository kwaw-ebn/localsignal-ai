from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .crud import crud_router
from .database import Base, engine
from .models import Business, Competitor, Keyword, Review
from .schemas import BusinessCreate, BusinessRead, CompetitorCreate, CompetitorRead, KeywordCreate, KeywordRead, ReviewCreate, ReviewRead
from .auth import router as auth_router

@asynccontextmanager
async def lifespan(_:FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

settings=get_settings()
app=FastAPI(title=settings.app_name,version="0.1.0",lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=settings.cors_origin_list,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])

@app.get("/health",tags=["system"])
def health(): return {"status":"ok","service":"localsignal-api","version":"0.1.0"}

app.include_router(auth_router)

app.include_router(crud_router("/api/businesses","businesses",Business,BusinessCreate,BusinessRead))
app.include_router(crud_router("/api/competitors","competitors",Competitor,CompetitorCreate,CompetitorRead))
app.include_router(crud_router("/api/keywords","keywords",Keyword,KeywordCreate,KeywordRead))
app.include_router(crud_router("/api/reviews","reviews",Review,ReviewCreate,ReviewRead))
