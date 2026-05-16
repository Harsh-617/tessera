import os
import psycopg2
from google import genai
from google.genai import types
from dotenv import load_dotenv
import numpy as np

from actors import MENTORS, STARTUPS
from programmes import PROGRAMMES
from past_links import PAST_LINKS

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in .env")
        _client = genai.Client(api_key=api_key)
    return _client

def generate_embedding(text: str) -> list[float]:
    try:
        result = get_client().models.embed_content(
            model="gemini-embedding-001",
            contents=text,
            config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY", output_dimensionality=768)
        )
        # Always return a plain Python list of floats for psycopg2 compatibility
        return [float(v) for v in result.embeddings[0].values]
    except Exception as e:
        print(f"Warning: Could not generate embedding: {e}. Using random vector.")
        return [float(v) for v in np.random.rand(768)]

def format_mentor_text(profile):
    return (
        f"Role: Mentor\n"
        f"Industry: {', '.join(profile.get('industry', []))}\n"
        f"Expertise: {', '.join(profile.get('expertise_areas', []))}\n"
        f"Experience: {profile.get('years_experience')} years\n"
        f"Title: {profile.get('job_title')} at {profile.get('current_company')}\n"
        f"Bio: {profile.get('bio')}\n"
        f"Mentoring style: {profile.get('mentoring_style')}"
    )

def format_startup_text(profile):
    return (
        f"Role: Startup\n"
        f"Company: {profile.get('company_name')}\n"
        f"Industry: {profile.get('industry')}\n"
        f"Stage: {profile.get('stage')}\n"
        f"Description: {profile.get('description')}\n"
        f"Support needed: {', '.join(profile.get('support_needed', []))}"
    )

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
        cursor.execute(
            "INSERT INTO users (firebase_uid, email, full_name, role) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING id;",
            (mentor['firebase_uid'], mentor['email'], mentor['full_name'], mentor['role'])
        )
        res = cursor.fetchone()
        if res:
            user_id = res[0]
            text = format_mentor_text(mentor['profile'])
            embedding = generate_embedding(text)
            cursor.execute(
                """INSERT INTO mentor_profiles
                (user_id, bio, industry, expertise_areas, years_experience, current_company, job_title, country, availability_hours, mentoring_style, linkedin_url, embedding)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (user_id) DO NOTHING;""",
                (user_id, mentor['profile']['bio'], mentor['profile']['industry'], mentor['profile']['expertise_areas'],
                 mentor['profile']['years_experience'], mentor['profile']['current_company'], mentor['profile']['job_title'],
                 mentor['profile']['country'], mentor['profile']['availability_hours'], mentor['profile']['mentoring_style'],
                 mentor['profile']['linkedin_url'], embedding)
            )
            print(f"  ✓ {mentor['full_name']}")
        else:
            print(f"  ⚠ {mentor['full_name']} already exists, skipping.")

    print("\nSeeding Startups...")
    for startup in STARTUPS:
        cursor.execute(
            "INSERT INTO users (firebase_uid, email, full_name, role) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING id;",
            (startup['firebase_uid'], startup['email'], startup['full_name'], startup['role'])
        )
        res = cursor.fetchone()
        if res:
            user_id = res[0]
            text = format_startup_text(startup['profile'])
            embedding = generate_embedding(text)
            cursor.execute(
                """INSERT INTO startup_profiles
                (user_id, company_name, description, industry, stage, country, team_size, founded_year, support_needed, website, embedding)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (user_id) DO NOTHING;""",
                (user_id, startup['profile']['company_name'], startup['profile']['description'], startup['profile']['industry'],
                 startup['profile']['stage'], startup['profile']['country'], startup['profile']['team_size'],
                 startup['profile']['founded_year'], startup['profile']['support_needed'], startup['profile']['website'], embedding)
            )
            print(f"  ✓ {startup['full_name']} ({startup['profile']['company_name']})")
        else:
            print(f"  ⚠ {startup['full_name']} already exists, skipping.")

    print("\nSeeding Programmes...")
    for prog in PROGRAMMES:
        cursor.execute(
            "INSERT INTO programmes (name, type, country, status, start_date, end_date) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING;",
            (prog['name'], prog['type'], prog['country'], prog['status'], prog['start_date'], prog['end_date'])
        )
        print(f"  ✓ {prog['name']}")

    print("\nSeeding Past Links & Activity...")
    from datetime import date, timedelta
    base_date = date(2024, 3, 1)  # Cohort 6 start date

    for link_data in PAST_LINKS:
        cursor.execute("SELECT id FROM users WHERE email = %s", (link_data['mentor_email'],))
        mentor_row = cursor.fetchone()
        cursor.execute("SELECT id FROM users WHERE email = %s", (link_data['startup_email'],))
        startup_row = cursor.fetchone()
        cursor.execute("SELECT id FROM programmes WHERE name = %s", (link_data['programme_name'],))
        prog_row = cursor.fetchone()

        if not mentor_row or not startup_row or not prog_row:
            print(f"  ⚠ Skipping link: could not resolve actors/programme for {link_data.get('mentor_email')}")
            continue

        mentor_id, startup_id, programme_id = mentor_row[0], startup_row[0], prog_row[0]

        completed_at = base_date + timedelta(weeks=16)
        activated_at = base_date

        cursor.execute("""
            INSERT INTO links
            (programme_id, link_type, entity_a_id, entity_b_id, status, embedding_score, dna_score, combined_score,
             match_reasoning, created_by, activated_at, completed_at, outcome, outcome_notes)
            VALUES (%s, 'mentor_startup', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING RETURNING id;
        """, (
            programme_id, mentor_id, startup_id,
            link_data['status'],
            link_data.get('embedding_score', 0.75), link_data.get('dna_score', 0.0),
            link_data.get('combined_score', 0.75), link_data.get('match_reasoning', 'Seeded historical link.'),
            mentor_id, activated_at, completed_at,
            link_data.get('outcome'), link_data.get('outcome_notes')
        ))
        link_row = cursor.fetchone()
        if not link_row:
            print(f"  ⚠ Link already exists, skipping.")
            continue
        link_id = link_row[0]

        # Synthesize check-in rows from summary stats
        count = link_data.get('checkins_count', 0)
        avg_dur = link_data.get('checkins_avg_duration', 60)
        for i in range(count):
            session_date = activated_at + timedelta(weeks=i + 1)
            cursor.execute("""
                INSERT INTO check_ins (link_id, logged_by, session_date, duration_minutes, topics_discussed, notes)
                VALUES (%s, %s, %s, %s, %s, %s);
            """, (link_id, mentor_id, session_date, avg_dur, 'Seeded session', 'Historical record.'))

        # Synthesize milestones from summary stats
        total_ms = link_data.get('milestones_total', 0)
        completed_ms = link_data.get('milestones_completed', 0)
        for i in range(total_ms):
            ms_status = 'completed' if i < completed_ms else 'pending'
            ms_completed_at = (completed_at - timedelta(weeks=total_ms - i)).isoformat() if i < completed_ms else None
            cursor.execute("""
                INSERT INTO milestones (link_id, title, status, completed_at)
                VALUES (%s, %s, %s, %s);
            """, (link_id, f"Milestone {i + 1}", ms_status, ms_completed_at))

        print(f"  ✓ Link: {link_data['mentor_email']} → {link_data['startup_email']} ({link_data['outcome']}, {count} check-ins, {completed_ms}/{total_ms} milestones)")

    print("\n✅ Seeding complete!")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    seed_database()
