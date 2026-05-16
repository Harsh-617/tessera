from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User
from app.models.link import Link, LinkStatusEnum
from app.models.link_event import LinkEvent, TriggeredByEnum
from app.schemas.link import LinkResponse, LinkUpdate
from uuid import UUID
from datetime import datetime

router = APIRouter(prefix="/links", tags=["links"])

@router.get("", response_model=List[LinkResponse])
def list_links(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.value == "admin":
        return db.query(Link).all()
    
    # Users see links they are part of
    return db.query(Link).filter(
        (Link.entity_a_id == current_user.id) | (Link.entity_b_id == current_user.id)
    ).all()

@router.get("/{id}", response_model=LinkResponse)
def get_link(id: UUID, db: Session = Depends(get_db)):
    link = db.query(Link).filter(Link.id == id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    return link

@router.put("/{id}/activate", response_model=LinkResponse)
def activate_link(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    link = db.query(Link).filter(Link.id == id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    if link.status != LinkStatusEnum.proposed:
        raise HTTPException(status_code=400, detail="Only proposed links can be activated")

    link.status = LinkStatusEnum.active
    link.activated_at = datetime.utcnow()
    
    event = LinkEvent(
        link_id=id,
        from_status="proposed",
        to_status="active",
        triggered_by=TriggeredByEnum.user,
        reason="Link activated by user"
    )
    db.add(event)
    db.commit()
    db.refresh(link)
    return link

@router.put("/{id}/complete", response_model=LinkResponse)
def complete_link(
    id: UUID,
    link_update: LinkUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    link = db.query(Link).filter(Link.id == id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    if link.status not in [LinkStatusEnum.active, LinkStatusEnum.at_risk]:
        raise HTTPException(status_code=400, detail="Only active or at-risk links can be completed")

    old_status = link.status.value
    link.status = link_update.status or LinkStatusEnum.completed
    link.outcome = link_update.outcome
    link.outcome_notes = link_update.outcome_notes
    link.completed_at = datetime.utcnow()
    
    event = LinkEvent(
        link_id=id,
        from_status=old_status,
        to_status=link.status.value,
        triggered_by=TriggeredByEnum.admin,
        reason=f"Link marked {link.status.value} by admin"
    )
    db.add(event)
    db.commit()
    db.refresh(link)
    
    # TODO: If successful, trigger DNA extraction background task
    
    return link
