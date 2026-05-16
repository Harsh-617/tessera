import numpy as np
from google import genai
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.startup_profile import StartupProfile
from app.models.mentor_profile import MentorProfile
from app.models.enrollment import Enrollment, RoleInProgrammeEnum
from app.models.dna_blueprint import DNABlueprint
from app.ai.embeddings import generate_embedding, format_mentor_text, format_startup_text
from app.ai.prompts import MATCH_REASONING_PROMPT
from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_matches(startup_id, programme_id, db: Session) -> list[dict]:
    """
    Full AI matching pipeline for a given startup within a programme.
    Returns top 3 mentor suggestions sorted by combined_score.
    """
    startup = db.query(StartupProfile).filter(StartupProfile.user_id == startup_id).first()
    if not startup or startup.embedding is None:
        return []

    # Get IDs of mentors enrolled in this programme
    enrolled = db.query(Enrollment.user_id).filter(
        Enrollment.programme_id == programme_id,
        Enrollment.role_in_programme == RoleInProgrammeEnum.mentor
    ).all()
    mentor_ids = [str(r[0]) for r in enrolled]
    if not mentor_ids:
        return []

    # --- Signal A: pgvector cosine similarity ---
    embedding_str = "[" + ",".join(map(str, startup.embedding)) + "]"
    rows = db.execute(text("""
        SELECT user_id, 1 - (embedding <=> CAST(:emb AS vector)) AS similarity
        FROM mentor_profiles
        WHERE CAST(user_id AS text) = ANY(CAST(:ids AS text[]))
          AND embedding IS NOT NULL
        ORDER BY similarity DESC
        LIMIT 10
    """), {"emb": embedding_str, "ids": mentor_ids}).fetchall()

    # Pre-fetch all DNA blueprints for Signal B
    all_blueprints = db.query(DNABlueprint).filter(DNABlueprint.embedding.isnot(None)).all()

    candidates = []
    for row in rows:
        mentor_id = row.user_id
        embedding_score = float(row.similarity)

        mentor = db.query(MentorProfile).filter(MentorProfile.user_id == mentor_id).first()
        if not mentor:
            continue

        # --- Signal B: DNA blueprint cosine similarity ---
        dna_score = 0.0
        best_blueprint = None

        if all_blueprints:
            pairing_desc = (
                f"Mentor: {mentor.job_title} in {', '.join(mentor.industry or [])}. "
                f"Startup: {startup.stage} in {startup.industry} needing {', '.join(startup.support_needed or [])}."
            )
            pairing_emb = generate_embedding(pairing_desc)

            if pairing_emb:
                pairing_vec = np.array(pairing_emb)
                for bp in all_blueprints:
                    bp_vec = np.array(bp.embedding)
                    norm = np.linalg.norm(pairing_vec) * np.linalg.norm(bp_vec)
                    if norm > 0:
                        sim = float(np.dot(pairing_vec, bp_vec) / norm)
                        if sim > dna_score:
                            dna_score = sim
                            best_blueprint = bp

        combined_score = float(np.clip((0.6 * embedding_score) + (0.4 * dna_score), 0.0, 1.0))

        # --- Gemini Flash reasoning ---
        prompt = MATCH_REASONING_PROMPT.format(
            mentor_profile=format_mentor_text({
                "industry": mentor.industry, "expertise_areas": mentor.expertise_areas,
                "years_experience": mentor.years_experience, "job_title": mentor.job_title,
                "current_company": mentor.current_company, "bio": mentor.bio,
                "mentoring_style": mentor.mentoring_style
            }),
            startup_profile=format_startup_text({
                "company_name": startup.company_name, "industry": startup.industry,
                "stage": startup.stage.value if startup.stage else None,
                "description": startup.description, "support_needed": startup.support_needed
            }),
            dna_blueprint=best_blueprint.pattern_summary if best_blueprint else "No relevant historical pattern found."
        )
        response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
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
