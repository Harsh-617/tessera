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
npm install
npm run dev
```

## API Docs
Once backend is running: http://localhost:8000/docs