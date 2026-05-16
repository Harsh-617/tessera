from google import genai
from app.config import settings
from app.ai.prompts import DNA_EXTRACTION_PROMPT
from app.ai.embeddings import generate_embedding


def extract_dna_blueprint(link_data: dict) -> dict:
    mentor = link_data["mentor_profile"]
    startup = link_data["startup_profile"]
    checkins = link_data.get("checkins", [])
    milestones = link_data.get("milestones", [])

    checkin_count = len(checkins)
    avg_duration = (
        round(sum(c["duration_minutes"] for c in checkins) / checkin_count, 1)
        if checkin_count
        else 0
    )

    milestones_completed = sum(1 for m in milestones if m.get("status") == "completed")
    milestones_total = len(milestones)

    prompt = DNA_EXTRACTION_PROMPT.format(
        mentor_metadata=mentor,
        startup_metadata=startup,
        programme_type=link_data["programme_type"],
        country=link_data["country"],
        checkin_count=checkin_count,
        avg_duration=avg_duration,
        milestones_completed=milestones_completed,
        milestones_total=milestones_total,
        outcome_notes=link_data.get("outcome_notes", ""),
    )

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    pattern_summary = response.text.strip()

    embedding = generate_embedding(pattern_summary)

    return {
        "source_link_id": link_data["source_link_id"],
        "programme_type": link_data["programme_type"],
        "industry": startup["industry"],
        "geography": link_data["country"],
        "mentor_snapshot": {
            "name": mentor["name"],
            "industry": mentor["industry"],
            "expertise_areas": mentor["expertise_areas"],
            "job_title": mentor["job_title"],
            "current_company": mentor["current_company"],
        },
        "startup_snapshot": {
            "company_name": startup["company_name"],
            "industry": startup["industry"],
            "stage": startup["stage"],
            "support_needed": startup["support_needed"],
        },
        "relationship_stats": {
            "checkin_count": checkin_count,
            "avg_duration_minutes": avg_duration,
            "milestones_completed": milestones_completed,
            "milestones_total": milestones_total,
        },
        "pattern_summary": pattern_summary,
        "embedding": embedding,
    }
