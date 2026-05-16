from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.checkin import CheckIn
from app.models.milestone import Milestone
from app.schemas.checkin import CheckInCreate, CheckInResponse
from app.schemas.milestone import MilestoneCreate, MilestoneResponse, MilestoneUpdate
from app.services.health_service import update_link_health

router = APIRouter(tags=["activity"])

@router.post("/links/{id}/checkins", response_model=CheckInResponse)
def log_checkin(
    id: UUID,
    checkin: CheckInCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_checkin = CheckIn(
        logged_by=current_user.id,
        **checkin.model_dump()
    )
    new_checkin.link_id = id
    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)
    
    background_tasks.add_task(update_link_health, id, db)
    return new_checkin

@router.get("/links/{id}/checkins", response_model=List[CheckInResponse])
def get_checkins(id: UUID, db: Session = Depends(get_db)):
    return db.query(CheckIn).filter(CheckIn.link_id == id).all()

@router.post("/links/{id}/milestones", response_model=MilestoneResponse)
def create_milestone(
    id: UUID,
    milestone: MilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_milestone = Milestone(**milestone.model_dump())
    new_milestone.link_id = id
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    return new_milestone

@router.get("/links/{id}/milestones", response_model=List[MilestoneResponse])
def get_milestones(id: UUID, db: Session = Depends(get_db)):
    return db.query(Milestone).filter(Milestone.link_id == id).all()

@router.put("/milestones/{id}", response_model=MilestoneResponse)
def update_milestone(
    id: UUID,
    milestone_update: MilestoneUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    milestone = db.query(Milestone).filter(Milestone.id == id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    for field, value in milestone_update.model_dump(exclude_unset=True).items():
        setattr(milestone, field, value)
        
    db.commit()
    db.refresh(milestone)
    
    background_tasks.add_task(update_link_health, milestone.link_id, db)
    return milestone
