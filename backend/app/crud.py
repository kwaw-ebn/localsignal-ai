from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from .database import get_db

def crud_router(prefix:str, tag:str, model, create_schema:type[BaseModel], read_schema:type[BaseModel]):
    router=APIRouter(prefix=prefix,tags=[tag])
    @router.get("",response_model=list[read_schema])
    def list_items(business_id:int|None=None,db:Session=Depends(get_db)):
        statement=select(model)
        if business_id is not None and hasattr(model,"business_id"): statement=statement.where(model.business_id==business_id)
        return db.scalars(statement.order_by(model.id.desc())).all()
    @router.post("",response_model=read_schema,status_code=status.HTTP_201_CREATED)
    def create_item(payload:create_schema,db:Session=Depends(get_db)):
        item=model(**payload.model_dump(mode="json"));db.add(item);db.commit();db.refresh(item);return item
    @router.get("/{item_id}",response_model=read_schema)
    def get_item(item_id:int,db:Session=Depends(get_db)):
        item=db.get(model,item_id)
        if not item: raise HTTPException(404,"Record not found")
        return item
    @router.put("/{item_id}",response_model=read_schema)
    def update_item(item_id:int,payload:create_schema,db:Session=Depends(get_db)):
        item=db.get(model,item_id)
        if not item: raise HTTPException(404,"Record not found")
        for key,value in payload.model_dump(mode="json").items(): setattr(item,key,value)
        db.commit();db.refresh(item);return item
    @router.delete("/{item_id}",status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id:int,db:Session=Depends(get_db)):
        item=db.get(model,item_id)
        if not item: raise HTTPException(404,"Record not found")
        db.delete(item);db.commit()
    return router
