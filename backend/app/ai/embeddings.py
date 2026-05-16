from google import genai
from google.genai import types
from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_embedding(text: str) -> list[float]:
    """
    Generates a 768-dimensional embedding for the given text
    using the text-embedding-004 model.
    """
    if not text:
        return []
    try:
        result = client.models.embed_content(
            model="models/text-embedding-004",
            contents=text,
            config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
        )
        return result.embeddings[0].values
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return []

def format_mentor_text(profile_data: dict) -> str:
    """Formats mentor profile fields into the canonical embedding input string."""
    return f"""Role: Mentor
Industry: {', '.join(profile_data.get('industry') or [])}
Expertise: {', '.join(profile_data.get('expertise_areas') or [])}
Experience: {profile_data.get('years_experience')} years
Title: {profile_data.get('job_title')} at {profile_data.get('current_company')}
Bio: {profile_data.get('bio')}
Mentoring style: {profile_data.get('mentoring_style')}""".strip()

def format_startup_text(profile_data: dict) -> str:
    """Formats startup profile fields into the canonical embedding input string."""
    return f"""Role: Startup
Company: {profile_data.get('company_name')}
Industry: {profile_data.get('industry')}
Stage: {profile_data.get('stage')}
Description: {profile_data.get('description')}
Support needed: {', '.join(profile_data.get('support_needed') or [])}""".strip()
