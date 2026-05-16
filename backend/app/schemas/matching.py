from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class MatchSuggestion(BaseModel):
    mentor_id: UUID
    startup_id: UUID
    embedding_score: float
    dna_score: float
    combined_score: float
    match_reasoning: str
