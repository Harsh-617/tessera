# Tessera
AI-powered ecosystem relationship engine built for MyHack 2026.

## Team
- AI/ML: 
- Backend: 
- Frontend: 
- Data: 

## Prerequisites
- Python 3.11
- Node.js 18+
- Docker + Docker Compose
- Conda

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/tessera.git
cd tessera
```

### 2. Environment variables
```bash
cp .env.example .env
# Fill in your values in .env
```

### 3. Start local database
```bash
docker-compose up -d
```

### 4. Backend
```bash
cd backend
conda create -n tessera python=3.11 -y
conda activate tessera
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 5. Frontend
```bash
cd frontend
cp .env.example .env
# Fill in the Firebase config values in frontend/.env
# Get these from the Firebase Console → Project Settings → Your apps → Web app → Config
npm install
npm run dev
```

Frontend runs at http://localhost:3000
API calls are proxied to http://localhost:8000 automatically (configured in vite.config.js)

**Firebase env vars needed in `frontend/.env`:**
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## API Docs
Once backend is running: http://localhost:8000/docs