from datetime import date
from pydantic import BaseModel, ConfigDict, Field, HttpUrl

class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class BusinessCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    website: HttpUrl
    industry: str = Field(min_length=1, max_length=120)
    city: str = Field(min_length=1, max_length=160)
    country: str = Field(min_length=1, max_length=100)
class BusinessRead(BusinessCreate, ORMModel): id:int

class CompetitorCreate(BaseModel):
    name:str=Field(min_length=1,max_length=160); website:HttpUrl; category:str=""; location:str=""
    rating:float=Field(default=0,ge=0,le=5); reviews:int=Field(default=0,ge=0)
class CompetitorRead(CompetitorCreate, ORMModel): id:int; business_id:int

class KeywordCreate(BaseModel):
    keyword:str=Field(min_length=1,max_length=240); location:str=Field(min_length=1,max_length=160)
    position:int=Field(ge=1,le=100); previous:int=Field(ge=1,le=100); volume:int=Field(default=0,ge=0)
class KeywordRead(KeywordCreate, ORMModel): id:int; business_id:int

class ReviewCreate(BaseModel):
    customer:str=Field(min_length=1,max_length=120); source:str=Field(min_length=1,max_length=60)
    rating:int=Field(ge=1,le=5); review_date:date; text:str=Field(min_length=1)
    theme:str=Field(min_length=1,max_length=80); sentiment:str=Field(pattern="^(Positive|Neutral|Negative)$")
class ReviewRead(ReviewCreate, ORMModel): id:int; business_id:int
