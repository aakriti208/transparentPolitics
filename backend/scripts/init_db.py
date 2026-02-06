#!/usr/bin/env python3
"""
Database initialization script
Creates tables and optionally loads data from JSON files
"""
import sys
import json
from pathlib import Path

# Add parent directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import engine, SessionLocal
from app.db_models import Base, District, Candidate, CandidateStatus


def create_tables():
    """Create all tables in the database"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully!")


def load_json_data():
    """Load data from JSON files into database"""
    print("\nLoading data from JSON files...")

    data_dir = Path(__file__).parent.parent / "data"
    db = SessionLocal()

    try:
        # Load districts
        districts_file = data_dir / "districts.json"
        if districts_file.exists():
            print(f"Loading districts from {districts_file}...")
            with open(districts_file, 'r') as f:
                districts_data = json.load(f)

            for district_data in districts_data:
                district = District(
                    id=district_data["id"],
                    name=district_data["name"],
                    state=district_data["state"],
                    geometry=district_data["geometry"],
                    population=district_data["population"],
                    median_income=district_data["median_income"]
                )
                db.add(district)

            db.commit()
            print(f"✓ Loaded {len(districts_data)} districts")

        # Load candidates
        candidates_file = data_dir / "candidates.json"
        if candidates_file.exists():
            print(f"Loading candidates from {candidates_file}...")
            with open(candidates_file, 'r') as f:
                candidates_data = json.load(f)

            for candidate_data in candidates_data:
                candidate = Candidate(
                    id=candidate_data["id"],
                    name=candidate_data["name"],
                    party=candidate_data["party"],
                    district_id=candidate_data["district_id"],
                    status=CandidateStatus[candidate_data["status"]],
                    image_url=candidate_data["image_url"],
                    bio=candidate_data["bio"],
                    voting_record=candidate_data.get("voting_record"),
                    funding=candidate_data["funding"],
                    website=candidate_data.get("website"),
                    email=candidate_data.get("email")
                )
                db.add(candidate)

            db.commit()
            print(f"✓ Loaded {len(candidates_data)} candidates")

        print("\n✓ All data loaded successfully!")

    except Exception as e:
        print(f"\n✗ Error loading data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def main():
    """Main initialization function"""
    print("=" * 60)
    print("Database Initialization Script")
    print("=" * 60)

    try:
        # Create tables
        create_tables()

        # Ask if user wants to load data
        response = input("\nDo you want to load data from JSON files? (y/n): ")
        if response.lower() in ['y', 'yes']:
            load_json_data()
        else:
            print("Skipping data load. You can load data later by running this script again.")

        print("\n" + "=" * 60)
        print("Database initialization complete!")
        print("=" * 60)

    except Exception as e:
        print(f"\n✗ Initialization failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
