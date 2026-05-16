from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.user import User, RoleEnum
from app.models.link import Link, LinkStatusEnum, OutcomeEnum
from app.models.link_event import LinkEvent, TriggeredByEnum
from app.models.mentor_profile import MentorProfile
from app.models.startup_profile import StartupProfile
from app.models.programme import Programme
from app.models.checkin import CheckIn
from app.models.milestone import Milestone
from app.models.dna_blueprint import DNABlueprint
from app.ai.dna import extract_dna_blueprint
from app.schemas.link import LinkResponse, LinkUpdate
from uuid import UUID
from datetime import datetime


def run_dna_extraction(link: Link, db: Session):
    programme = db.query(Programme).filter(Programme.id == link.programme_id).first()

    user_a = db.query(User).filter(User.id == link.entity_a_id).first()
    user_b = db.query(User).filter(User.id == link.entity_b_id).first()

    if user_a and user_a.role == RoleEnum.mentor:
        mentor_user, startup_user = user_a, user_b
    else:
        mentor_user, startup_user = user_b, user_a

    mentor_profile = db.query(MentorProfile).filter(MentorProfile.user_id == mentor_user.id).first()
    startup_profile = db.query(StartupProfile).filter(StartupProfile.user_id == startup_user.id).first()

    if not mentor_profile or not startup_profile:
        return

    checkins = db.query(CheckIn).filter(CheckIn.link_id == link.id).all()
    milestones = db.query(Milestone).filter(Milestone.link_id == link.id).all()

    link_data = {
        "source_link_id": link.id,
        "programme_type": programme.type if programme else None,
        "country": programme.country if programme else "",
        "outcome_notes": link.outcome_notes or "",
        "mentor_profile": {
            "name": mentor_user.full_name,
            "industry": mentor_profile.industry or [],
            "expertise_areas": mentor_profile.expertise_areas or [],
            "years_experience": mentor_profile.years_experience,
            "job_title": mentor_profile.job_title,
            "current_company": mentor_profile.current_company,
            "bio": mentor_profile.bio,
            "mentoring_style": mentor_profile.mentoring_style,
        },
        "startup_profile": {
            "company_name": startup_profile.company_name,
            "industry": startup_profile.industry,
            "stage": startup_profile.stage.value if startup_profile.stage else None,
            "support_needed": startup_profile.support_needed or [],
            "description": startup_profile.description,
        },
        "checkins": [{"duration_minutes": c.duration_minutes} for c in checkins],
        "milestones": [{"status": m.status.value} for m in milestones],
    }

    result = extract_dna_blueprint(link_data)

    blueprint = DNABlueprint(
        source_link_id=result["source_link_id"],
        programme_type=result["programme_type"],
        industry=result["industry"],
        geography=result["geography"],
        mentor_snapshot=result["mentor_snapshot"],
        startup_snapshot=result["startup_snapshot"],
        relationship_stats=result["relationship_stats"],
        outcome_metrics={
            "outcome": link.outcome.value if link.outcome else None,
            "outcome_notes": link.outcome_notes,
        },
        pattern_summary=result["pattern_summary"],
        embedding=result["embedding"],
    )
    db.add(blueprint)
    db.commit()

router = APIRouter(prefix="/links", tags=["links"])

@router.get("", response_model=List[LinkResponse])
def list_links(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role.value == "admin":
        return db.query(Link).all()
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
    db.add(LinkEvent(
        link_id=id, from_status="proposed", to_status="active",
        triggered_by=TriggeredByEnum.user, reason="Link activated by user"
    ))
    db.commit()
    db.refresh(link)
    return link

@router.put("/{id}/complete", response_model=LinkResponse)
def complete_link(
    id: UUID,
    link_update: LinkUpdate,
    background_tasks: BackgroundTasks,
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

    db.add(LinkEvent(
        link_id=id, from_status=old_status, to_status=link.status.value,
        triggered_by=TriggeredByEnum.admin, reason=f"Link marked {link.status.value} by admin"
    ))
    db.commit()
    db.refresh(link)
    if link.outcome == OutcomeEnum.successful:
        background_tasks.add_task(run_dna_extraction, link, db)

    return link

@router.get("/{id}/events")
def get_link_events(
    id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns the full audit trail for a link as a timeline."""
    events = db.query(LinkEvent).filter(LinkEvent.link_id == id).order_by(LinkEvent.created_at.asc()).all()
    return [
        {
            "id": str(e.id),
            "from_status": e.from_status,
            "to_status": e.to_status,
            "triggered_by": e.triggered_by.value,
            "reason": e.reason,
            "created_at": e.created_at.isoformat()
        }
        for e in events
    ]
