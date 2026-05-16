from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import verify_token, get_current_user
from app.models.user import User, RoleEnum
from app.schemas.user import UserResponse, UserCreate
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/verify", response_model=UserResponse)
def verify_user(
    decoded_token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Verifies Firebase token and returns user if they exist.
    If not, returns 404 so frontend can redirect to role selection.
    """
    firebase_uid = decoded_token.get("uid")
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please complete role selection."
        )

    return user

@router.post("/register", response_model=UserResponse)
def register_user(
    user_data: UserCreate,
    decoded_token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Creates a new user in the database after role selection."""
    firebase_uid = decoded_token.get("uid")
    
    if db.query(User).filter(User.firebase_uid == firebase_uid).first():
        raise HTTPException(status_code=400, detail="User already registered")

    new_user = User(
        firebase_uid=firebase_uid,
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
