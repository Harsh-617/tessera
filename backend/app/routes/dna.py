from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.models.dna_blueprint import DNABlueprint
from app.schemas.dna_blueprint import DNABlueprintResponse

router = APIRouter(prefix="/dna", tags=["dna"])

@router.get("", response_model=List[DNABlueprintResponse])
def list_dna(
    industry: Optional[str] = Query(None),
    programme_type: Optional[str] = Query(None),
    geography: Optional[str] = Query(None),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(DNABlueprint)
    
    if industry:
        query = query.filter(DNABlueprint.industry == industry)
    if programme_type:
        query = query.filter(DNABlueprint.programme_type == programme_type)
    if geography:
        query = query.filter(DNABlueprint.geography == geography)
        
    return query.all()

@router.get("/{id}", response_model=DNABlueprintResponse)
def get_dna_blueprint(id: UUID, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    blueprint = db.query(DNABlueprint).filter(DNABlueprint.id == id).first()
    if not blueprint:
        raise HTTPException(status_code=404, detail="Blueprint not found")
    return blueprint
