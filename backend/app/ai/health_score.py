from datetime import datetime


def _get(obj, key):
    if isinstance(obj, dict):
        return obj[key]
    return getattr(obj, key)


def calculate_health_score(checkins: list, milestones: list) -> tuple:
    now = datetime.utcnow()

    if not checkins:
        days_since_checkin = 999
    else:
        last_checkin = max(_get(c, "created_at") for c in checkins)
        days_since_checkin = (now - last_checkin).total_seconds() / 86400

    score = 100.0

    if days_since_checkin > 7:
        score -= 5 * (days_since_checkin - 7)

    overdue_count = sum(1 for m in milestones if _get(m, "status") == "overdue")
    score -= overdue_count * 15

    checkin_this_week = any(
        (now - _get(c, "created_at")).total_seconds() / 86400 <= 7 for c in checkins
    )
    if checkin_this_week:
        score += 5

    completed_count = sum(1 for m in milestones if _get(m, "status") == "completed")
    score += completed_count * 10

    if any(_get(c, "duration_minutes") > 60 for c in checkins):
        score += 3

    score = max(0.0, min(100.0, score))

    if days_since_checkin > 14 or score < 40:
        status = "at_risk"
    elif score >= 70:
        status = "healthy"
    else:
        status = "warning"

    return (score, status)
