from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User
from app.models.programme import Programme
from app.models.enrollment import Enrollment, RoleInProgrammeEnum
from app.schemas.programme import ProgrammeCreate, ProgrammeResponse, ProgrammeUpdate
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse
from uuid import UUID

router = APIRouter(prefix="/programmes", tags=["programmes"])

@router.post("", response_model=ProgrammeResponse)
def create_programme(
    programme: ProgrammeCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    new_programme = Programme(
        admin_id=current_user.id,
        **programme.model_dump()
    )
    db.add(new_programme)
    db.commit()
    db.refresh(new_programme)
    return new_programme

@router.get("", response_model=List[ProgrammeResponse])
def list_programmes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.value == "admin":
        return db.query(Programme).all()
    
    # Non-admins only see programmes they are enrolled in
    enrolled_ids = db.query(Enrollment.programme_id).filter(Enrollment.user_id == current_user.id).all()
    ids = [r[0] for r in enrolled_ids]
    return db.query(Programme).filter(Programme.id.in_(ids)).all()

@router.get("/{id}", response_model=ProgrammeResponse)
def get_programme(id: UUID, db: Session = Depends(get_db)):
    programme = db.query(Programme).filter(Programme.id == id).first()
    if not programme:
        raise HTTPException(status_code=404, detail="Programme not found")
    return programme

@router.put("/{id}", response_model=ProgrammeResponse)
def update_programme(
    id: UUID,
    programme_update: ProgrammeUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    programme = db.query(Programme).filter(Programme.id == id).first()
    if not programme:
        raise HTTPException(status_code=404, detail="Programme not found")
    
    for field, value in programme_update.model_dump(exclude_unset=True).items():
        setattr(programme, field, value)
    
    db.commit()
    db.refresh(programme)
    return programme

@router.post("/{id}/enroll", response_model=EnrollmentResponse)
def enroll_actor(
    id: UUID,
    enrollment: EnrollmentCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    # Verify programme exists
    programme = db.query(Programme).filter(Programme.id == id).first()
    if not programme:
        raise HTTPException(status_code=404, detail="Programme not found")
    
    # Verify user exists
    target_user = db.query(User).filter(User.id == enrollment.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.programme_id == id,
        Enrollment.user_id == enrollment.user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already enrolled in this programme")

    new_enrollment = Enrollment(
        programme_id=id,
        user_id=enrollment.user_id,
        role_in_programme=enrollment.role_in_programme
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment
