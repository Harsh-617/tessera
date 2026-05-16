from app.ai.embeddings import generate_mentor_embedding, generate_startup_embedding

mentor = {
    "industry": ["Fintech"],
    "expertise_areas": ["fundraising", "investor relations"],
    "years_experience": 14,
    "job_title": "VP",
    "current_company": "Maybank",
    "bio": "Experienced fintech mentor with deep investor network.",
    "mentoring_style": "Hands-on, goal oriented.",
}

startup = {
    "company_name": "PayNow Pro",
    "industry": "Fintech",
    "stage": "seed",
    "description": "Embedded payments for SMEs.",
    "support_needed": ["fundraising", "investor introductions"],
}

mentor_vec = generate_mentor_embedding(mentor)
startup_vec = generate_startup_embedding(startup)

print(f"Mentor vector length: {len(mentor_vec)}")
print(f"Mentor first 5 values: {mentor_vec[:5]}")

print(f"Startup vector length: {len(startup_vec)}")
print(f"Startup first 5 values: {startup_vec[:5]}")

if len(mentor_vec) == 768 and len(startup_vec) == 768:
    print("All good!")
