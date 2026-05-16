# Centralised Gemini prompt strings for the Tessera AI matching engine.
# No logic here — only string constants used across ai/ modules.

# Used in matching.py to generate a 1-2 sentence explanation of a mentor-startup pairing.
MATCH_REASONING_PROMPT = """You are an expert startup programme advisor. Given the mentor and startup details below, write a concise explanation of why this mentor is a strong match for this startup.

Mentor name: {mentor_name}
Mentor industry: {mentor_industry}
Mentor expertise: {mentor_expertise}

Startup name: {startup_name}
Startup industry: {startup_industry}
Support needed: {startup_support_needed}

Historical DNA pattern: {dna_pattern_summary}

Rules:
- Write exactly 1-2 sentences.
- Be specific about the industry overlap and how the mentor's expertise addresses the startup's support needs.
- If a historical DNA pattern is provided, reference it briefly to reinforce the match.
- Return only the reasoning text. No preamble, no labels, no bullet points."""

# Used in dna.py to distil a completed successful relationship into a reusable pattern summary.
DNA_EXTRACTION_PROMPT = """You are an expert at analysing mentor-startup relationships in accelerator programmes. Given the metadata below for a completed, successful engagement, extract a pattern summary that captures what made this relationship work.

Mentor metadata: {mentor_metadata}
Startup metadata: {startup_metadata}
Programme type: {programme_type}
Country: {country}
Check-in count: {checkin_count}
Average session duration (minutes): {avg_duration}
Milestones completed: {milestones_completed} of {milestones_total}
Outcome notes: {outcome_notes}

Rules:
- Write a single paragraph of 4-6 sentences.
- Cover all four dimensions: mentor traits that drove value, startup characteristics that enabled receptiveness, the engagement pattern (frequency and depth), and outcome indicators that signal success.
- Be specific and extractable so the summary can be used to match future pairings.
- Return only the summary paragraph. No headings, no labels, no extra commentary."""
