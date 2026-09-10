from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from .database import get_db
from .auth import get_current_user
from .models import Business, User

def crud_router(prefix:str, tag:str, model, create_schema:type[BaseModel], read_schema:type[BaseModel]):
    router=APIRouter(prefix=prefix,tags=[tag])
    @router.get("",response_model=list[read_schema])
    def list_items(business_id:int|None=None,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
        statement=select(model).where(model.user_id==user.id) if model is Business else select(model).join(Business).where(Business.user_id==user.id)
        if business_id is not None and model is not Business: statement=statement.where(model.business_id==business_id)
        return db.scalars(statement.order_by(model.id.desc())).all()
    @router.post("",response_model=read_schema,status_code=status.HTTP_201_CREATED)
    def create_item(payload:create_schema,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
        data=payload.model_dump()
        if model is Business:data["user_id"]=user.id
        else:
            parent=db.get(Business,data["business_id"])
            if not parent or parent.user_id!=user.id:raise HTTPException(404,"Business not found")
        item=model(**data);db.add(item);db.commit();db.refresh(item);return item
    @router.get("/{item_id}",response_model=read_schema)
    def get_item(item_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
        item=db.get(model,item_id)
        if not item or (model is Business and item.user_id!=user.id) or (model is not Business and db.get(Business,item.business_id).user_id!=user.id): raise HTTPException(404,"Record not found")
        return item
    @router.put("/{item_id}",response_model=read_schema)
    def update_item(item_id:int,payload:create_schema,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
        item=db.get(model,item_id)
        if not item or (model is Business and item.user_id!=user.id) or (model is not Business and db.get(Business,item.business_id).user_id!=user.id): raise HTTPException(404,"Record not found")
        for key,value in payload.model_dump().items(): setattr(item,key,value)
        db.commit();db.refresh(item);return item
    @router.delete("/{item_id}",status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
        item=db.get(model,item_id)
        if not item or (model is Business and item.user_id!=user.id) or (model is not Business and db.get(Business,item.business_id).user_id!=user.id): raise HTTPException(404,"Record not found")
        db.delete(item);db.commit()
    return router
