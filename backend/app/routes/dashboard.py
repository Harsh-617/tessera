from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.models.link import Link, LinkStatusEnum
from app.models.programme import Programme
from app.models.dna_blueprint import DNABlueprint
from app.schemas.link import LinkResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_stats(current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    active_links = db.query(func.count(Link.id)).filter(Link.status == LinkStatusEnum.active).scalar()
    at_risk_links = db.query(func.count(Link.id)).filter(Link.status == LinkStatusEnum.at_risk).scalar()
    total_programmes = db.query(func.count(Programme.id)).scalar()
    total_dna = db.query(func.count(DNABlueprint.id)).scalar()
    
    return {
        "active_links": active_links,
        "at_risk_links": at_risk_links,
        "total_programmes": total_programmes,
        "total_dna_blueprints": total_dna
    }

@router.get("/links", response_model=List[LinkResponse])
def get_dashboard_links(skip: int = 0, limit: int = 50, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    # Returns paginated links with health scores
    return db.query(Link).order_by(Link.updated_at.desc()).offset(skip).limit(limit).all()
