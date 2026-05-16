import os
import sys

# Add the backend folder to the Python path so we can import the AI/ML person's code
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import the models and the AI/ML person's function
from app.models.link import Link
from app.ai.dna import extract_dna_blueprint

# Load the database URL from the .env file in the root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

def generate_dna_blueprints():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("Error: DATABASE_URL not found. Make sure your .env file is set up correctly.")
        return

    # Connect to the database
    engine = create_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("Searching for successful mentorship links...")
    # Fetch all links that were successful
    successful_links = db.query(Link).filter(Link.outcome == 'successful').all()
    
    if not successful_links:
        print("No successful links found in the database yet!")
        return

    print(f"Found {len(successful_links)} successful links. Extracting DNA...")

    success_count = 0
    # Run the AI/ML person's DNA extraction function on each successful link
    for link in successful_links:
        print(f"\nProcessing Link ID: {link.id}...")
        try:
            extract_dna_blueprint(link.id, db)
            print(f"Successfully generated and saved DNA Blueprint for link {link.id}!")
            success_count += 1
        except Exception as e:
            print(f"Failed to extract DNA for link {link.id}. Error: {e}")

    print(f"\nDone! Successfully generated {success_count} DNA blueprints.")

if __name__ == "__main__":
    generate_dna_blueprints()
