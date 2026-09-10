import base64,hashlib,hmac,json,os,time
from fastapi import APIRouter,Depends,HTTPException
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session
from .config import get_settings
from .database import get_db
from .models import User
from .schemas import LoginRequest,RegisterRequest,TokenResponse,UserRead
router=APIRouter(prefix="/api/auth",tags=["authentication"]);security=HTTPBearer(auto_error=False)
def hash_password(password:str)->str:
 salt=os.urandom(16);digest=hashlib.pbkdf2_hmac("sha256",password.encode(),salt,210_000);return base64.urlsafe_b64encode(salt+digest).decode()
def verify_password(password:str,stored:str)->bool:
 raw=base64.urlsafe_b64decode(stored);return hmac.compare_digest(raw[16:],hashlib.pbkdf2_hmac("sha256",password.encode(),raw[:16],210_000))
def token_for(user:User)->str:
 payload=base64.urlsafe_b64encode(json.dumps({"sub":user.id,"exp":int(time.time())+86400}).encode()).decode().rstrip('=');signature=hmac.new(get_settings().auth_secret.encode(),payload.encode(),hashlib.sha256).hexdigest();return f"{payload}.{signature}"
def get_current_user(credentials:HTTPAuthorizationCredentials|None=Depends(security),db:Session=Depends(get_db))->User:
 if not credentials:raise HTTPException(401,"Authentication required")
 try:
  payload,signature=credentials.credentials.split('.',1);expected=hmac.new(get_settings().auth_secret.encode(),payload.encode(),hashlib.sha256).hexdigest()
  if not hmac.compare_digest(signature,expected):raise ValueError()
  data=json.loads(base64.urlsafe_b64decode(payload+'='*(-len(payload)%4)));user=db.get(User,int(data['sub']))
  if not user or data['exp']<time.time():raise ValueError()
  return user
 except Exception:raise HTTPException(401,"Invalid or expired access token")
@router.post("/register",response_model=TokenResponse,status_code=201)
def register(payload:RegisterRequest,db:Session=Depends(get_db)):
 email=payload.email.lower().strip()
 if db.scalar(select(User).where(User.email==email)):raise HTTPException(409,"Email already registered")
 user=User(name=payload.name.strip(),email=email,password_hash=hash_password(payload.password));db.add(user);db.commit();db.refresh(user);return TokenResponse(access_token=token_for(user),user=UserRead.model_validate(user))
@router.post("/login",response_model=TokenResponse)
def login(payload:LoginRequest,db:Session=Depends(get_db)):
 user=db.scalar(select(User).where(User.email==payload.email.lower().strip()))
 if not user or not verify_password(payload.password,user.password_hash):raise HTTPException(401,"Incorrect email or password")
 return TokenResponse(access_token=token_for(user),user=UserRead.model_validate(user))
@router.get("/me",response_model=UserRead)
def me(user:User=Depends(get_current_user)):return user
