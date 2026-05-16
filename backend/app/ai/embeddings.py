from google import genai
from app.config import settings


def generate_embedding(text: str) -> list[float]:
    client = genai.Client(
        api_key=settings.GEMINI_API_KEY,
        http_options={"api_version": "v1"},
    )
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )
    return result.embeddings[0].values


def generate_mentor_embedding(profile: dict) -> list[float]:
    text = (
        f"Role: Mentor\n"
        f"Industry: {', '.join(profile.get('industry', []))}\n"
        f"Expertise: {', '.join(profile.get('expertise_areas', []))}\n"
        f"Experience: {profile.get('years_experience')} years\n"
        f"Title: {profile.get('job_title')} at {profile.get('current_company')}\n"
        f"Bio: {profile.get('bio')}\n"
        f"Mentoring style: {profile.get('mentoring_style')}"
    )
    return generate_embedding(text)


def generate_startup_embedding(profile: dict) -> list[float]:
    text = (
        f"Role: Startup\n"
        f"Company: {profile.get('company_name')}\n"
        f"Industry: {profile.get('industry')}\n"
        f"Stage: {profile.get('stage')}\n"
        f"Description: {profile.get('description')}\n"
        f"Support needed: {', '.join(profile.get('support_needed', []))}"
    )
    return generate_embedding(text)
