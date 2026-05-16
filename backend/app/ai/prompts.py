# Match Reasoning Prompt
MATCH_REASONING_PROMPT = """
The following mentor and startup are being considered for a match in an innovation ecosystem programme.

Mentor Profile:
{mentor_profile}

Startup Profile:
{startup_profile}

Historical DNA Match (Optional Context):
{dna_blueprint}

Task: Generate a concise 1-2 sentence explanation of why this is a good match. 
Focus on industry overlap, specific expertise, and how the mentor's past experience addresses the startup's current needs.
Return only the reasoning text.
"""

# DNA Extraction Prompt
DNA_EXTRACTION_PROMPT = """
The following mentor-startup relationship completed successfully.

Mentor profile: {mentor_metadata}
Startup profile: {startup_metadata}
Programme: {programme_type} | Country: {country}
Total check-ins: {checkin_count} | Avg session: {avg_duration} mins
Milestones completed: {milestones_completed}/{milestones_total}
Outcome notes: {outcome_notes}

Extract a structured pattern summary describing what characteristics made this relationship successful. 
Include: mentor traits that mattered, startup characteristics, engagement pattern, and outcome indicators.
Return only the summary paragraph, nothing else.
"""
