import google.generativeai as genai
from app.config import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_embedding(text: str) -> list[float]:
    """
    Generates a 768-dimensional embedding for the given text 
    using the text-embedding-004 model.
    """
    if not text:
        return []
        
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="SEMANTIC_SIMILARITY"
        )
        return result["embedding"]
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return []

def format_mentor_text(profile_data: dict) -> str:
    """Formats mentor profile fields for embedding."""
    return f"""
Role: Mentor
Industry: {', '.join(profile_data.get('industry', []))}
Expertise: {', '.join(profile_data.get('expertise_areas', []))}
Experience: {profile_data.get('years_experience')} years
Title: {profile_data.get('job_title')} at {profile_data.get('current_company')}
Bio: {profile_data.get('bio')}
Mentoring style: {profile_data.get('mentoring_style')}
""".strip()

def format_startup_text(profile_data: dict) -> str:
    """Formats startup profile fields for embedding."""
    return f"""
Role: Startup
Company: {profile_data.get('company_name')}
Industry: {profile_data.get('industry')}
Stage: {profile_data.get('stage')}
Description: {profile_data.get('description')}
Support needed: {', '.join(profile_data.get('support_needed', []))}
""".strip()
