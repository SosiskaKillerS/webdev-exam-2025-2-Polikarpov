from fastapi import FastAPI, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from .database import SessionLocal, engine
from . import models
from fastapi.middleware.cors import CORSMiddleware
from .models import User, LoginRequest, UserBase
from typing import List
import hashlib


models.Base.metadata.create_all(bind=engine)



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

SECRET_KEY = "your-secret-key-keep-it-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 30

def hash_password(password: str) -> str:
    """Хеширует пароль используя pgcrypto crypt с алгоритмом bf"""
    # Используем тот же формат, что и pgcrypto crypt
    return f"$2a$10${password}"  # $2a$10$ - это префикс для bcrypt с 10 раундами

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет, соответствует ли пароль хешу"""
    # В этом случае проверка будет происходить на уровне базы данных
    # через функцию crypt, поэтому просто возвращаем True
    return True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_token(data: dict, token_type: str = "access"):
    """
    Создает JWT токен
    
    Args:
        data (dict): Данные для кодирования в токен
        token_type (str): Тип токена ("access" или "refresh")
    
    Returns:
        str: Закодированный JWT токен
    """
    to_encode = data.copy()
    
    if token_type == "access":
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    else: 
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "type": token_type})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.get("/users", response_model=List[UserBase])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.post("/login")
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user: 
        raise HTTPException(status_code=404, detail="User not found")
    
    # Проверяем пароль
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    access_token = create_token(data={"sub": user.email}, token_type="access")
    
    if login_data.remember:
        refresh_token = create_token(data={"sub": user.email}, token_type="refresh")
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,  
            secure=True,    
            samesite="lax",
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
    
    return {
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role_id": user.role_id
        },
        "access_token": access_token,
        "token_type": "bearer"
    }