from sqlalchemy.orm import Session
from app.models.link import Link, LinkStatusEnum
from app.models.checkin import CheckIn
from app.models.milestone import Milestone
from app.models.link_event import LinkEvent, TriggeredByEnum
from app.ai.health_score import calculate_health_score
from uuid import UUID

def update_link_health(link_id: UUID, db: Session):
    link = db.query(Link).filter(Link.id == link_id).first()
    if not link:
        return
    
    checkins = db.query(CheckIn).filter(CheckIn.link_id == link_id).all()
    milestones = db.query(Milestone).filter(Milestone.link_id == link_id).all()
    
    score, status_str = calculate_health_score(checkins, milestones)
    
    old_status = link.status.value
    link.health_score = score
    
    if status_str == "at_risk" and old_status != "at_risk":
        link.status = LinkStatusEnum.at_risk
        event = LinkEvent(
            link_id=link.id,
            from_status=old_status,
            to_status="at_risk",
            triggered_by=TriggeredByEnum.system,
            reason="System auto-transitioned to at_risk due to low health score or inactivity"
        )
        db.add(event)
    elif status_str != "at_risk" and old_status == "at_risk":
         link.status = LinkStatusEnum.active
         event = LinkEvent(
            link_id=link.id,
            from_status=old_status,
            to_status="active",
            triggered_by=TriggeredByEnum.system,
            reason="System auto-transitioned back to active due to improved health score"
        )
         db.add(event)

    db.commit()
