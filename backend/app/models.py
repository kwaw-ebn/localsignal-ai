from datetime import date, datetime
from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(240), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

class Business(Base):
    __tablename__ = "businesses"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160), index=True)
    website: Mapped[str] = mapped_column(String(500))
    industry: Mapped[str] = mapped_column(String(120))
    city: Mapped[str] = mapped_column(String(160))
    country: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    competitors: Mapped[list["Competitor"]] = relationship(cascade="all, delete-orphan")
    keywords: Mapped[list["Keyword"]] = relationship(cascade="all, delete-orphan")
    reviews: Mapped[list["Review"]] = relationship(cascade="all, delete-orphan")

class Competitor(Base):
    __tablename__ = "competitors"
    id: Mapped[int] = mapped_column(primary_key=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(160))
    website: Mapped[str] = mapped_column(String(500))
    category: Mapped[str] = mapped_column(String(120), default="")
    location: Mapped[str] = mapped_column(String(160), default="")
    rating: Mapped[float] = mapped_column(Float, default=0)
    reviews: Mapped[int] = mapped_column(Integer, default=0)

class Keyword(Base):
    __tablename__ = "keywords"
    id: Mapped[int] = mapped_column(primary_key=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    keyword: Mapped[str] = mapped_column(String(240), index=True)
    location: Mapped[str] = mapped_column(String(160))
    position: Mapped[int] = mapped_column(Integer)
    previous: Mapped[int] = mapped_column(Integer)
    volume: Mapped[int] = mapped_column(Integer, default=0)

class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(primary_key=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id", ondelete="CASCADE"), index=True)
    customer: Mapped[str] = mapped_column(String(120))
    source: Mapped[str] = mapped_column(String(60))
    rating: Mapped[int] = mapped_column(Integer)
    review_date: Mapped[date] = mapped_column(Date)
    text: Mapped[str] = mapped_column(Text)
    theme: Mapped[str] = mapped_column(String(80))
    sentiment: Mapped[str] = mapped_column(String(20))
