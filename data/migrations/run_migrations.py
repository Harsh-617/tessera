import os
import glob
import psycopg2
from dotenv import load_dotenv

# Load environment variables from the root .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

def run_migrations():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("Error: DATABASE_URL environment variable not set.")
        return

    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        cursor = conn.cursor()

        # Get all .sql files in the current directory, sorted alphabetically
        migration_files = sorted(glob.glob(os.path.join(os.path.dirname(__file__), '*.sql')))

        for file_path in migration_files:
            file_name = os.path.basename(file_path)
            print(f"Running migration: {file_name}")
            with open(file_path, 'r', encoding='utf-8') as f:
                sql = f.read()
                cursor.execute(sql)
            print(f"Successfully executed {file_name}")

        cursor.close()
        conn.close()
        print("All migrations completed successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_migrations()
