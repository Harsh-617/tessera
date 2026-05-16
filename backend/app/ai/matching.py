import numpy as np
from google import genai
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config import settings
from app.models.startup_profile import StartupProfile
from app.models.mentor_profile import MentorProfile
from app.models.enrollment import Enrollment, RoleInProgrammeEnum
from app.models.user import User
from app.ai.embeddings import generate_startup_embedding, generate_embedding
from app.ai.prompts import MATCH_REASONING_PROMPT

def generate_matches(startup_id: str, programme_id: str, db: Session) -> list[dict]:
    # STEP 1: Startup profile + embedding
    startup = db.query(StartupProfile).filter(StartupProfile.user_id == startup_id).first()
    if not startup:
        return []

    startup_embedding = generate_startup_embedding({
        "company_name": startup.company_name,
        "industry": startup.industry,
        "stage": startup.stage.value if startup.stage else None,
        "description": startup.description,
        "support_needed": startup.support_needed or [],
    })

    enrolled = (
        db.query(Enrollment.user_id)
        .filter(
            Enrollment.programme_id == programme_id,
            Enrollment.role_in_programme == RoleInProgrammeEnum.mentor,
        )
        .all()
    )
    mentor_ids = [str(r[0]) for r in enrolled]

    if not mentor_ids:
        return []

    # STEP 2: Signal A -- pgvector cosine similarity
    startup_embedding_str = "[" + ",".join(map(str, startup_embedding)) + "]"
    similarity_rows = db.execute(
        text("""
            SELECT user_id, 1 - (embedding <=> CAST(:startup_embedding AS vector)) AS similarity
            FROM mentor_profiles
            WHERE CAST(user_id AS TEXT) = ANY(CAST(:mentor_ids AS text[]))
            ORDER BY similarity DESC
            LIMIT 10
        """),
        {"startup_embedding": startup_embedding_str, "mentor_ids": mentor_ids},
    ).fetchall()

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    candidates = []

    for row in similarity_rows:
        mentor_id = str(row.user_id)
        embedding_score = float(row.similarity)

        mentor = db.query(MentorProfile).filter(MentorProfile.user_id == row.user_id).first()
        if not mentor:
            continue

        # STEP 3: Signal B -- DNA blueprint scoring via pgvector
        pairing_desc = (
            f"Mentor: {', '.join(mentor.industry or [])} {', '.join(mentor.expertise_areas or [])} | "
            f"Startup: {startup.industry or ''} {', '.join(startup.support_needed or [])}"
        )
        pairing_embedding = generate_embedding(pairing_desc)
        pairing_embedding_str = "[" + ",".join(map(str, pairing_embedding)) + "]"

        dna_row = db.execute(
            text("""
                SELECT id, pattern_summary,
                       1 - (embedding <=> CAST(:pairing_embedding AS vector)) AS dna_similarity
                FROM dna_blueprints
                ORDER BY dna_similarity DESC
                LIMIT 1
            """),
            {"pairing_embedding": pairing_embedding_str},
        ).fetchone()

        dna_score = float(dna_row.dna_similarity) if dna_row else 0.0
        dna_pattern_summary = dna_row.pattern_summary if dna_row else ""

        # STEP 4: Combined score
        combined_score = float(np.clip(0.6 * embedding_score + 0.4 * dna_score, 0.0, 1.0))

        candidates.append({
            "_mentor": mentor,
            "_dna_pattern": dna_pattern_summary,
            "mentor_user_id": mentor_id,
            "embedding_score": round(embedding_score, 4),
            "dna_score": round(dna_score, 4),
            "combined_score": round(combined_score, 4),
        })

    candidates.sort(key=lambda x: x["combined_score"], reverse=True)
    top3 = candidates[:3]

    # STEP 5: Gemini reasoning for top 3
    results = []
    for c in top3:
        mentor = c.pop("_mentor")
        dna_pattern = c.pop("_dna_pattern")

        mentor_user = db.query(User).filter(User.id == mentor.user_id).first()
        mentor_name = mentor_user.full_name if mentor_user else ""

        prompt = MATCH_REASONING_PROMPT.format(
            mentor_name=mentor_name,
            mentor_industry=", ".join(mentor.industry or []),
            mentor_expertise=", ".join(mentor.expertise_areas or []),
            startup_name=startup.company_name,
            startup_industry=startup.industry or "",
            startup_support_needed=", ".join(startup.support_needed or []),
            dna_pattern_summary=dna_pattern,
        )

        response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        c["match_reasoning"] = response.text.strip()

        # STEP 6: Return shape
        c["mentor_profile"] = {
            "name": mentor_name,
            "industry": mentor.industry or [],
            "expertise_areas": mentor.expertise_areas or [],
            "job_title": mentor.job_title or "",
            "current_company": mentor.current_company or "",
        }
        results.append(c)

    return results
