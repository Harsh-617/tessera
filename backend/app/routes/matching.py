from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.models.link import Link, LinkTypeEnum, LinkStatusEnum
from app.schemas.matching import MatchSuggestion
from app.ai.matching import generate_matches
from pydantic import BaseModel

router = APIRouter(prefix="/programmes/{id}/match", tags=["matching"])

class MatchApproveRequest(BaseModel):
    startup_id: UUID
    mentor_id: UUID
    embedding_score: float
    dna_score: float
    combined_score: float
    match_reasoning: str

@router.post("", response_model=List[MatchSuggestion])
def run_matching(
    id: UUID,
    startup_id: UUID,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Generates matches for a specific startup within a programme."""
    try:
        matches = generate_matches(startup_id, id, db)
        return matches
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve", response_model=dict)
def approve_match(
    id: UUID,
    match: MatchApproveRequest,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Approves a match and creates a proposed Link."""
    existing_link = db.query(Link).filter(
        Link.programme_id == id,
        Link.entity_a_id == match.mentor_id,
        Link.entity_b_id == match.startup_id
    ).first()
    
    if existing_link:
        raise HTTPException(status_code=400, detail="A link already exists between these actors for this programme")

    new_link = Link(
        programme_id=id,
        link_type=LinkTypeEnum.mentor_startup,
        entity_a_id=match.mentor_id,
        entity_b_id=match.startup_id,
        status=LinkStatusEnum.proposed,
        embedding_score=match.embedding_score,
        dna_score=match.dna_score,
        combined_score=match.combined_score,
        match_reasoning=match.match_reasoning,
        created_by=current_user.id
    )
    
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    
    return {"status": "success", "link_id": new_link.id}
