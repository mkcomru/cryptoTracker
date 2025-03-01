from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import Response
from sqlalchemy.orm import Session
from datetime import timedelta
from src.models.models import User as UserModel
from src.models.database import get_db
from src.models.schemas import UserCreate, User, Token, UserUpdate
from src.controller.auth import get_password_hash, verify_password, create_access_token, get_current_user
from src.config import settings
import mimetypes


auth_router = APIRouter(prefix="/auth")

@auth_router.post("/register", response_model=User)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@auth_router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.get("/me", response_model=User)
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "bio": current_user.bio,
        "has_avatar": current_user.avatar is not None
    }

@auth_router.put("/update-username")
async def update_username(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not update_data.username:
        raise HTTPException(status_code=400, detail="Username is required")
        
    # Проверяем, не занято ли имя другим пользователем
    existing_user = db.query(UserModel).filter(
        UserModel.username == update_data.username,
        UserModel.id != current_user.id
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    user.username = update_data.username
    db.commit()
    db.refresh(user)
    return {"message": "Username updated successfully"}

@auth_router.put("/update-bio")
async def update_bio(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    user.bio = update_data.bio
    db.commit()
    db.refresh(user)
    return {"message": "Bio updated successfully"}

@auth_router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Проверка формата файла
    content_type = file.content_type
    if content_type not in ['image/jpeg', 'image/png']:
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only JPEG and PNG are allowed"
        )
    
    contents = await file.read()
    # Ограничение размера файла (например, 5MB)
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size too large. Maximum size is 5MB"
        )

    user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    user.avatar = contents
    user.avatar_type = content_type.split('/')[-1]  # 'jpeg' или 'png'
    db.commit()
    db.refresh(user)
    
    return {"message": "Avatar uploaded successfully"}

@auth_router.get("/avatar")
async def get_avatar(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == current_user.id).first()
    if not user.avatar:
        raise HTTPException(status_code=404, detail="Avatar not found")
    
    return Response(
        content=user.avatar,
        media_type=f"image/{user.avatar_type}"
    )
