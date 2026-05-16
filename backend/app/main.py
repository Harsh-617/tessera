from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, profiles, programmes, links, activity, dashboard, dna, matching

app = FastAPI(
    title="Tessera API",
    description="AI-powered ecosystem relationship engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(programmes.router)
app.include_router(links.router)
app.include_router(activity.router)
app.include_router(dashboard.router)
app.include_router(dna.router)
app.include_router(matching.router)

@app.get("/")
def root():
    return {"status": "Tessera API is running"}