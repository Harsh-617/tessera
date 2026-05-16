import os
import sys

# Add the backend folder to the Python path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend'))
sys.path.insert(0, backend_path)

# Load the backend .env BEFORE importing app modules (which read env vars at import time)
from dotenv import load_dotenv
load_dotenv(os.path.join(backend_path, '.env'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.link import Link
from app.ai.dna import extract_dna_blueprint

def generate_dna_blueprints():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("Error: DATABASE_URL not found. Make sure your .env file is set up correctly.")
        return

    engine = create_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("Searching for successful mentorship links...")
    from app.models.link import OutcomeEnum
    successful_links = db.query(Link).filter(Link.outcome == OutcomeEnum.successful).all()

    if not successful_links:
        print("No successful links found in the database yet!")
        return

    print(f"Found {len(successful_links)} successful links. Extracting DNA...")
    success_count = 0

    for link in successful_links:
        print(f"\nProcessing Link ID: {link.id}...")
        try:
            extract_dna_blueprint(str(link.id), db)
            print(f"  Successfully generated DNA Blueprint for link {link.id}!")
            success_count += 1
        except Exception as e:
            db.rollback()  # Reset session so next link can proceed
            print(f"  Failed to extract DNA for link {link.id}. Error: {e}")

    db.close()
    print(f"\nDone! Successfully generated {success_count} DNA blueprints.")

if __name__ == "__main__":
    generate_dna_blueprints()
