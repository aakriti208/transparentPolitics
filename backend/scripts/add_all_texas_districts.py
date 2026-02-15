#!/usr/bin/env python3
"""
Add all Texas congressional districts to the database
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.db_models import District

# Texas district data based on approximate values
texas_districts_data = [
    {"id": "TX-1", "name": "Texas 1st District", "population": 723000, "median_income": 52000},
    {"id": "TX-2", "name": "Texas 2nd District", "population": 735000, "median_income": 61000},
    {"id": "TX-3", "name": "Texas 3rd District", "population": 758000, "median_income": 95000},
    {"id": "TX-4", "name": "Texas 4th District", "population": 712000, "median_income": 58000},
    {"id": "TX-5", "name": "Texas 5th District", "population": 745000, "median_income": 62000},
    {"id": "TX-6", "name": "Texas 6th District", "population": 768000, "median_income": 71000},
    {"id": "TX-8", "name": "Texas 8th District", "population": 778000, "median_income": 76000},
    {"id": "TX-9", "name": "Texas 9th District", "population": 701000, "median_income": 48000},
    {"id": "TX-11", "name": "Texas 11th District", "population": 715000, "median_income": 56000},
    {"id": "TX-12", "name": "Texas 12th District", "population": 742000, "median_income": 65000},
    {"id": "TX-13", "name": "Texas 13th District", "population": 695000, "median_income": 53000},
    {"id": "TX-14", "name": "Texas 14th District", "population": 721000, "median_income": 57000},
    {"id": "TX-15", "name": "Texas 15th District", "population": 733000, "median_income": 45000},
    {"id": "TX-16", "name": "Texas 16th District", "population": 728000, "median_income": 47000},
    {"id": "TX-17", "name": "Texas 17th District", "population": 731000, "median_income": 54000},
    {"id": "TX-18", "name": "Texas 18th District", "population": 708000, "median_income": 46000},
    {"id": "TX-19", "name": "Texas 19th District", "population": 712000, "median_income": 52000},
    {"id": "TX-20", "name": "Texas 20th District", "population": 724000, "median_income": 48000},
    {"id": "TX-22", "name": "Texas 22nd District", "population": 763000, "median_income": 81000},
    {"id": "TX-23", "name": "Texas 23rd District", "population": 738000, "median_income": 51000},
    {"id": "TX-24", "name": "Texas 24th District", "population": 755000, "median_income": 73000},
    {"id": "TX-25", "name": "Texas 25th District", "population": 747000, "median_income": 64000},
    {"id": "TX-26", "name": "Texas 26th District", "population": 793000, "median_income": 88000},
    {"id": "TX-27", "name": "Texas 27th District", "population": 719000, "median_income": 49000},
    {"id": "TX-28", "name": "Texas 28th District", "population": 727000, "median_income": 46000},
    {"id": "TX-29", "name": "Texas 29th District", "population": 716000, "median_income": 44000},
    {"id": "TX-30", "name": "Texas 30th District", "population": 704000, "median_income": 45000},
    {"id": "TX-31", "name": "Texas 31st District", "population": 768000, "median_income": 69000},
    {"id": "TX-32", "name": "Texas 32nd District", "population": 756000, "median_income": 82000},
    {"id": "TX-33", "name": "Texas 33rd District", "population": 729000, "median_income": 53000},
    {"id": "TX-34", "name": "Texas 34th District", "population": 721000, "median_income": 44000},
    {"id": "TX-36", "name": "Texas 36th District", "population": 765000, "median_income": 71000},
    {"id": "TX-37", "name": "Texas 37th District", "population": 787000, "median_income": 67000},
    {"id": "TX-38", "name": "Texas 38th District", "population": 791000, "median_income": 78000},
]

def add_texas_districts():
    """Add all Texas districts to the database"""
    db = SessionLocal()

    try:
        print("=" * 60)
        print("Adding Texas Congressional Districts")
        print("=" * 60)

        added_count = 0
        skipped_count = 0

        for district_data in texas_districts_data:
            # Check if district already exists
            existing = db.query(District).filter(District.id == district_data["id"]).first()

            if existing:
                print(f"⊘ Skipping {district_data['id']} - already exists")
                skipped_count += 1
                continue

            # Create district with placeholder geometry
            district = District(
                id=district_data["id"],
                name=district_data["name"],
                state="Texas",
                geometry={
                    "type": "Polygon",
                    "coordinates": [[
                        [-98.0, 30.0],
                        [-98.0, 31.0],
                        [-97.0, 31.0],
                        [-97.0, 30.0],
                        [-98.0, 30.0]
                    ]]
                },
                population=district_data["population"],
                median_income=district_data["median_income"]
            )

            db.add(district)
            print(f"✓ Added {district_data['id']}: {district_data['name']}")
            added_count += 1

        db.commit()

        print("\n" + "=" * 60)
        print(f"✨ Complete!")
        print(f"   Added: {added_count} districts")
        print(f"   Skipped: {skipped_count} districts (already exist)")
        print("=" * 60)

    except Exception as e:
        print(f"\n✗ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    add_texas_districts()
