from datetime import datetime, timedelta
from app.ai.health_score import calculate_health_score

now = datetime.utcnow()


def run(label, checkins, milestones):
    result = calculate_health_score(checkins, milestones)
    print(f"[{label}]  score={result['score']:.1f}  status={result['status']}")


# 1. Healthy — check-in 3 days ago (90 min), 2 completed milestones
run(
    "Healthy",
    checkins=[{"created_at": now - timedelta(days=3), "duration_minutes": 90}],
    milestones=[
        {"status": "completed"},
        {"status": "completed"},
    ],
)

# 2. Warning — check-in 10 days ago, 1 overdue milestone
run(
    "Warning",
    checkins=[{"created_at": now - timedelta(days=10), "duration_minutes": 30}],
    milestones=[{"status": "overdue"}],
)

# 3. At risk by inactivity — check-in 20 days ago, no milestones
run(
    "At risk (inactivity)",
    checkins=[{"created_at": now - timedelta(days=20), "duration_minutes": 30}],
    milestones=[],
)

# 4. Empty — no check-ins, no milestones
run(
    "Empty",
    checkins=[],
    milestones=[],
)
