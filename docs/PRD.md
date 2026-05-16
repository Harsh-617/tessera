# Product Requirements Document
## [PLATFORM NAME] — AI-Powered Ecosystem Relationship Engine
**Hackathon:** Build With AI 2026 KL — MyHack | 16 & 17 May 2026
**Problem Statement:** Automating Ecosystem Linkages Instead of Manual Coordination (Cradle)

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Core Concepts](#4-core-concepts)
5. [Actors & Roles](#5-actors--roles)
6. [Feature List](#6-feature-list)
7. [User Flows](#7-user-flows)
8. [Tech Stack](#8-tech-stack)
9. [Data Model](#9-data-model)
10. [AI/ML Design](#10-aiml-design)
11. [API Design](#11-api-design)
12. [Frontend Screens](#12-frontend-screens)
13. [Seed Data Plan](#13-seed-data-plan)
14. [File Structure](#14-file-structure)
15. [Work Distribution](#15-work-distribution)

---

## 1. Product Overview

**[PLATFORM NAME]** is a SaaS platform that automates and manages innovation ecosystem relationships as reusable, programmable entities. Instead of manual coordination via spreadsheets and ad-hoc assignments, the platform treats every connection between ecosystem actors — mentors, startups, partners, programmes — as a structured, living object with its own lifecycle, health score, and intelligence.

The platform combines two core systems:
- **EcoGraph OS** — relationships as first-class, programmable entities with lifecycle states, rules, and behavioral triggers
- **Relationship DNA** — an AI learning engine that extracts success patterns from completed relationships and uses them to improve future matching

Together, they form a self-improving ecosystem intelligence platform that gets smarter with every completed programme.

---

## 2. Problem Statement

Regional innovation ecosystems rely on manual coordination to create and manage relationships between companies, mentors, partners, service providers, and programme administrators. Critical linkages like mentor-to-company, company-to-programme, and partner-to-initiative are handled as one-off assignments rather than structured, reusable system entities.

**Core issues:**
- No platform-level mechanism to determine how relationships should be formed or evolve
- Past engagement data cannot improve future matching
- Operational bottlenecks at scale — works for 10 companies, breaks at 100
- No consistency across programmes or geographies
- Manual coordination limits ecosystem growth and learning

**Affected users:** Programme owners, ecosystem administrators, mentors, companies, partners, service providers.

---

## 3. Solution Overview

Build an AI-enabled platform where ecosystem relationships are first-class, programmable entities that can be created, managed, reused, and improved automatically across programmes, countries, and ecosystem actors.

**What makes this unique:**
- Relationships have lifecycle states, health scores, and behavioral rules — not just foreign keys in a database
- AI matching uses two signals: real-time semantic embedding similarity + historical DNA success patterns
- Every successful relationship generates a reusable DNA blueprint that improves future matching
- The system compounds — each cohort makes the next cohort's matching smarter
- Human-in-the-loop design — AI suggests, admin approves. Responsible AI.

---

## 4. Core Concepts

### 4.1 EcoGraph OS (Platform Foundation)
Every connection between actors is stored as a **Link entity** — a structured object with:
- A **type** (mentor_startup, company_programme, partner_initiative)
- A **lifecycle state** (proposed → active → at_risk → completed/failed)
- A **health score** (0–100, calculated from engagement data)
- **Rules and triggers** (auto-transition to at_risk after 14 days of inactivity)
- **Match scores** (embedding similarity + DNA score + combined score)
- **Full audit history** (every state transition logged)

Links are not database rows. They are living entities that react to events over time.

### 4.2 Relationship DNA (AI Learning Engine)
When a link completes **successfully**, the system automatically:
1. Extracts the success pattern using Gemini Flash
2. Stores a **DNA blueprint** — a reusable template capturing what made this relationship work
3. Embeds the blueprint for vector search

Future matching uses these blueprints as Signal B alongside embedding similarity (Signal A). Every completed programme adds more DNA, making matching progressively smarter.

**Key distinction:**
- Signal A (embeddings) answers: *How similar are these two entities right now?*
- Signal B (DNA) answers: *Based on past successes, how likely is this pairing to succeed?*

### 4.3 The Feedback Loop
```
New match (Signal A + Signal B)
        ↓
Link entity created → managed by EcoGraph OS
        ↓
Engagement tracked → health score updated
        ↓
Successful completion → DNA extraction triggered
        ↓
New blueprint added to library
        ↓
Next cohort benefits from the pattern
        ↓
(repeat — compounds with every cohort)
```

---

## 5. Actors & Roles

| Role | Description | Primary Actions |
|---|---|---|
| **Admin** | Programme owner / ecosystem manager | Create programmes, enroll actors, run matching, manage links, view DNA library |
| **Mentor** | Expert guiding startups | Log check-ins, update milestones, view active links |
| **Startup** | Company being supported | Log check-ins, update milestones, view active links |
| **Partner** | Corporate, investor, or service provider | Linked to initiatives manually by admin |

Roles are set once at onboarding and cannot be changed. Role is stored in the platform's Postgres database, not Firebase. Firebase handles identity only.

---

## 6. Feature List

### 6.1 MVP — Build for Hackathon Demo

These features must be working for the demo. Everything else is secondary.

#### Authentication & Onboarding
- [ ] Google Sign-In via Firebase Authentication
- [ ] Role selection screen (admin / mentor / startup / partner)
- [ ] Mentor profile creation with full metadata fields
- [ ] Startup profile creation with full metadata fields
- [ ] Auto-embedding generation on profile save (background task)

#### EcoGraph OS — Core Link Management
- [ ] Link entity creation with lifecycle state machine (proposed → active → at_risk → completed/failed)
- [ ] Link health score calculation (based on check-in frequency, milestone status, inactivity)
- [ ] Auto-transition to at_risk after 14 days of no check-in
- [ ] Link state transition audit trail (link_events table)
- [ ] Admin can activate, complete, or fail a link

#### AI Matching Engine
- [ ] Embedding-based similarity matching using pgvector cosine distance
- [ ] DNA blueprint scoring against candidate pairs
- [ ] Combined score = (0.6 × embedding_score) + (0.4 × dna_score)
- [ ] Gemini-generated match reasoning (1–2 sentence explanation per suggestion)
- [ ] Top 3 mentor suggestions per startup, ranked by combined score
- [ ] Admin reviews and approves matches — human-in-the-loop

#### Engagement Tracking
- [ ] Check-in logging (session date, duration, topics, notes)
- [ ] Milestone creation and status tracking (pending / completed / overdue)
- [ ] Health score recalculation on every check-in and milestone update

#### DNA System
- [ ] DNA blueprint extraction triggered on successful link completion (background task)
- [ ] Gemini Flash generates pattern_summary from relationship data
- [ ] Pattern embedded and stored with tags (industry, programme_type, geography)
- [ ] DNA blueprints used in matching for new cohorts

#### Programme Management
- [ ] Create and configure programmes (name, type, country, dates, rules, success metrics)
- [ ] Enroll actors into programmes
- [ ] Generate matches for a cohort

#### Admin Dashboard
- [ ] Stats cards: total active links, at-risk count, total programmes, DNA blueprint count
- [ ] Links table with health score bars, status badges, last activity
- [ ] At-risk links highlighted

#### Key Screens (must look polished)
- [ ] Match Explorer — ranked suggestions with scores and AI reasoning
- [ ] Link Detail — health gauge, check-ins, milestones, event history
- [ ] DNA Library — browse blueprints by industry/type/geography
- [ ] Admin Dashboard — stats overview

---

### 6.2 Phase 2 — Build After MVP (Post-Hackathon)

These features are important for a production product but not required for the demo.

#### Enhanced Matching
- [ ] Bulk auto-approve for matches above 90% combined score
- [ ] Re-matching — suggest replacement mentor if a link fails
- [ ] Cross-geography DNA reuse with geography weighting (same-country blueprints weighted higher)
- [ ] Match history — view past match suggestions and outcomes per programme

#### Relationship Management
- [ ] Partner profiles with rich metadata and partner-to-initiative links
- [ ] Multi-mentor support per startup (primary + secondary mentor)
- [ ] Peer matching — startup-to-startup connections for cohort community building
- [ ] Relationship reassignment — admin can swap one actor in an active link

#### Notifications & Alerts
- [ ] Email notifications on link state transitions
- [ ] Weekly health score digest for admins
- [ ] Reminder emails to mentors/startups when check-in is overdue
- [ ] In-app notification centre

#### Analytics & Insights
- [ ] Programme-level analytics: avg health score, match success rate, time-to-active
- [ ] Cohort comparison dashboard — compare KPIs across programmes
- [ ] Mentor performance metrics — track which mentors consistently achieve high outcomes
- [ ] DNA library analytics — which blueprint patterns have highest success rates

#### Programme Enhancements
- [ ] Programme templates — clone a previous programme's rules and metrics
- [ ] Multi-admin support — multiple admins per programme
- [ ] Programme archiving and export

---

### 6.3 Phase 3 — Future Vision

Long-term features that extend the platform's scope.

#### Ecosystem Intelligence
- [ ] Cross-organisation DNA sharing — ecosystem networks share anonymised blueprints
- [ ] Predictive risk scoring — flag relationships likely to fail before they do, based on early engagement patterns
- [ ] AI-generated cohort insights — "Your fintech cohort has 40% lower engagement than similar programmes in the DNA library"
- [ ] Natural language admin interface — "Show me all at-risk fintech mentorships from the last 6 months"

#### Scale & Geography
- [ ] Multi-tenant architecture — separate organisations on one platform
- [ ] Regional DNA libraries — ASEAN-specific, SEA fintech, etc.
- [ ] Multi-language support (Malay, Indonesian, Thai)
- [ ] Mobile app for mentor and startup check-in logging

#### Integrations
- [ ] Calendar integration — auto-schedule check-ins from the platform
- [ ] Slack/Teams integration — log check-ins from messaging tools
- [ ] Grant management integration — link funding milestones to relationship milestones
- [ ] LinkedIn import — auto-populate actor profiles from LinkedIn

---

## 7. User Flows

### Flow 1 — Actor Onboarding
1. User signs in via Google (Firebase Auth)
2. `/auth/verify` called → user row created in Postgres with role
3. Role selection screen shown if first login
4. Profile setup form shown based on role (mentor or startup)
5. Profile saved → embedding generated in background (Gemini text-embedding-004)
6. Actor enters the matching pool — available for any compatible programme

### Flow 2 — Programme Setup (Admin)
1. Admin creates programme — name, type, country, dates, rules, success metrics
2. Admin enrolls mentors and startups into the programme
3. All enrolled actors must have completed profiles (enforced at enrollment)
4. Programme status set to active — ready for matching

### Flow 3 — AI Match Generation
1. Admin clicks "Generate matches" on programme detail screen
2. For each startup: embedding similarity query runs via pgvector (Signal A)
3. Top candidates compared against DNA blueprints (Signal B)
4. Scores combined: (0.6 × A) + (0.4 × B) = combined_score
5. Gemini Flash generates 1–2 sentence reasoning per top 3 candidates
6. Match Explorer screen displays ranked suggestions with both scores and reasoning
7. Admin reviews and approves preferred match
8. Link entity created with status = proposed

### Flow 4 — Relationship Lifecycle
1. Link created with status = proposed
2. Both parties notified — activate link (or admin force-activates)
3. Status → active, activated_at timestamp set
4. Mentor and startup log check-ins and update milestones through the platform
5. Health score recalculates on every activity event
6. If no check-in for 14 days → status auto-transitions to at_risk, admin alerted
7. Admin marks link complete → outcome set (successful/unsuccessful)
8. If successful → DNA extraction triggered as background task

### Flow 5 — DNA Extraction
1. Successful link completion triggers background job
2. Job collects: link data, actor profiles, all check-ins, all milestones, outcome notes
3. Gemini Flash generates pattern_summary — what made this relationship work
4. Pattern_summary embedded via text-embedding-004 → vector stored
5. DNA blueprint row saved with tags (industry, programme_type, geography)
6. Blueprint available immediately for next matching run

### Flow 6 — Cross-Programme Reuse
1. New programme created in a different country or cohort
2. Admin triggers match generation
3. DNA engine queries all relevant blueprints — filtered by programme_type and industry
4. Even with no local history, new cohort benefits from all past successful patterns
5. New cohort completes → more blueprints added → ecosystem gets smarter

---

## 8. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | UI framework |
| Frontend hosting | Cloud Run (nginx container) | Serve React build |
| Auth | Firebase Authentication | Google Sign-In, token issuance |
| Backend | FastAPI (Python) | REST API, business logic, state machine |
| Backend hosting | Cloud Run | Serverless container deployment |
| Auth verification | firebase-admin SDK | Verify Firebase tokens in FastAPI |
| Async jobs | FastAPI BackgroundTasks | DNA extraction, embedding generation |
| Database | Cloud SQL — PostgreSQL + pgvector | All structured data + vector embeddings |
| AI embeddings | Gemini API — text-embedding-004 | Profile and DNA blueprint embeddings (768-dim) |
| Vector search | pgvector cosine similarity | Find closest mentor embeddings to startup |
| LLM | Gemini 1.5 Flash | Match reasoning, DNA extraction, health narratives |
| AI SDK | google-generativeai (Python) | Single package for all Gemini calls |

### AI/ML Libraries
```
google-generativeai   # Gemini embeddings + Flash LLM
pgvector              # pgvector SQLAlchemy type
psycopg2-binary       # Postgres driver
sqlalchemy            # ORM
numpy                 # Score combination math
python-dotenv         # Environment variable loading
```

### Auth Flow (end-to-end)
```
User logs in (Firebase) →
Firebase issues token →
React sends token in Authorization: Bearer header →
FastAPI verifies with firebase-admin SDK →
Extracts firebase_uid →
Looks up user role in Postgres →
Proceeds with role-based access control
```

**Note:** Roles (admin/mentor/startup/partner) are stored in Postgres, NOT in Firebase. Firebase = identity only. Postgres = what they can do.

---

## 9. Data Model

### 9.1 Table: users
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | Primary key used as FK across all tables |
| firebase_uid | VARCHAR unique | Links to Firebase Auth identity |
| email | VARCHAR unique | From Firebase |
| full_name | VARCHAR | Display name |
| role | ENUM | admin / mentor / startup / partner |
| is_active | BOOLEAN | Soft disable without deleting |
| created_at | TIMESTAMP | Audit trail |

### 9.2 Table: mentor_profiles
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK unique | One-to-one with users |
| bio | TEXT | Free-text background — primary embedding input |
| industry | VARCHAR[] | Array: fintech, SaaS, deeptech etc. |
| expertise_areas | VARCHAR[] | Array: fundraising, product, tech, sales |
| years_experience | INTEGER | Signals seniority |
| current_company | VARCHAR | |
| job_title | VARCHAR | Included in embedding text |
| country | VARCHAR | Geography filter |
| availability_hours | INTEGER | Hours per month |
| mentoring_style | TEXT | Embedded for matching |
| linkedin_url | VARCHAR | Admin reference only |
| embedding | VECTOR(768) | AI-generated from text fields |
| updated_at | TIMESTAMP | Triggers re-embedding on change |

**Embedding input text format:**
```
Role: Mentor
Industry: {industry joined}
Expertise: {expertise_areas joined}
Experience: {years_experience} years
Title: {job_title} at {current_company}
Bio: {bio}
Mentoring style: {mentoring_style}
```

### 9.3 Table: startup_profiles
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID FK unique | One-to-one with users |
| company_name | VARCHAR | |
| description | TEXT | What they do + problem they solve — primary embedding input |
| industry | VARCHAR | Single primary industry |
| stage | ENUM | idea / mvp / seed / series_a / series_b |
| country | VARCHAR | |
| team_size | INTEGER | |
| founded_year | INTEGER | |
| support_needed | VARCHAR[] | Array: fundraising, product, market access, tech |
| website | VARCHAR | Admin reference |
| embedding | VECTOR(768) | AI-generated from text fields |
| updated_at | TIMESTAMP | Triggers re-embedding on change |

**Embedding input text format:**
```
Role: Startup
Company: {company_name}
Industry: {industry}
Stage: {stage}
Description: {description}
Support needed: {support_needed joined}
```

### 9.4 Table: programmes
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR | e.g. "MaGIC Accelerator Cohort 7" |
| type | ENUM | accelerator / mentorship / grant / incubator |
| country | VARCHAR | Geography tag |
| status | ENUM | draft / active / completed |
| admin_id | UUID FK | Owning admin |
| start_date | DATE | |
| end_date | DATE | |
| rules | JSONB | e.g. {"max_startups_per_mentor": 3, "required_expertise": ["fintech"]} |
| success_metrics | JSONB | e.g. {"min_checkins": 8, "milestones_required": 2} |
| created_at | TIMESTAMP | |

### 9.5 Table: enrollments
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| programme_id | UUID FK | |
| user_id | UUID FK | |
| role_in_programme | ENUM | mentor / startup / partner |
| enrolled_at | TIMESTAMP | |

### 9.6 Table: links ⭐ (Core Table)
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| programme_id | UUID FK | |
| link_type | ENUM | mentor_startup / company_programme / partner_initiative |
| entity_a_id | UUID FK | First actor (typically mentor) |
| entity_b_id | UUID FK | Second actor (typically startup) |
| status | ENUM | proposed / active / at_risk / completed / failed |
| health_score | FLOAT | 0–100, recalculated on every activity event |
| embedding_score | FLOAT | 0–1, cosine similarity at time of match (frozen) |
| dna_score | FLOAT | 0–1, DNA compatibility score at time of match (frozen) |
| combined_score | FLOAT | (0.6 × embedding_score) + (0.4 × dna_score) |
| match_reasoning | TEXT | AI-generated 1–2 sentence explanation |
| created_by | UUID FK | Admin who approved this match |
| proposed_at | TIMESTAMP | Link creation time |
| activated_at | TIMESTAMP | When both parties accepted |
| completed_at | TIMESTAMP | When relationship ended |
| outcome | ENUM | null / successful / unsuccessful |
| outcome_notes | TEXT | Admin notes — fed into DNA extraction |
| updated_at | TIMESTAMP | Last activity — used for inactivity decay |

### 9.7 Table: check_ins
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| link_id | UUID FK | Parent link |
| logged_by | UUID FK | Mentor or startup who logged it |
| session_date | DATE | When session actually happened |
| duration_minutes | INTEGER | Session length |
| topics_discussed | TEXT | Agenda/topics |
| notes | TEXT | Free-text session notes |
| created_at | TIMESTAMP | When logged — used for recency calc |

### 9.8 Table: milestones
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| link_id | UUID FK | |
| title | VARCHAR | e.g. "Submit grant application" |
| description | TEXT | |
| due_date | DATE | Overdue check runs daily |
| status | ENUM | pending / completed / overdue |
| completed_at | TIMESTAMP | Null if not done |
| created_at | TIMESTAMP | |

### 9.9 Table: link_events
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| link_id | UUID FK | |
| from_status | VARCHAR | Previous state |
| to_status | VARCHAR | New state |
| triggered_by | ENUM | system / admin / user |
| reason | TEXT | e.g. "No check-in for 14 days" |
| created_at | TIMESTAMP | Exact transition time |

### 9.10 Table: dna_blueprints ⭐
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | |
| source_link_id | UUID FK | Completed link this was extracted from |
| programme_type | ENUM | Filtering tag |
| industry | VARCHAR | Filtering tag |
| geography | VARCHAR | Soft filter — cross-geography reuse allowed |
| mentor_snapshot | JSONB | Mentor profile key fields at time of match |
| startup_snapshot | JSONB | Startup profile key fields at time of match |
| relationship_stats | JSONB | Total check-ins, avg duration, milestones completed, relationship duration |
| outcome_metrics | JSONB | Funding raised, milestones hit, programme goals achieved |
| pattern_summary | TEXT | AI-generated paragraph — what made this work |
| embedding | VECTOR(768) | Embedding of pattern_summary — used for DNA matching |
| created_at | TIMESTAMP | |

---

## 10. AI/ML Design

### 10.1 Libraries
```
google-generativeai    # text-embedding-004 + gemini-1.5-flash
pgvector               # VECTOR type for SQLAlchemy
psycopg2-binary        # Postgres driver
sqlalchemy             # ORM
numpy                  # Score math
python-dotenv          # Env vars
```

### 10.2 Function: generate_embedding(text) → vector
**File:** `backend/app/ai/embeddings.py`

- Takes a formatted profile text string
- Calls `text-embedding-004` via `google-generativeai`
- Returns a list of 768 floats
- Called on: mentor profile create/update, startup profile create/update, DNA blueprint creation

```python
import google.generativeai as genai

genai.configure(api_key=GEMINI_API_KEY)

def generate_embedding(text: str) -> list[float]:
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="SEMANTIC_SIMILARITY"
    )
    return result["embedding"]
```

### 10.3 Function: generate_matches(startup_id, programme_id, db) → list[MatchSuggestion]
**File:** `backend/app/ai/matching.py`

**Step 1 — Signal A (embedding similarity):**
```sql
SELECT user_id, 1 - (embedding <=> :startup_embedding) AS similarity
FROM mentor_profiles
WHERE user_id IN (enrolled_mentor_ids)
ORDER BY similarity DESC
LIMIT 10;
```
Returns similarity score 0–1. (Note: pgvector cosine distance 0 = identical, so similarity = 1 - distance)

**Step 2 — Signal B (DNA scoring):**
- For each top candidate pair, create a pairing description string
- Embed the pairing description
- Run cosine similarity against all dna_blueprints embeddings
- Best blueprint similarity score = DNA score for that pair

**Step 3 — Combined score:**
```python
combined_score = (0.6 * embedding_score) + (0.4 * dna_score)
combined_score = float(np.clip(combined_score, 0, 1))
```

**Step 4 — Gemini reasoning:**
- For top 3 candidates, send mentor + startup profiles + best matching DNA blueprint to Gemini Flash
- Prompt: generate a 1–2 sentence match explanation, be specific about industry overlap and historical pattern
- Returns reasoning string stored in match suggestion

### 10.4 Function: calculate_health_score(checkins, milestones) → (score: float, status: str)
**File:** `backend/app/ai/health_score.py`

Pure Python logic — no Gemini call needed.

```
base_score = 100

Deductions:
- days since last check-in > 7  → -5 per extra day beyond 7
- days since last check-in > 14 → force status = at_risk
- each overdue milestone         → -15

Additions:
- check-in this week             → +5
- milestone completed            → +10
- session duration > 60 mins     → +3

Bounds: min 0, max 100

Status thresholds:
- score >= 70  → healthy (green)
- score 40–69  → warning (amber)
- score < 40   → at_risk (red)
```

Triggered as BackgroundTask on every check-in post and milestone put.

### 10.5 Function: extract_dna_blueprint(link_data) → BlueprintDict
**File:** `backend/app/ai/dna.py`

Triggered as BackgroundTask when link is marked completed with outcome = successful.

**Input:** link record + all check-ins + all milestones + outcome notes + actor profile snapshots

**Gemini Flash prompt (in prompts.py):**
```
The following mentor-startup relationship completed successfully.

Mentor profile: {mentor_metadata}
Startup profile: {startup_metadata}
Programme: {programme_type} | Country: {country}
Total check-ins: {count} | Avg session: {avg_duration} mins
Milestones completed: {completed}/{total}
Outcome notes: {outcome_notes}

Extract a structured pattern summary describing what characteristics
made this relationship successful. Include: mentor traits that mattered,
startup characteristics, engagement pattern, and outcome indicators.
Return only the summary paragraph, nothing else.
```

Returns `pattern_summary` → embed → store as dna_blueprints row.

### 10.6 All Prompts (centralised)
**File:** `backend/app/ai/prompts.py`

All Gemini prompt strings live here. Never scatter prompts across files. When a prompt needs tuning, this is the only file to change.

---

## 11. API Design

All endpoints require `Authorization: Bearer {firebase_token}` header except `/auth/verify`.
FastAPI middleware verifies token with `firebase-admin` on every request.

### Auth
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | /auth/verify | All | Verify token, create user if new, return role |
| GET | /auth/me | All | Return current user record |

### Profiles
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | /profiles/mentor | Mentor | Create profile → BG: generate embedding |
| GET | /profiles/mentor/{user_id} | Mentor, Admin | |
| PUT | /profiles/mentor | Mentor | Update → BG: re-embed |
| POST | /profiles/startup | Startup | Create → BG: generate embedding |
| GET | /profiles/startup/{user_id} | Startup, Admin | |
| PUT | /profiles/startup | Startup | Update → BG: re-embed |

### Programmes
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | /programmes | Admin | Create programme |
| GET | /programmes | All | Admin: all. Others: enrolled only |
| GET | /programmes/{id} | All | Programme detail + stats |
| PUT | /programmes/{id} | Admin | Cannot update if completed |
| POST | /programmes/{id}/enroll | Admin | Requires completed profile |
| GET | /programmes/{id}/actors | Admin | Grouped by role |

### Matching
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | /programmes/{id}/match | Admin | Run full AI matching pipeline |
| POST | /programmes/{id}/match/approve | Admin | Approve suggestion → create link |

### Links
| Method | Path | Access | Notes |
|---|---|---|---|
| GET | /links | All | Admin: all. Others: own links only |
| GET | /links/{id} | All | Full detail with actor profiles |
| PUT | /links/{id}/activate | All | Transition proposed → active |
| PUT | /links/{id}/complete | Admin | Set outcome → BG: DNA if successful |
| GET | /links/{id}/events | All | Full audit trail |

### Activity
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | /links/{id}/checkins | Mentor, Startup, Admin | BG: recalculate health |
| GET | /links/{id}/checkins | All | |
| POST | /links/{id}/milestones | Mentor, Startup, Admin | |
| GET | /links/{id}/milestones | All | |
| PUT | /milestones/{id} | Mentor, Startup, Admin | BG: recalculate health |

### DNA
| Method | Path | Access | Notes |
|---|---|---|---|
| GET | /dna | Admin | Supports ?industry= ?programme_type= ?geography= |
| GET | /dna/{id} | Admin | Full blueprint detail |

### Dashboard
| Method | Path | Access | Notes |
|---|---|---|---|
| GET | /dashboard/stats | Admin | Aggregated stats for overview screen |
| GET | /dashboard/links | Admin | Paginated links with health scores |

---

## 12. Frontend Screens

### 12.1 Build Order (Day 1 first)

**Day 1 — Shared components first, then auth screens:**
1. `HealthGauge.jsx` — circular 0–100 gauge, green/amber/red thresholds
2. `StatusBadge.jsx` — status pill with pulse animation for at_risk
3. `ActorCard.jsx` — profile card, two sizes (full + compact)
4. `MultiSelectChip.jsx` — tag input for expertise/industry fields
5. `Sidebar.jsx` — role-based navigation
6. `ScoreBar.jsx` — embedding vs DNA score comparison bar
7. `Login.jsx` — Google sign-in button only
8. `RoleSelection.jsx` — 4 role cards
9. `MentorSetup.jsx` — full profile form
10. `StartupSetup.jsx` — full profile form

**Day 1 afternoon — admin screens with mock data:**
11. `Dashboard.jsx` — stats + links table (mock data)
12. `MatchExplorer.jsx` — ⭐ ranked matches with reasoning (mock data, make it beautiful)

**Day 2 — wire to real API, build remaining screens:**
13. `LinkDetail.jsx` (admin) — health gauge + tabs
14. `ProgrammeDetail.jsx` — actors tab + links tab
15. `Programmes.jsx` — programme list
16. `ProgrammeSetup.jsx` — create form
17. `MentorHome.jsx` — active links cards
18. `LinkDetail.jsx` (mentor) — check-in form + milestones
19. `StartupHome.jsx` — active links cards
20. `LinkDetail.jsx` (startup) — same as mentor view
21. `DnaLibrary.jsx` — blueprint cards grid

### 12.2 Screen Specifications

#### Match Explorer (⭐ Most Important Screen)
**Layout:** Two-column. Left: startup profile card. Right: top 3 mentor suggestions ranked by combined_score.

**Per mentor card shows:**
- Name, title, company
- Combined score (large number, coloured)
- Embedding score + DNA score shown separately as two small bars
- AI reasoning in a highlighted quote block
- "Approve" button

**Controls:**
- Progress indicator: "Startup 2 of 5"
- "Next" and "Previous" navigation
- Override option: search for a mentor not in top 3

#### Admin Dashboard
- 4 stat cards: Active Links, At-Risk, Programmes, DNA Blueprints
- Links table: actor names, programme, health score bar, status badge, last activity date
- At-risk rows highlighted in red/amber
- Clicking a row → Link Detail

#### Link Detail
- Top: both actor cards side by side, health score gauge (large), status badge, combined match score
- 3 tabs: Activity | Milestones | History
- Activity tab: check-in log form (session date, duration, topics, notes) + list of past check-ins
- Milestones tab: milestone list with status toggles + add milestone form
- History tab: link_events audit trail as a vertical timeline
- Admin actions: "Mark at risk" | "Complete relationship" buttons

#### DNA Library
- Filter bar: industry, programme_type, geography dropdowns
- Blueprint cards grid: industry tag, programme type, geography, pattern_summary snippet, key stats (check-ins, duration)
- This is the "wow" screen — shows the system has learned from past cohorts

### 12.3 Services Layer (Frontend)
All API calls go through `src/services/api.js` which injects the Firebase token into every request header automatically. Each domain has its own service file:

```
api.js              — axios instance + auth header injection
auth.service.js     — /auth/* calls
profiles.service.js — /profiles/* calls
programmes.service.js
links.service.js
matching.service.js — /programmes/{id}/match calls
activity.service.js — /checkins and /milestones calls
dna.service.js      — /dna/* calls
```

---

## 13. Seed Data Plan

### Why seed data is needed
The DNA library needs past successful relationships to demonstrate the learning system. The matching engine needs actors with real embeddings to show meaningful scores. Without seed data, the demo is an empty shell.

### Layer 1 — Actor Pool (10 actors)

**5 Mentors:**
1. Ahmad Razif — Fintech, 14 yrs, VP at Maybank, expertise: fundraising, investor relations, financial modelling
2. Priya Nair — SaaS/B2B, 10 yrs, Head of Product at Grab, expertise: product strategy, go-to-market, growth
3. James Tan — Deeptech, 12 yrs, CTO at hardware startup, expertise: R&D, technical architecture, IP strategy
4. Nurul Huda — Healthtech, 8 yrs, ex-KKM consultant, expertise: regulatory, clinical partnerships, healthcare ops
5. David Lim — E-commerce, 11 yrs, 2x founder, expertise: fundraising, scaling, marketplace dynamics

**5 Startups:**
1. PayNow Pro — Fintech, seed, embedded payments for SMEs, needs: fundraising, investor introductions
2. CareLoop — Healthtech, MVP, remote patient monitoring, needs: regulatory guidance, clinical partnerships
3. MeshCloud — SaaS, seed, B2B infrastructure tooling, needs: product-market fit, enterprise sales
4. GreenHarvest — Agritech, idea, IoT crop monitoring, needs: technical architecture, grant applications
5. ShopSwift — E-commerce, series A, social commerce, needs: scaling, marketplace growth

### Layer 2 — Past Programme (DNA Source)
**Programme:** "MaGIC Accelerator 2024 — Cohort 6, Malaysia" (status: completed)

**4 completed links:**

| Mentor | Startup | Check-ins | Milestones | Outcome | Notes |
|---|---|---|---|---|---|
| Ahmad Razif | FundBridge (fintech) | 12, avg 75 min | 3/3 | ✅ Successful | Raised RM600k pre-seed. Investor network was key. |
| Priya Nair | DeskOps (SaaS) | 9, avg 60 min | 2/2 | ✅ Successful | Signed 3 enterprise clients. GTM framework applied. |
| Nurul Huda | MediTrack (healthtech) | 11, avg 90 min | 3/3 | ✅ Successful | MOH pilot approval. Regulatory expertise critical. |
| James Tan | CartDrop (e-commerce) | 3, avg 30 min | 0/2 | ❌ Failed | Expertise misaligned. Tech focus didn't address GTM. |

→ 3 successful links generate 3 DNA blueprints with real embeddings.
→ 1 failed link is logged but does not become a blueprint.

### Layer 3 — Live Programme (Demo Stage)
**Programme:** "Cradle CIP Accelerator 2026 — Cohort 1, Malaysia" (status: active)
- All 5 mentors enrolled
- All 5 startups enrolled
- No links yet — admin generates matches live during demo

### Seed Script Notes
- Written by the **data person** in `data/seed/`
- Must generate **real embeddings** via Gemini API — not fake vectors
- Must be **idempotent** — `INSERT ... ON CONFLICT DO NOTHING`
- `dna_generator.py` imports `extract_dna_blueprint()` from `backend/app/ai/dna.py`
- Run order: `run_migrations.py` → `seed.py`

---

## 14. File Structure

```
project-root/
├── .env.example                    # shared template — all team members fill their own .env
├── docker-compose.yml              # local dev setup
├── README.md
│
├── frontend/                       # ← FRONTEND PERSON
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile                  # nginx container for Cloud Run
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # router setup, protected routes
│       ├── firebase.js             # Firebase init + auth config
│       ├── components/             # BUILD THESE FIRST
│       │   ├── HealthGauge.jsx
│       │   ├── StatusBadge.jsx
│       │   ├── ActorCard.jsx
│       │   ├── MultiSelectChip.jsx
│       │   ├── Sidebar.jsx
│       │   └── ScoreBar.jsx
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   └── RoleSelection.jsx
│       │   ├── onboarding/
│       │   │   ├── MentorSetup.jsx
│       │   │   └── StartupSetup.jsx
│       │   ├── admin/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── MatchExplorer.jsx   # ⭐ most important screen
│       │   │   ├── LinkDetail.jsx
│       │   │   ├── Programmes.jsx
│       │   │   ├── ProgrammeDetail.jsx
│       │   │   ├── ProgrammeSetup.jsx
│       │   │   ├── DnaLibrary.jsx
│       │   │   └── Actors.jsx
│       │   ├── mentor/
│       │   │   ├── MentorHome.jsx
│       │   │   ├── LinkDetail.jsx
│       │   │   └── Profile.jsx
│       │   └── startup/
│       │       ├── StartupHome.jsx
│       │       ├── LinkDetail.jsx
│       │       └── Profile.jsx
│       ├── services/               # all API calls live here
│       │   ├── api.js              # axios base + auth header injected automatically
│       │   ├── auth.service.js
│       │   ├── profiles.service.js
│       │   ├── programmes.service.js
│       │   ├── links.service.js
│       │   ├── matching.service.js
│       │   ├── activity.service.js
│       │   └── dna.service.js
│       ├── context/
│       │   └── AuthContext.jsx     # user state, role, token across app
│       └── hooks/
│           ├── useAuth.js
│           └── useApi.js           # loading/error state wrapper
│
├── backend/                        # ← BACKEND PERSON
│   ├── requirements.txt
│   ├── Dockerfile                  # FastAPI container for Cloud Run
│   ├── .env                        # DB url, Gemini key, Firebase creds path
│   ├── firebase_credentials.json   # Admin SDK key — NEVER commit this
│   └── app/
│       ├── main.py                 # FastAPI init, CORS, register all routers
│       ├── config.py               # Load all env vars with pydantic-settings
│       ├── database.py             # SQLAlchemy engine + session factory
│       ├── dependencies.py         # verify_token(), require_admin(), get_current_user()
│       ├── models/                 # SQLAlchemy ORM — BUILD FIRST
│       │   ├── user.py
│       │   ├── mentor_profile.py
│       │   ├── startup_profile.py
│       │   ├── programme.py
│       │   ├── enrollment.py
│       │   ├── link.py             # ⭐ core model
│       │   ├── checkin.py
│       │   ├── milestone.py
│       │   ├── link_event.py
│       │   └── dna_blueprint.py
│       ├── schemas/                # Pydantic request/response shapes
│       │   ├── user.py
│       │   ├── mentor_profile.py
│       │   ├── startup_profile.py
│       │   ├── programme.py
│       │   ├── link.py
│       │   ├── matching.py         # match suggestion response shape
│       │   ├── checkin.py
│       │   ├── milestone.py
│       │   └── dna_blueprint.py
│       ├── routes/                 # API endpoints
│       │   ├── auth.py
│       │   ├── profiles.py
│       │   ├── programmes.py
│       │   ├── matching.py         # imports from app/ai/
│       │   ├── links.py
│       │   ├── activity.py
│       │   ├── dna.py
│       │   └── dashboard.py
│       ├── services/               # business logic
│       │   ├── auth_service.py     # Firebase token verify + user create/fetch
│       │   ├── link_service.py     # state machine transitions + link_events writes
│       │   └── health_service.py   # calls calculate_health_score(), updates link
│       └── ai/                     # ← AI/ML PERSON owns this entire folder
│           ├── __init__.py         # exports all 4 public functions
│           ├── embeddings.py       # generate_embedding(text) → vector
│           ├── matching.py         # generate_matches(startup_id, mentor_ids, db)
│           ├── health_score.py     # calculate_health_score(checkins, milestones)
│           ├── dna.py              # extract_dna_blueprint(link_data) → blueprint
│           └── prompts.py          # ALL Gemini prompt strings centralised here
│
└── data/                           # ← DATA PERSON owns this entire folder
    ├── migrations/                 # RUN THESE FIRST
    │   ├── 001_enable_pgvector.sql # must be first — enables vector extension
    │   ├── 002_create_users.sql
    │   ├── 003_create_mentor_profiles.sql
    │   ├── 004_create_startup_profiles.sql
    │   ├── 005_create_programmes.sql
    │   ├── 006_create_enrollments.sql
    │   ├── 007_create_links.sql
    │   ├── 008_create_checkins.sql
    │   ├── 009_create_milestones.sql
    │   ├── 010_create_link_events.sql
    │   ├── 011_create_dna_blueprints.sql
    │   └── run_migrations.py       # runs all .sql files in numbered order
    └── seed/                       # RUN AFTER MIGRATIONS
        ├── seed.py                 # main entry point: python seed.py
        ├── actors.py               # 5 mentors + 5 startups with full profile data
        ├── programmes.py           # past completed programme + live active programme
        ├── past_links.py           # 3 successful + 1 failed completed links
        └── dna_generator.py        # calls extract_dna_blueprint() on 3 successful links
```

---

## 15. Work Distribution

### Data Person
**Owns:** `data/migrations/`, `data/seed/`
**Depends on:** AI/ML person's `dna.py` for `dna_generator.py`

**Day 1 morning (blocks everyone — do this first):**
- Spin up Cloud SQL instance on Google Cloud, enable pgvector
- Write and run all 11 migration scripts in order
- Share DB credentials with the team via `.env`
- Verify all tables exist and pgvector column type works

**Day 1 afternoon:**
- Write seed script — actors, profiles, past programme, links, check-ins, milestones
- Generate real embeddings via Gemini API for all actor profiles
- Run seed (except DNA generation — wait for AI/ML person's dna.py)

**Day 2:**
- Run `dna_generator.py` once AI/ML dna.py is ready
- Support backend with query optimisation if needed
- Rerun seed if DB is wiped during testing

---

### Backend Person
**Owns:** `backend/app/` except `backend/app/ai/`
**Depends on:** Data person (DB ready), AI/ML person (functions to import)

**Day 1 morning (start before DB is ready):**
- Set up FastAPI project structure
- Set up `firebase-admin` SDK verification
- Write `dependencies.py` — `verify_token()`, `require_admin()`, `get_current_user()`
- Write all SQLAlchemy models matching the schema

**Day 1 afternoon (once DB is ready):**
- Write auth routes, profile routes, programme routes, link routes

**Day 2 morning:**
- Write activity routes (check-ins, milestones)
- Write health_service.py — wire `calculate_health_score()` as BackgroundTask
- Write dashboard routes
- Write DNA list/detail routes
- Test all endpoints at `/docs`

**Day 2 afternoon:**
- Wire matching route — imports from `app/ai/` once AI/ML functions are ready
- Deploy to Cloud Run
- Share live API URL with frontend person

---

### AI/ML Person
**Owns:** `backend/app/ai/` — 5 files, 4 public functions
**No dependency on others to start**

**Day 1 morning (start immediately):**
- Install all 6 libraries: `google-generativeai pgvector psycopg2-binary sqlalchemy numpy python-dotenv`
- Write and test `embeddings.py` — call text-embedding-004, verify vector is 768 floats
- Test with a sample mentor profile text string

**Day 1 afternoon:**
- Write `health_score.py` — pure Python, no Gemini. Test with hardcoded data
- Hand `calculate_health_score()` to backend person — first handoff

**Day 2 morning (once DB has seed data):**
- Write `matching.py` — cosine similarity query + DNA scoring + combined score
- Test against real seed data in the database

**Day 2 afternoon:**
- Write Gemini reasoning generation inside `matching.py`
- Write `dna.py` — Gemini Flash extraction + embedding of pattern_summary
- Write all prompts in `prompts.py`
- Hand all functions to backend person for the matching endpoint — final handoff

---

### Frontend Person
**Owns:** `frontend/src/`
**Can start Day 1 with mock data — real API wired on Day 2**

**Day 1 morning:**
- Set up React + Vite, install Firebase Auth, configure Google Sign-In
- Set up React Router with all routes defined (even if screens are blank)
- Build all 6 shared components: HealthGauge, StatusBadge, ActorCard, MultiSelectChip, Sidebar, ScoreBar
- Build Login and RoleSelection screens

**Day 1 afternoon:**
- Build MentorSetup and StartupSetup forms
- Build Dashboard with hardcoded mock data
- Build MatchExplorer with mock match results — make this look great

**Day 2 morning (once backend API URL is available):**
- Set up `api.js` — axios with Firebase token auto-injected
- Replace all mock data with real API calls
- Build LinkDetail, ProgrammeDetail, Programmes screens

**Day 2 afternoon:**
- Build mentor and startup home screens and link detail views
- Build DNA Library screen
- Polish MatchExplorer — it must look impressive
- Deploy to Cloud Run
- Full end-to-end demo flow test

---

### Critical Handoff Points

| Handoff | From | To | When | What |
|---|---|---|---|---|
| 1 | Data | Backend | Day 1, late morning | DB live + credentials shared |
| 2 | AI/ML | Backend | Day 1, end of day | `calculate_health_score()` ready |
| 3 | Data | AI/ML | Day 2, morning | Seed data in DB — ready for pgvector testing |
| 4 | Backend | Frontend | Day 2, morning | Live API URL shared |
| 5 | AI/ML | Backend | Day 2, early afternoon | All 4 AI functions ready for matching endpoint |

---

*PRD compiled from full team discussion. All sections locked. Build the MVP first — all Phase 2 and Phase 3 features are captured for post-hackathon development.*
