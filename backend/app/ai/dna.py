import json
from google import genai
from sqlalchemy.orm import Session
from app.models.link import Link
from app.models.checkin import CheckIn
from app.models.milestone import Milestone
from app.models.mentor_profile import MentorProfile
from app.models.startup_profile import StartupProfile
from app.models.programme import Programme
from app.models.dna_blueprint import DNABlueprint
from app.ai.embeddings import generate_embedding
from app.ai.prompts import DNA_EXTRACTION_PROMPT
from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def extract_dna_blueprint(link_id: str, db: Session):
    """
    Background task: triggered when a link is marked completed with outcome = successful.
    Collects all relationship data, calls Gemini Flash to generate a pattern summary,
    embeds it, and stores it as a DNA blueprint.
    """
    link = db.query(Link).filter(Link.id == link_id).first()
    if not link or link.outcome.value != "successful":
        return

    mentor = db.query(MentorProfile).filter(MentorProfile.user_id == link.entity_a_id).first()
    startup = db.query(StartupProfile).filter(StartupProfile.user_id == link.entity_b_id).first()
    programme = db.query(Programme).filter(Programme.id == link.programme_id).first()
    checkins = db.query(CheckIn).filter(CheckIn.link_id == link.id).all()
    milestones = db.query(Milestone).filter(Milestone.link_id == link.id).all()

    if not mentor or not startup or not programme:
        return

    # 1. Gather stats
    total_checkins = len(checkins)
    avg_duration = sum(c.duration_minutes for c in checkins) / total_checkins if total_checkins > 0 else 0
    completed_milestones = sum(1 for m in milestones if m.status.value == "completed")
    total_milestones = len(milestones)

    mentor_snapshot = {
        "industry": mentor.industry,
        "expertise_areas": mentor.expertise_areas,
        "years_experience": mentor.years_experience
    }
    startup_snapshot = {
        "industry": startup.industry,
        "stage": startup.stage.value if startup.stage else None,
        "support_needed": startup.support_needed
    }

    # 2. Call Gemini Flash
    prompt = DNA_EXTRACTION_PROMPT.format(
        mentor_metadata=json.dumps(mentor_snapshot),
        startup_metadata=json.dumps(startup_snapshot),
        programme_type=programme.type.value,
        country=programme.country,
        checkin_count=total_checkins,
        avg_duration=round(avg_duration, 1),
        milestones_completed=completed_milestones,
        milestones_total=total_milestones,
        outcome_notes=link.outcome_notes or "None"
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    pattern_summary = response.text.strip()

    # 3. Embed the pattern summary
    embedding = generate_embedding(pattern_summary)
    if not embedding:
        return

    # 4. Persist blueprint
    blueprint = DNABlueprint(
        source_link_id=link.id,
        programme_type=programme.type,
        industry=startup.industry or "general",
        geography=programme.country,
        mentor_snapshot=mentor_snapshot,
        startup_snapshot=startup_snapshot,
        relationship_stats={"total_checkins": total_checkins, "avg_duration_mins": avg_duration},
        outcome_metrics={"milestones_completed": completed_milestones, "total_milestones": total_milestones},
        pattern_summary=pattern_summary,
        embedding=embedding
    )
    db.add(blueprint)
    db.commit()
