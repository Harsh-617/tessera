from datetime import date

def calculate_health_score(checkins: list, milestones: list) -> tuple[float, str]:
    """
    Calculates the health score (0-100) and status string for a relationship.
    
    Logic:
    - Base score: 100
    - Deductions:
        - > 7 days since last check-in: -5 per extra day beyond 7
        - > 14 days since last check-in: force status = at_risk
        - each overdue milestone: -15
    - Additions:
        - check-in this week: +5
        - milestone completed: +10
        - session duration > 60 mins: +3
    """
    base_score = 100.0
    status = "healthy"
    
    today = date.today()
    
    if not checkins:
        # No activity yet - initial state
        return 50.0, "warning"

    # Find the most recent check-in
    last_checkin_date = max(c.session_date for c in checkins)
    days_since_last = (today - last_checkin_date).days
    
    # Deductions for inactivity
    if days_since_last > 14:
        status = "at_risk"
        base_score -= 50 # Heavy penalty
    elif days_since_last > 7:
        base_score -= (days_since_last - 7) * 5
        
    # Bonus for recent activity
    if days_since_last <= 7:
        base_score += 5
        
    # Milestone impact
    for m in milestones:
        if m.status.value == "overdue":
            base_score -= 15
        elif m.status.value == "completed":
            base_score += 10
            
    # Session duration quality bonus
    for c in checkins:
        if c.duration_minutes > 60:
            base_score += 3
            
    # Ensure score is within 0-100 bounds
    score = float(max(0.0, min(100.0, base_score)))
    
    # Final status determination (if not already forced to at_risk)
    if status != "at_risk":
        if score >= 70:
            status = "healthy"
        elif score >= 40:
            status = "warning"
        else:
            status = "at_risk"
            
    return score, status
