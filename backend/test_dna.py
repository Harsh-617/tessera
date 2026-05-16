from app.ai.dna import extract_dna_blueprint

link_data = {
    "source_link_id": "test-link-001",
    "programme_type": "accelerator",
    "country": "Malaysia",
    "mentor_profile": {
        "name": "Ahmad Razif",
        "industry": ["Fintech"],
        "expertise_areas": ["fundraising", "investor relations", "financial modelling"],
        "job_title": "VP",
        "current_company": "Maybank",
        "bio": "Experienced fintech mentor with deep investor network in Malaysia."
    },
    "startup_profile": {
        "company_name": "PayNow Pro",
        "industry": "Fintech",
        "stage": "seed",
        "description": "Embedded payments for SMEs in Southeast Asia.",
        "support_needed": ["fundraising", "investor introductions"]
    },
    "checkins": [
        {"duration_minutes": 75},
        {"duration_minutes": 60},
        {"duration_minutes": 90}
    ],
    "milestones": [
        {"status": "completed"},
        {"status": "completed"},
        {"status": "completed"}
    ],
    "outcome_notes": "Startup raised RM600k pre-seed. Mentor's investor network was critical."
}

result = extract_dna_blueprint(link_data)

print("Pattern Summary:")
print(result["pattern_summary"])
print()
print(f"Embedding length: {len(result['embedding'])}")
print()
print(f"Relationship Stats: {result['relationship_stats']}")
print()

if len(result["embedding"]) == 3072:
    print("DNA extraction successful!")
