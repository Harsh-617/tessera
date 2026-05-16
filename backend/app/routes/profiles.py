from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.dependencies import get_current_user
from app.models.user import User, RoleEnum
from app.models.mentor_profile import MentorProfile
from app.models.startup_profile import StartupProfile
from app.schemas.mentor_profile import MentorProfileCreate, MentorProfileResponse, MentorProfileUpdate
from app.schemas.startup_profile import StartupProfileCreate, StartupProfileResponse, StartupProfileUpdate
from app.ai.embeddings import generate_mentor_embedding, generate_startup_embedding
from uuid import UUID

router = APIRouter(prefix="/profiles", tags=["profiles"])


def update_mentor_embedding(profile: MentorProfile):
    db = SessionLocal()
    try:
        p = db.query(MentorProfile).filter(MentorProfile.id == profile.id).first()
        if not p:
            return
        embedding = generate_mentor_embedding({
            "industry": p.industry or [],
            "expertise_areas": p.expertise_areas or [],
            "years_experience": p.years_experience,
            "job_title": p.job_title,
            "current_company": p.current_company,
            "bio": p.bio,
            "mentoring_style": p.mentoring_style,
        })
        p.embedding = embedding
        db.commit()
    finally:
        db.close()


def update_startup_embedding(profile: StartupProfile):
    db = SessionLocal()
    try:
        p = db.query(StartupProfile).filter(StartupProfile.id == profile.id).first()
        if not p:
            return
        embedding = generate_startup_embedding({
            "company_name": p.company_name,
            "industry": p.industry,
            "stage": p.stage.value if p.stage else None,
            "description": p.description,
            "support_needed": p.support_needed or [],
        })
        p.embedding = embedding
        db.commit()
    finally:
        db.close()

@router.post("/mentor", response_model=MentorProfileResponse)
def create_mentor_profile(
    profile: MentorProfileCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != RoleEnum.mentor:
        raise HTTPException(status_code=403, detail="Only mentors can create mentor profiles")
    
    existing = db.query(MentorProfile).filter(MentorProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    new_profile = MentorProfile(
        user_id=current_user.id,
        **profile.model_dump()
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    background_tasks.add_task(update_mentor_embedding, new_profile)

    return new_profile

@router.put("/mentor", response_model=MentorProfileResponse)
def update_mentor_profile(
    profile: MentorProfileUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(MentorProfile).filter(MentorProfile.user_id == current_user.id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in profile.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)
    
    db.commit()
    db.refresh(existing)
    
    background_tasks.add_task(update_mentor_embedding, existing)

    return existing

@router.get("/mentor/{user_id}", response_model=MentorProfileResponse)
def get_mentor_profile(user_id: UUID, db: Session = Depends(get_db)):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/startup", response_model=StartupProfileResponse)
def create_startup_profile(
    profile: StartupProfileCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != RoleEnum.startup:
        raise HTTPException(status_code=403, detail="Only startups can create startup profiles")
    
    existing = db.query(StartupProfile).filter(StartupProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists")

    new_profile = StartupProfile(
        user_id=current_user.id,
        **profile.model_dump()
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    background_tasks.add_task(update_startup_embedding, new_profile)

    return new_profile

@router.put("/startup", response_model=StartupProfileResponse)
def update_startup_profile(
    profile: StartupProfileUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(StartupProfile).filter(StartupProfile.user_id == current_user.id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in profile.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)
    
    db.commit()
    db.refresh(existing)
    
    background_tasks.add_task(update_startup_embedding, existing)

    return existing

@router.get("/startup/{user_id}", response_model=StartupProfileResponse)
def get_startup_profile(user_id: UUID, db: Session = Depends(get_db)):
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
