import numpy as np
import google.generativeai as genai
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.startup_profile import StartupProfile
from app.models.mentor_profile import MentorProfile
from app.models.enrollment import Enrollment
from app.models.dna_blueprint import DNABlueprint
from app.ai.embeddings import generate_embedding, format_mentor_text, format_startup_text
from app.ai.prompts import MATCH_REASONING_PROMPT
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_matches(startup_id, programme_id, db: Session):
    startup = db.query(StartupProfile).filter(StartupProfile.user_id == startup_id).first()
    if not startup or startup.embedding is None:
        return []
        
    enrolled_mentors_query = db.query(Enrollment.user_id).filter(
        Enrollment.programme_id == programme_id,
        Enrollment.role_in_programme == "mentor"
    )
    mentor_ids = [str(r[0]) for r in enrolled_mentors_query.all()]
    
    if not mentor_ids:
        return []

    # Signal A: Embedding similarity
    # pgvector: cosine distance `<=>`
    query = text("""
        SELECT user_id, 1 - (embedding <=> :startup_embedding) AS similarity
        FROM mentor_profiles
        WHERE CAST(user_id AS VARCHAR) = ANY(:mentor_ids)
        ORDER BY similarity DESC
        LIMIT 10;
    """)
    
    # Format embedding for pgvector string representation
    startup_embedding_str = f"[{','.join(map(str, startup.embedding))}]"
    
    result = db.execute(query, {
        "startup_embedding": startup_embedding_str,
        "mentor_ids": mentor_ids
    }).fetchall()
    
    candidates = []
    
    # Pre-fetch all DNA blueprints for Signal B
    all_blueprints = db.query(DNABlueprint).all()
    
    model = genai.GenerativeModel("gemini-2.5-flash")
    
    for row in result:
        mentor_id = row.user_id
        embedding_score = float(row.similarity)
        
        mentor = db.query(MentorProfile).filter(MentorProfile.user_id == mentor_id).first()
        
        dna_score = 0.0
        best_blueprint = None
        
        if all_blueprints:
            # Create a pairing description string
            pairing_desc = f"Mentor: {mentor.job_title} in {', '.join(mentor.industry or [])}. Startup: {startup.stage} in {startup.industry} needing {', '.join(startup.support_needed or [])}."
            pairing_embedding = generate_embedding(pairing_desc)
            
            if pairing_embedding:
                pairing_vec = np.array(pairing_embedding)
                for bp in all_blueprints:
                    if bp.embedding is not None:
                        # Convert string vector back to numpy if needed, but SQLAlchemy handles it
                        bp_vec = np.array(bp.embedding)
                        similarity = np.dot(pairing_vec, bp_vec) / (np.linalg.norm(pairing_vec) * np.linalg.norm(bp_vec))
                        if similarity > dna_score:
                            dna_score = float(similarity)
                            best_blueprint = bp
                            
        combined_score = float(np.clip((0.6 * embedding_score) + (0.4 * dna_score), 0.0, 1.0))
        
        # Reasoning
        mentor_text = format_mentor_text({
            "industry": mentor.industry,
            "expertise_areas": mentor.expertise_areas,
            "years_experience": mentor.years_experience,
            "job_title": mentor.job_title,
            "current_company": mentor.current_company,
            "bio": mentor.bio,
            "mentoring_style": mentor.mentoring_style
        })
        
        startup_text = format_startup_text({
            "company_name": startup.company_name,
            "industry": startup.industry,
            "stage": startup.stage.value if startup.stage else None,
            "description": startup.description,
            "support_needed": startup.support_needed
        })
        
        prompt = MATCH_REASONING_PROMPT.format(
            mentor_profile=mentor_text,
            startup_profile=startup_text,
            dna_blueprint=best_blueprint.pattern_summary if best_blueprint else "No relevant historical pattern found."
        )
        
        response = model.generate_content(prompt)
        reasoning = response.text.strip()
        
        candidates.append({
            "mentor_id": mentor_id,
            "startup_id": startup_id,
            "embedding_score": round(embedding_score, 4),
            "dna_score": round(dna_score, 4),
            "combined_score": round(combined_score, 4),
            "match_reasoning": reasoning
        })
        
    candidates.sort(key=lambda x: x["combined_score"], reverse=True)
    return candidates[:3]
