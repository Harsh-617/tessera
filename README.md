<div align="center">

# Tessera

### AI-Powered Ecosystem Relationship Engine

*Built for Build With AI 2026 KL — MyHack · 16–17 May 2026*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=flat-square&logo=postgresql)](https://postgresql.org)
[![pgvector](https://img.shields.io/badge/pgvector-enabled-green?style=flat-square)](https://github.com/pgvector/pgvector)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://docker.com)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Core Concepts](#core-concepts)
- [System Architecture](#system-architecture)
- [AI / ML Design](#ai--ml-design)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roles & Access Control](#roles--access-control)
- [Key Screens](#key-screens)
- [Roadmap](#roadmap)

---

## Overview

**Tessera** is a SaaS platform that turns ecosystem relationships — between mentors, startups, partners, and programmes — into first-class, programmable entities. Instead of managing connections via spreadsheets and one-off assignments, every linkage in Tessera has its own lifecycle state, health score, audit trail, and AI-driven intelligence.

The platform is built around two compounding systems:

| System | Purpose |
|---|---|
| **EcoGraph OS** | Every relationship is a structured `Link` entity with a lifecycle state machine, health score, rules, and behavioral triggers |
| **Relationship DNA** | An AI learning engine that extracts success patterns from completed relationships and uses them to improve future matching |

Together they form a **self-improving ecosystem intelligence platform** — every completed programme makes the next cohort's matching smarter.

---

## Problem Statement

Regional innovation ecosystems rely on manual coordination to create and manage relationships between companies, mentors, partners, and programme administrators. Critical linkages — mentor-to-company, company-to-programme, partner-to-initiative — are treated as one-off assignments rather than structured, reusable system entities.

**Core pain points:**
- No mechanism to determine how relationships should form or evolve over time
- Past engagement data cannot be used to improve future matching
- Operational bottlenecks at scale — works for 10 companies, breaks at 100
- No consistency across programmes or geographies
- Manual coordination blocks ecosystem growth and learning

---

## Solution

Tessera automates ecosystem relationship management with two AI signals driving every match:

- **Signal A — Embedding Similarity:** Real-time semantic similarity between mentor and startup profiles via pgvector cosine distance
- **Signal B — DNA Score:** Historical success pattern matching against the DNA blueprint library
- **Combined Score:** `(0.6 × Signal A) + (0.4 × Signal B)`

The human-in-the-loop design means AI suggests, admins approve — responsible AI by default.

---

## Core Concepts

### EcoGraph OS — Links as Living Entities

Every connection is stored as a `Link` entity — not just a foreign key, but a structured object with:

- A **type** (`mentor_startup`, `company_programme`, `partner_initiative`)
- A **lifecycle state** managed by a state machine
- A **health score** (0–100) recalculated on every activity event
- **Match scores** frozen at creation time (`embedding_score`, `dna_score`, `combined_score`)
- **Full audit history** via the `link_events` table

```
Link Lifecycle State Machine

  ┌───────────┐     Admin/User      ┌──────────┐
  │ proposed  │ ──────────────────► │  active  │
  └───────────┘                     └──────────┘
                                         │
                    14 days no check-in  │   Admin marks complete
                         ▼               │         ▼
                   ┌──────────┐          │   ┌───────────┐
                   │ at_risk  │          │   │ completed │ ──► DNA extraction
                   └──────────┘          │   └───────────┘
                         │               │
                         └───────────────┘
                                         │
                                         ▼
                                    ┌────────┐
                                    │ failed │
                                    └────────┘
```

### Relationship DNA — The Learning Engine

When a link completes successfully, a background job automatically:

1. Collects all link data — actor profiles, check-ins, milestones, outcome notes
2. Sends to Gemini Flash to extract a `pattern_summary` (what made this relationship work)
3. Embeds the summary using `text-embedding-004`
4. Stores a reusable **DNA Blueprint** tagged by industry, programme type, and geography

Future matching queries these blueprints as Signal B. Every cohort adds more blueprints — the system compounds over time.

### The Feedback Loop

```
New Match Request
      │
      ▼
Signal A: pgvector cosine similarity (mentor ↔ startup embeddings)
Signal B: DNA blueprint cosine similarity (pairing description ↔ blueprints)
Combined Score = (0.6 × A) + (0.4 × B)
      │
      ▼
Gemini Flash generates 1–2 sentence match reasoning
      │
      ▼
Admin reviews → approves → Link entity created (status: proposed)
      │
      ▼
Both parties activate → engagement tracked → health score updated
      │
      ▼
Successful completion → DNA extraction triggered (background task)
      │
      ▼
New blueprint added → next cohort benefits
      │
      └──────────── (compounds with every cohort) ───────────►
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │          React + Vite  (Port 3000)                    │     │
│   │  ┌──────────┐ ┌─────────────┐ ┌──────────────────┐   │     │
│   │  │  Auth    │ │  Admin UI   │ │ Mentor/Startup UI │   │     │
│   │  │  Pages   │ │  Dashboard  │ │  Home + LinkDetail│   │     │
│   │  └──────────┘ └─────────────┘ └──────────────────┘   │     │
│   │  ┌───────────────────────────────────────────────┐    │     │
│   │  │         services/api.js (Axios)               │    │     │
│   │  │  Auto-injects Firebase Bearer token           │    │     │
│   │  └───────────────────────────────────────────────┘    │     │
│   └───────────────────────────────────────────────────────┘     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP / REST
┌───────────────────────────▼─────────────────────────────────────┐
│                       AUTH LAYER                                │
│                                                                 │
│   ┌───────────────────────────────┐                             │
│   │    Firebase Authentication    │                             │
│   │    Google Sign-In Provider    │                             │
│   │    Issues JWT Bearer tokens   │                             │
│   └──────────────┬────────────────┘                             │
│                  │ firebase-admin SDK verifies token            │
└──────────────────┼──────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│                      BACKEND LAYER                              │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              FastAPI  (Port 8000)                       │   │
│   │                                                         │   │
│   │  Routes: /auth  /profiles  /programmes  /links          │   │
│   │          /matching  /activity  /dna  /dashboard         │   │
│   │                                                         │   │
│   │  ┌────────────────┐   ┌──────────────────────────────┐  │   │
│   │  │   Services     │   │       AI / ML Layer          │  │   │
│   │  │ auth_service   │   │  embeddings.py  → Gemini API │  │   │
│   │  │ link_service   │   │  matching.py   → pgvector    │  │   │
│   │  │ health_service │   │  health_score.py → pure Python│  │   │
│   │  └────────────────┘   │  dna.py        → Gemini API  │  │   │
│   │                       │  prompts.py    → centralized  │  │   │
│   │  BackgroundTasks:     └──────────────────────────────┘  │   │
│   │  - generate_embedding on profile save                   │   │
│   │  - calculate_health_score on check-in/milestone         │   │
│   │  - extract_dna_blueprint on successful completion       │   │
│   └─────────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┬───────────────────┘
                   │                          │
      ┌────────────▼────────┐    ┌────────────▼─────────────┐
      │  PostgreSQL + pgvec │    │      Gemini AI API        │
      │  Cloud SQL (Prod)   │    │                           │
      │  Docker (Local)     │    │  text-embedding-004       │
      │                     │    │  (768-dim vectors)        │
      │  Tables:            │    │                           │
      │  users              │    │  gemini-2.5-flash         │
      │  mentor_profiles    │    │  (reasoning + DNA         │
      │  startup_profiles   │    │   extraction)             │
      │  programmes         │    └───────────────────────────┘
      │  enrollments        │
      │  links  ⭐          │
      │  check_ins          │
      │  milestones         │
      │  link_events        │
      │  dna_blueprints ⭐  │
      └─────────────────────┘
```

### Deployment Architecture

```
                    ┌─────────────────────────────┐
                    │       Google Cloud           │
                    │                             │
  Users  ──HTTPS──► │  Cloud Run (Frontend)       │
                    │  nginx serving React build  │
                    │           │                 │
                    │           │ HTTP            │
                    │           ▼                 │
                    │  Cloud Run (Backend)         │
                    │  FastAPI container          │
                    │           │                 │
                    │    ┌──────┴──────┐          │
                    │    │            │           │
                    │  Cloud SQL   Gemini API     │
                    │  PostgreSQL  (external)     │
                    │  + pgvector                 │
                    └─────────────────────────────┘
```

---

## AI / ML Design

### Embedding Pipeline

Every actor profile and DNA blueprint is embedded using Gemini `text-embedding-004`, producing 768-dimensional vectors stored in PostgreSQL via pgvector.

**Mentor profile → embedding text:**
```
Role: Mentor
Industry: {industry joined}
Expertise: {expertise_areas joined}
Experience: {years_experience} years
Title: {job_title} at {current_company}
Bio: {bio}
Mentoring style: {mentoring_style}
```

**Startup profile → embedding text:**
```
Role: Startup
Company: {company_name}
Industry: {industry}
Stage: {stage}
Description: {description}
Support needed: {support_needed joined}
```

### Matching Pipeline

```
Admin triggers match for Startup X in Programme Y
        │
        ▼
Step 1 ─ Signal A (Embedding Similarity)
  pgvector cosine query across enrolled mentor_profiles
  1 - (embedding <=> startup_embedding) → similarity score 0–1
  Top 10 candidates returned
        │
        ▼
Step 2 ─ Signal B (DNA Blueprint Scoring)
  For each candidate: generate pairing description string
  Embed the pairing description
  Cosine similarity against all dna_blueprints
  Best match score = DNA score for this pair
        │
        ▼
Step 3 ─ Combined Score
  combined_score = clip(0.6 × A + 0.4 × B, 0, 1)
        │
        ▼
Step 4 ─ Gemini Reasoning (Top 3 only)
  Prompt includes mentor profile + startup profile + best DNA pattern
  Returns 1–2 sentence match explanation
        │
        ▼
Match suggestions returned to frontend
Admin reviews → approves preferred match
```

### Health Score Algorithm

```
base_score = 100

Deductions:
  days since last check-in > 7   →  -5 per extra day beyond 7
  days since last check-in > 14  →  force status = at_risk
  each overdue milestone         →  -15

Bonuses:
  check-in this week             →  +5
  milestone completed            →  +10
  session duration > 60 min      →  +3

Bounds: clamp(score, 0, 100)

Status thresholds:
  score ≥ 70  →  healthy  (green)
  40 ≤ score < 70  →  warning  (amber)
  score < 40  →  at_risk  (red)
```

Recalculated as a `BackgroundTask` on every `POST /links/{id}/checkins` and `PUT /milestones/{id}`.

### DNA Extraction

Triggered as a `BackgroundTask` when a link is completed with `outcome = successful`.

```
Successful Link Completion
        │
        ▼
Collect: link record + actor profiles + all check-ins
         + all milestones + outcome_notes
        │
        ▼
Gemini Flash prompt:
  "Extract a structured pattern summary describing what
   characteristics made this relationship successful.
   Include: mentor traits, startup characteristics,
   engagement pattern, and outcome indicators."
        │
        ▼
pattern_summary text → embed via text-embedding-004
        │
        ▼
dna_blueprints row saved:
  - embedding (vector) for future similarity search
  - tags: industry, programme_type, geography
  - mentor_snapshot + startup_snapshot (JSONB)
  - relationship_stats + outcome_metrics (JSONB)
```

All Gemini prompt strings are centralised in `backend/app/ai/prompts.py` — the single file to edit for prompt tuning.

---

## Data Model

### Entity Relationship Diagram

```
users
  ├── id (UUID PK)
  ├── firebase_uid (unique)
  ├── email
  ├── full_name
  ├── role (admin | mentor | startup | partner)
  └── is_active

mentor_profiles                      startup_profiles
  ├── id (UUID PK)                     ├── id (UUID PK)
  ├── user_id (FK → users)             ├── user_id (FK → users)
  ├── bio, industry[], expertise[]     ├── company_name, description
  ├── years_experience                 ├── industry, stage
  ├── job_title, current_company       ├── support_needed[]
  ├── country, availability_hours      ├── country, team_size
  ├── mentoring_style                  ├── founded_year
  └── embedding (VECTOR)               └── embedding (VECTOR)

programmes
  ├── id, name, type, country
  ├── status (draft | active | completed)
  ├── admin_id (FK → users)
  ├── start_date, end_date
  ├── rules (JSONB)
  └── success_metrics (JSONB)

enrollments
  ├── id, programme_id (FK), user_id (FK)
  └── role_in_programme (mentor | startup | partner)

links  ⭐ Core Table
  ├── id, programme_id (FK)
  ├── link_type (mentor_startup | ...)
  ├── entity_a_id, entity_b_id (FK → users)
  ├── status (proposed | active | at_risk | completed | failed)
  ├── health_score (0–100)
  ├── embedding_score, dna_score, combined_score
  ├── match_reasoning (TEXT)
  ├── proposed_at, activated_at, completed_at
  ├── outcome (successful | unsuccessful)
  └── outcome_notes

check_ins                            milestones
  ├── id, link_id (FK)                ├── id, link_id (FK)
  ├── logged_by (FK → users)          ├── title, description
  ├── session_date, duration_minutes  ├── due_date
  ├── topics_discussed, notes         ├── status (pending | completed | overdue)
  └── created_at                      └── completed_at

link_events                          dna_blueprints  ⭐
  ├── id, link_id (FK)                ├── id, source_link_id (FK)
  ├── from_status → to_status         ├── programme_type, industry, geography
  ├── triggered_by (system|admin|user)├── mentor_snapshot (JSONB)
  ├── reason                          ├── startup_snapshot (JSONB)
  └── created_at                      ├── relationship_stats (JSONB)
                                      ├── outcome_metrics (JSONB)
                                      ├── pattern_summary (TEXT)
                                      └── embedding (VECTOR)
```

---

## API Reference

All endpoints require `Authorization: Bearer {firebase_token}` except `/auth/verify`.

### Authentication

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/auth/verify` | Public | Verify Firebase token, create user if new, return role |
| `GET` | `/auth/me` | All | Return current authenticated user |

### Profiles

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/profiles/mentor` | Mentor | Create mentor profile → BG: generate embedding |
| `GET` | `/profiles/mentor/{user_id}` | Mentor, Admin | Get mentor profile |
| `PUT` | `/profiles/mentor` | Mentor | Update profile → BG: re-embed |
| `POST` | `/profiles/startup` | Startup | Create startup profile → BG: generate embedding |
| `GET` | `/profiles/startup/{user_id}` | Startup, Admin | Get startup profile |
| `PUT` | `/profiles/startup` | Startup | Update profile → BG: re-embed |

### Programmes

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/programmes` | Admin | Create programme |
| `GET` | `/programmes` | All | Admin: all; Others: enrolled only |
| `GET` | `/programmes/{id}` | All | Programme detail + stats |
| `PUT` | `/programmes/{id}` | Admin | Update (blocked if completed) |
| `POST` | `/programmes/{id}/enroll` | Admin | Enroll actor (requires complete profile) |
| `GET` | `/programmes/{id}/actors` | Admin | Enrolled actors grouped by role |

### Matching

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/programmes/{id}/match` | Admin | Run AI matching pipeline for all startups |
| `POST` | `/programmes/{id}/match/approve` | Admin | Approve suggestion → create Link entity |

### Links

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/links` | All | Admin: all links; Others: own links only |
| `GET` | `/links/{id}` | All | Full link detail with actor profiles |
| `PUT` | `/links/{id}/activate` | All | Transition `proposed` → `active` |
| `PUT` | `/links/{id}/complete` | Admin | Set outcome → BG: DNA extraction if successful |
| `GET` | `/links/{id}/events` | All | Full audit trail |

### Activity

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/links/{id}/checkins` | Mentor, Startup, Admin | Log check-in → BG: recalculate health |
| `GET` | `/links/{id}/checkins` | All | Get all check-ins for a link |
| `POST` | `/links/{id}/milestones` | Mentor, Startup, Admin | Create milestone |
| `GET` | `/links/{id}/milestones` | All | Get all milestones for a link |
| `PUT` | `/milestones/{id}` | Mentor, Startup, Admin | Update milestone → BG: recalculate health |

### DNA Library

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/dna` | Admin | List blueprints; supports `?industry=` `?programme_type=` `?geography=` |
| `GET` | `/dna/{id}` | Admin | Full blueprint detail |

### Dashboard

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard/stats` | Admin | Aggregated stats: active links, at-risk count, programmes, DNA blueprints |
| `GET` | `/dashboard/links` | Admin | Paginated links table with health scores |

Interactive API docs available at `http://localhost:8000/docs` when running locally.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite | UI framework, HMR dev server |
| Routing | React Router v6 | Client-side routing with protected routes |
| Auth (client) | Firebase Authentication | Google Sign-In, JWT token issuance |
| Auth (server) | firebase-admin SDK | Token verification in FastAPI |
| HTTP client | Axios | API calls with auto-injected Bearer token |
| Backend | FastAPI (Python 3.11) | REST API, business logic, state machine |
| Async jobs | FastAPI BackgroundTasks | Embedding generation, DNA extraction, health scoring |
| ORM | SQLAlchemy | Database models and sessions |
| Database | PostgreSQL 16 + pgvector | Structured data + vector similarity search |
| AI embeddings | Gemini `text-embedding-004` | Profile and DNA blueprint embeddings (768-dim) |
| Vector search | pgvector cosine similarity | Finding closest mentor embeddings to a startup |
| LLM | Gemini `gemini-2.5-flash` | Match reasoning, DNA extraction |
| AI SDK | `google-genai` (Python) | Unified Gemini API client |
| Containerisation | Docker + Docker Compose | Local dev database |
| Production | Google Cloud Run | Serverless container deployment |
| Database (prod) | Google Cloud SQL | Managed PostgreSQL with pgvector |

### Python Dependencies

```
fastapi
uvicorn
sqlalchemy
psycopg2-binary
pgvector
google-genai
firebase-admin
pydantic-settings
python-dotenv
numpy
```

---

## Project Structure

```
tessera/
├── docker-compose.yml          # pgvector/pgvector:pg16 for local dev
├── README.md
│
├── frontend/
│   ├── Dockerfile              # nginx container → Cloud Run
│   ├── vite.config.js          # proxies /api → localhost:8000
│   └── src/
│       ├── App.jsx             # router + protected route guards
│       ├── firebase.js         # Firebase SDK init
│       ├── context/
│       │   └── AuthContext.jsx # user state, role, token across app
│       ├── components/         # shared UI components
│       │   ├── HealthGauge.jsx # circular 0–100 gauge (green/amber/red)
│       │   ├── StatusBadge.jsx # status pill with pulse on at_risk
│       │   ├── ActorCard.jsx   # profile card (full + compact sizes)
│       │   ├── ScoreBar.jsx    # embedding vs DNA score comparison bar
│       │   ├── MultiSelectChip.jsx
│       │   ├── Sidebar.jsx     # role-based navigation
│       │   └── Reveal.jsx
│       ├── pages/
│       │   ├── auth/           # Login, RoleSelection
│       │   ├── onboarding/     # MentorSetup, StartupSetup
│       │   ├── admin/          # Dashboard, MatchExplorer ⭐, LinkDetail,
│       │   │                   # Programmes, ProgrammeDetail, ProgrammeSetup,
│       │   │                   # DnaLibrary, Actors, CheckIn
│       │   ├── mentor/         # MentorHome, LinkDetail, Profile
│       │   ├── startup/        # StartupHome, LinkDetail, Profile
│       │   └── partner/        # PartnerHome
│       └── services/           # all API calls go through here
│           ├── api.js          # axios instance + auth header injection
│           ├── auth.service.js
│           ├── profiles.service.js
│           ├── programmes.service.js
│           ├── links.service.js
│           ├── matching.service.js
│           ├── activity.service.js
│           └── dna.service.js
│
├── backend/
│   ├── Dockerfile              # FastAPI container → Cloud Run
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py             # FastAPI init, CORS, router registration
│       ├── config.py           # pydantic-settings env var loading
│       ├── database.py         # SQLAlchemy engine + session factory
│       ├── dependencies.py     # verify_token(), require_admin(), get_current_user()
│       ├── models/             # SQLAlchemy ORM models
│       │   ├── user.py
│       │   ├── mentor_profile.py
│       │   ├── startup_profile.py
│       │   ├── programme.py
│       │   ├── enrollment.py
│       │   ├── link.py         # ⭐ core entity with state machine enums
│       │   ├── checkin.py
│       │   ├── milestone.py
│       │   ├── link_event.py
│       │   └── dna_blueprint.py
│       ├── schemas/            # Pydantic request/response shapes
│       ├── routes/             # API endpoint handlers
│       │   ├── auth.py
│       │   ├── profiles.py
│       │   ├── programmes.py
│       │   ├── matching.py     # imports from app/ai/
│       │   ├── links.py
│       │   ├── activity.py
│       │   ├── dna.py
│       │   └── dashboard.py
│       ├── services/           # business logic
│       │   ├── auth_service.py # Firebase token verification + user upsert
│       │   ├── link_service.py # state machine transitions + link_events writes
│       │   └── health_service.py # calls calculate_health_score(), updates link
│       └── ai/                 # AI/ML layer
│           ├── __init__.py     # exports 4 public functions
│           ├── embeddings.py   # generate_embedding(text) → vector
│           ├── matching.py     # generate_matches(startup_id, programme_id, db)
│           ├── health_score.py # calculate_health_score(checkins, milestones)
│           ├── dna.py          # extract_dna_blueprint(link_data) → blueprint
│           └── prompts.py      # ALL Gemini prompt strings — single source of truth
│
└── data/
    ├── migrations/             # SQL migration scripts (run in numbered order)
    │   ├── 001_enable_pgvector.sql
    │   ├── 002_create_users.sql
    │   └── ... (011 total)
    └── seed/                   # demo seed data with real embeddings
        ├── seed.py             # main entry: python seed.py
        ├── actors.py           # 5 mentors + 5 startups
        ├── programmes.py       # past completed + live active programme
        ├── past_links.py       # 3 successful + 1 failed completed links
        └── dna_generator.py    # calls extract_dna_blueprint() on successful links
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Python | 3.11+ |
| Node.js | 18+ |
| Docker + Docker Compose | Any recent version |
| Conda (recommended) | Any recent version |
| Gemini API Key | [Get one at ai.google.dev](https://ai.google.dev) |
| Firebase Project | Google Sign-In enabled |

### 1. Clone the repository

```bash
git clone https://github.com/Harsh-617/tessera.git
cd tessera
```

### 2. Start the local database

```bash
docker-compose up -d
```

This starts a `pgvector/pgvector:pg16` PostgreSQL container on port `5432` with:
- User: `tessera`
- Password: `tessera`
- Database: `tessera`

### 3. Run database migrations

```bash
cd data/migrations
python run_migrations.py
```

### 4. Configure and start the backend

```bash
cd backend
cp .env.example .env
# Fill in your values — see Environment Variables section below
```

```bash
conda create -n tessera python=3.11 -y
conda activate tessera
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### 5. Seed demo data (optional but recommended)

With the backend running and Gemini API key configured:

```bash
cd data/seed
python seed.py
```

This inserts 5 mentors, 5 startups, a completed past programme (with 3 DNA blueprints generated from real Gemini embeddings), and a live active programme ready for demo matching.

### 6. Configure and start the frontend

```bash
cd frontend
cp .env.example .env
# Fill in Firebase config values
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`. API calls are automatically proxied to `http://localhost:8000` via `vite.config.js`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://tessera:tessera@localhost:5432/tessera` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase Admin SDK JSON | `./firebase_credentials.json` |

### Frontend (`frontend/.env`)

Get these values from Firebase Console → Project Settings → Your Apps → Web App → Config.

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

> **Security note:** Never commit `firebase_credentials.json` or `.env` files. Both are listed in `.gitignore`.

---

## Auth Flow

```
User clicks "Sign in with Google"
        │
        ▼
Firebase Authentication (client-side)
Issues JWT Bearer token
        │
        ▼
React sends: Authorization: Bearer {token}
on every API request (auto-injected by api.js)
        │
        ▼
FastAPI dependencies.py → firebase-admin SDK
verifies token signature → extracts firebase_uid
        │
        ▼
Look up user.role in PostgreSQL
(roles are stored in Postgres, NOT Firebase)
        │
        ▼
Role-based access control applied per route
```

**Design principle:** Firebase handles identity only. Postgres owns roles and authorisation.

---

## Roles & Access Control

| Role | Description | Capabilities |
|---|---|---|
| **Admin** | Programme owner / ecosystem manager | Create programmes, enroll actors, run matching, manage all links, view DNA library |
| **Mentor** | Expert guiding startups | Log check-ins, update milestones, view own active links |
| **Startup** | Company being supported | Log check-ins, update milestones, view own active links |
| **Partner** | Corporate, investor, or service provider | Linked to initiatives by admin; view own links |

Roles are assigned once at onboarding (role selection screen after first sign-in) and cannot be changed.

---

## Key Screens

### Match Explorer (primary demo screen)
Two-column layout: startup profile on the left, top 3 mentor suggestions ranked by combined score on the right. Each suggestion shows embedding score, DNA score, and Gemini-generated reasoning in a highlighted quote block. Admin clicks Approve to create the Link entity.

### Admin Dashboard
Stats cards (active links, at-risk count, programmes, DNA blueprints) + a paginated links table with health score bars, status badges, and last-activity timestamps. At-risk rows are highlighted.

### Link Detail
Both actor cards side-by-side, a large circular health gauge, and three tabs: Activity (check-in log + form), Milestones (status toggles + add form), History (link_events as a vertical timeline).

### DNA Library
Filter bar (industry, programme type, geography) + a grid of blueprint cards showing the AI-generated pattern summary, tags, and key relationship stats. Demonstrates that the system has learned from past cohorts.

---

## Roadmap

### Phase 1 — MVP (Hackathon)
- [x] Google Sign-In via Firebase
- [x] Role-based onboarding (mentor / startup / partner / admin)
- [x] EcoGraph OS — Link entity with full lifecycle state machine
- [x] Health score calculation with automatic at-risk flagging
- [x] AI matching pipeline (Signal A + Signal B + Gemini reasoning)
- [x] Check-in and milestone tracking
- [x] DNA blueprint extraction on successful completion
- [x] Admin dashboard, Match Explorer, Link Detail, DNA Library screens

### Phase 2 — Post-Hackathon
- [ ] Bulk auto-approve for matches above 90% combined score
- [ ] Re-matching — suggest replacement mentor when a link fails
- [ ] Cross-geography DNA reuse with geography weighting
- [ ] Partner profiles and partner-to-initiative links
- [ ] Email notifications on link state transitions and overdue check-ins
- [ ] Programme-level analytics and cohort comparison dashboard
- [ ] Multi-admin support per programme

### Phase 3 — Future Vision
- [ ] Cross-organisation anonymised DNA sharing
- [ ] Predictive risk scoring — flag likely failures before they happen
- [ ] Natural language admin interface ("Show me all at-risk fintech mentorships")
- [ ] Multi-tenant architecture for separate organisations
- [ ] Mobile app for check-in logging
- [ ] Calendar, Slack/Teams, and LinkedIn integrations

---

<div align="center">

Built at **Build With AI 2026 KL — MyHack** · Problem statement by Cradle

</div>
