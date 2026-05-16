import os
import psycopg2
import google.generativeai as genai
from dotenv import load_dotenv
import numpy as np

from actors import MENTORS, STARTUPS
from programmes import PROGRAMMES
from past_links import PAST_LINKS

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

def generate_embedding(text: str) -> list[float]:
    if not os.getenv('GEMINI_API_KEY'):
        print("Warning: GEMINI_API_KEY not set. Using random embeddings for testing.")
        return list(np.random.rand(768))
    
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="SEMANTIC_SIMILARITY"
    )
    return result["embedding"]

def format_mentor_text(profile):
    return f"Role: Mentor\nIndustry: {', '.join(profile.get('industry', []))}\nExpertise: {', '.join(profile.get('expertise_areas', []))}\nExperience: {profile.get('years_experience')} years\nTitle: {profile.get('job_title')} at {profile.get('current_company')}\nBio: {profile.get('bio')}\nMentoring style: {profile.get('mentoring_style')}"

def format_startup_text(profile):
    return f"Role: Startup\nCompany: {profile.get('company_name')}\nIndustry: {profile.get('industry')}\nStage: {profile.get('stage')}\nDescription: {profile.get('description')}\nSupport needed: {', '.join(profile.get('support_needed', []))}"

def seed_database():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("Error: DATABASE_URL not set.")
        return

    conn = psycopg2.connect(database_url)
    conn.autocommit = True
    cursor = conn.cursor()

    print("Seeding Mentors...")
    for mentor in MENTORS:
        # Insert user
        cursor.execute(
            "INSERT INTO users (firebase_uid, email, full_name, role) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING id;",
            (mentor['firebase_uid'], mentor['email'], mentor['full_name'], mentor['role'])
        )
        res = cursor.fetchone()
        if res:
            user_id = res[0]
            # Generate embedding
            text = format_mentor_text(mentor['profile'])
            embedding = generate_embedding(text)
            
            # Insert profile
            cursor.execute(
                """INSERT INTO mentor_profiles 
                (user_id, bio, industry, expertise_areas, years_experience, current_company, job_title, country, availability_hours, mentoring_style, linkedin_url, embedding) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (user_id) DO NOTHING;""",
                (user_id, mentor['profile']['bio'], mentor['profile']['industry'], mentor['profile']['expertise_areas'], mentor['profile']['years_experience'], mentor['profile']['current_company'], mentor['profile']['job_title'], mentor['profile']['country'], mentor['profile']['availability_hours'], mentor['profile']['mentoring_style'], mentor['profile']['linkedin_url'], embedding)
            )

    print("Seeding Startups...")
    for startup in STARTUPS:
        # Insert user
        cursor.execute(
            "INSERT INTO users (firebase_uid, email, full_name, role) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING id;",
            (startup['firebase_uid'], startup['email'], startup['full_name'], startup['role'])
        )
        res = cursor.fetchone()
        if res:
            user_id = res[0]
            # Generate embedding
            text = format_startup_text(startup['profile'])
            embedding = generate_embedding(text)
            
            # Insert profile
            cursor.execute(
                """INSERT INTO startup_profiles 
                (user_id, company_name, description, industry, stage, country, team_size, founded_year, support_needed, website, embedding) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (user_id) DO NOTHING;""",
                (user_id, startup['profile']['company_name'], startup['profile']['description'], startup['profile']['industry'], startup['profile']['stage'], startup['profile']['country'], startup['profile']['team_size'], startup['profile']['founded_year'], startup['profile']['support_needed'], startup['profile']['website'], embedding)
            )

    print("Seeding Programmes...")
    for prog in PROGRAMMES:
        cursor.execute(
            "INSERT INTO programmes (name, type, country, status, start_date, end_date) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING;",
            (prog['name'], prog['type'], prog['country'], prog['status'], prog['start_date'], prog['end_date'])
        )

    # TODO: Insert enrollments, past_links, check_ins, milestones based on PRD
    print("Basic seeding complete.")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    seed_database()
