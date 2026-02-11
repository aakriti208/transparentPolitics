#!/usr/bin/env python3
"""
Add Texas candidates data to the database
"""
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.db_models import Candidacy, Vote

def add_candidacies():
    """Add candidacies for new Texas candidates"""
    db = SessionLocal()

    try:
        candidacies_data = [
            # TX-7
            {
                "candidacy_id": 7,
                "candidate_id": "7",
                "district_id": "TX-7",
                "role_running_for": "U.S. Representative",
                "election_year": 2024,
                "is_incumbent": True,
                "status": "Running"
            },
            {
                "candidacy_id": 8,
                "candidate_id": "8",
                "district_id": "TX-7",
                "role_running_for": "U.S. Representative",
                "election_year": 2024,
                "is_incumbent": False,
                "status": "Running"
            },
            # TX-10
            {
                "candidacy_id": 9,
                "candidate_id": "9",
                "district_id": "TX-10",
                "role_running_for": "U.S. Representative",
                "election_year": 2024,
                "is_incumbent": True,
                "status": "Running"
            },
            {
                "candidacy_id": 10,
                "candidate_id": "10",
                "district_id": "TX-10",
                "role_running_for": "U.S. Representative",
                "election_year": 2024,
                "is_incumbent": False,
                "status": "Running"
            },
            # TX-35
            {
                "candidacy_id": 11,
                "candidate_id": "11",
                "district_id": "TX-35",
                "role_running_for": "U.S. Representative",
                "election_year": 2024,
                "is_incumbent": True,
                "status": "Running"
            },
            {
                "candidacy_id": 12,
                "candidate_id": "12",
                "district_id": "TX-35",
                "role_running_for": "U.S. Representative",
                "election_year": 2024,
                "is_incumbent": False,
                "status": "Running"
            }
        ]

        for cand_data in candidacies_data:
            candidacy = Candidacy(**cand_data)
            db.add(candidacy)

        db.commit()
        print(f"✅ Added {len(candidacies_data)} candidacies")

    except Exception as e:
        print(f"❌ Error adding candidacies: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def add_votes():
    """Add votes for new Texas current representatives"""
    db = SessionLocal()

    try:
        votes_data = [
            # Lizzie Fletcher (TX-7, Democratic)
            {
                "vote_id": 13,
                "bill_id": 1,  # Healthcare
                "candidate_id": "7",
                "vote_choice": "Yes",
                "vote_date": datetime.fromisoformat("2024-03-15T14:30:00+00:00"),
                "notes": "Supporting healthcare access for all Americans"
            },
            {
                "vote_id": 14,
                "bill_id": 9,  # Infrastructure
                "candidate_id": "7",
                "vote_choice": "Yes",
                "vote_date": datetime.fromisoformat("2024-05-15T16:20:00+00:00"),
                "notes": "Infrastructure investment critical for Texas and Houston"
            },
            {
                "vote_id": 15,
                "bill_id": 2,  # Climate
                "candidate_id": "7",
                "vote_choice": "Yes",
                "vote_date": datetime.fromisoformat("2024-05-22T15:45:00+00:00"),
                "notes": "Climate action is essential for our future"
            },

            # Michael McCaul (TX-10, Republican)
            {
                "vote_id": 16,
                "bill_id": 6,  # Defense
                "candidate_id": "9",
                "vote_choice": "Yes",
                "vote_date": datetime.fromisoformat("2024-06-05T15:30:00+00:00"),
                "notes": "Strong national defense is my top priority"
            },
            {
                "vote_id": 17,
                "bill_id": 7,  # Border Security
                "candidate_id": "9",
                "vote_choice": "Yes",
                "vote_date": datetime.fromisoformat("2024-01-20T13:00:00+00:00"),
                "notes": "Securing our border is critical for national security"
            },
            {
                "vote_id": 18,
                "bill_id": 1,  # Healthcare
                "candidate_id": "9",
                "vote_choice": "No",
                "vote_date": datetime.fromisoformat("2024-03-15T14:30:00+00:00"),
                "notes": "Government-run healthcare is not the solution"
            },

            # Lloyd Doggett (TX-35, Democratic)
            {
                "vote_id": 19,
                "bill_id": 1,  # Healthcare
                "candidate_id": "11",
                "vote_choice": "Yes",
                "vote_date": datetime.fromisoformat("2024-03-15T14:30:00+00:00"),
                "notes": "Healthcare is a right, not a privilege"
            },
            {
                "vote_id": 20,
                "bill_id": 5,  # Medicare for All
                "candidate_id": "11",
                "vote_choice": "Yes",
                "vote_date": datetime.fromisoformat("2024-04-12T14:15:00+00:00"),
                "notes": "Medicare for All is the path forward"
            },
            {
                "vote_id": 21,
                "bill_id": 3,  # Tax Reform
                "candidate_id": "11",
                "vote_choice": "No",
                "vote_date": datetime.fromisoformat("2024-07-10T13:20:00+00:00"),
                "notes": "Tax cuts for the wealthy are fiscally irresponsible"
            }
        ]

        for vote_data in votes_data:
            vote = Vote(**vote_data)
            db.add(vote)

        db.commit()
        print(f"✅ Added {len(votes_data)} votes")

    except Exception as e:
        print(f"❌ Error adding votes: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def main():
    print("=" * 60)
    print("Adding Texas Data to Database")
    print("=" * 60)

    add_candidacies()
    add_votes()

    print("\n✨ Texas data added successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
