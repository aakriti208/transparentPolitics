#!/usr/bin/env python3
"""
Add new Texas districts, candidates, candidacies, and votes
"""
import sys
import json
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.db_models import District, Candidate, CandidateStatus, Candidacy, Vote


def add_new_districts(db):
    """Add new Texas districts"""
    print("\n📍 Adding New Texas Districts...")

    new_districts = [
        {
            "id": "TX-7",
            "name": "Texas 7th District",
            "state": "Texas",
            "geometry": {"type": "Polygon", "coordinates": [[[-95.5631, 29.7082], [-95.5631, 29.8582], [-95.3131, 29.8582], [-95.3131, 29.7082], [-95.5631, 29.7082]]]},
            "population": 734810,
            "median_income": 89546
        },
        {
            "id": "TX-10",
            "name": "Texas 10th District",
            "state": "Texas",
            "geometry": {"type": "Polygon", "coordinates": [[[-97.8431, 30.2072], [-97.8431, 30.3972], [-97.6431, 30.3972], [-97.6431, 30.2072], [-97.8431, 30.2072]]]},
            "population": 752467,
            "median_income": 67234
        },
        {
            "id": "TX-35",
            "name": "Texas 35th District",
            "state": "Texas",
            "geometry": {"type": "Polygon", "coordinates": [[[-98.5436, 29.3241], [-98.5436, 30.4672], [-97.6431, 30.4672], [-97.6431, 29.3241], [-98.5436, 29.3241]]]},
            "population": 728254,
            "median_income": 52890
        }
    ]

    added = 0
    for dist_data in new_districts:
        existing = db.query(District).filter(District.id == dist_data["id"]).first()
        if not existing:
            district = District(**dist_data)
            db.add(district)
            added += 1

    db.commit()
    print(f"✅ Added {added} new districts")


def add_new_candidates(db):
    """Add new Texas candidates"""
    print("\n👤 Adding New Texas Candidates...")

    new_candidates_data = [
        {
            "id": "7",
            "name": "Lizzie Fletcher",
            "party": "Democratic",
            "district_id": "TX-7",
            "status": CandidateStatus.current,
            "image_url": "https://via.placeholder.com/150/0000FF/FFFFFF?text=LF",
            "bio": "Lizzie Fletcher has represented Texas's 7th congressional district since 2019. A former attorney, she focuses on healthcare access, infrastructure investment, and supporting small businesses.",
            "voting_record": None,
            "funding": {"total": 2850000, "sources": [{"name": "Individual Contributions", "amount": 1650000, "type": "individual"}]},
            "website": "https://fletcher.house.gov",
            "email": "contact@lizziefletcher.gov"
        },
        {
            "id": "8",
            "name": "Wesley Hunt",
            "party": "Republican",
            "district_id": "TX-7",
            "status": CandidateStatus.future,
            "image_url": "https://via.placeholder.com/150/FF0000/FFFFFF?text=WH",
            "bio": "Wesley Hunt is a U.S. Army veteran and business executive challenging for Texas's 7th district.",
            "voting_record": None,
            "funding": {"total": 1420000, "sources": [{"name": "Individual Contributions", "amount": 920000, "type": "individual"}]},
            "website": "https://wesleyhunt.com",
            "email": "info@wesleyhunt.com"
        },
        {
            "id": "9",
            "name": "Michael McCaul",
            "party": "Republican",
            "district_id": "TX-10",
            "status": CandidateStatus.current,
            "image_url": "https://via.placeholder.com/150/FF0000/FFFFFF?text=MM",
            "bio": "Michael McCaul has represented Texas's 10th congressional district since 2005. He serves as Chairman of the House Foreign Affairs Committee.",
            "voting_record": None,
            "funding": {"total": 3950000, "sources": [{"name": "Individual Contributions", "amount": 2150000, "type": "individual"}]},
            "website": "https://mccaul.house.gov",
            "email": "contact@mccaul.gov"
        },
        {
            "id": "10",
            "name": "Mike Siegel",
            "party": "Democratic",
            "district_id": "TX-10",
            "status": CandidateStatus.future,
            "image_url": "https://via.placeholder.com/150/0000FF/FFFFFF?text=MS",
            "bio": "Mike Siegel is a civil rights attorney running for Texas's 10th district.",
            "voting_record": None,
            "funding": {"total": 1150000, "sources": [{"name": "Individual Contributions", "amount": 850000, "type": "individual"}]},
            "website": "https://siegelfortexas.org",
            "email": "info@siegelfortexas.org"
        },
        {
            "id": "11",
            "name": "Lloyd Doggett",
            "party": "Democratic",
            "district_id": "TX-35",
            "status": CandidateStatus.current,
            "image_url": "https://via.placeholder.com/150/0000FF/FFFFFF?text=LD",
            "bio": "Lloyd Doggett has represented Texas in Congress since 1995. A senior member of the House Ways and Means Committee.",
            "voting_record": None,
            "funding": {"total": 2650000, "sources": [{"name": "Individual Contributions", "amount": 1550000, "type": "individual"}]},
            "website": "https://doggett.house.gov",
            "email": "contact@doggett.gov"
        },
        {
            "id": "12",
            "name": "Jenny Garcia Sharon",
            "party": "Republican",
            "district_id": "TX-35",
            "status": CandidateStatus.future,
            "image_url": "https://via.placeholder.com/150/FF0000/FFFFFF?text=JG",
            "bio": "Jenny Garcia Sharon is a small business owner challenging for Texas's 35th district.",
            "voting_record": None,
            "funding": {"total": 725000, "sources": [{"name": "Individual Contributions", "amount": 475000, "type": "individual"}]},
            "website": "https://garciafortexas.com",
            "email": "info@garciafortexas.com"
        }
    ]

    added = 0
    for cand_data in new_candidates_data:
        existing = db.query(Candidate).filter(Candidate.id == cand_data["id"]).first()
        if not existing:
            candidate = Candidate(**cand_data)
            db.add(candidate)
            added += 1

    db.commit()
    print(f"✅ Added {added} new candidates")


def add_new_candidacies(db):
    """Add candidacies for new candidates"""
    print("\n🗳️  Adding New Candidacies...")

    candidacies_data = [
        {"candidacy_id": 7, "candidate_id": "7", "district_id": "TX-7", "role_running_for": "U.S. Representative", "election_year": 2024, "is_incumbent": True, "status": "Running"},
        {"candidacy_id": 8, "candidate_id": "8", "district_id": "TX-7", "role_running_for": "U.S. Representative", "election_year": 2024, "is_incumbent": False, "status": "Running"},
        {"candidacy_id": 9, "candidate_id": "9", "district_id": "TX-10", "role_running_for": "U.S. Representative", "election_year": 2024, "is_incumbent": True, "status": "Running"},
        {"candidacy_id": 10, "candidate_id": "10", "district_id": "TX-10", "role_running_for": "U.S. Representative", "election_year": 2024, "is_incumbent": False, "status": "Running"},
        {"candidacy_id": 11, "candidate_id": "11", "district_id": "TX-35", "role_running_for": "U.S. Representative", "election_year": 2024, "is_incumbent": True, "status": "Running"},
        {"candidacy_id": 12, "candidate_id": "12", "district_id": "TX-35", "role_running_for": "U.S. Representative", "election_year": 2024, "is_incumbent": False, "status": "Running"}
    ]

    added = 0
    for cand_data in candidacies_data:
        existing = db.query(Candidacy).filter(Candidacy.candidacy_id == cand_data["candidacy_id"]).first()
        if not existing:
            candidacy = Candidacy(**cand_data)
            db.add(candidacy)
            added += 1

    db.commit()
    print(f"✅ Added {added} new candidacies")


def add_new_votes(db):
    """Add votes for new current representatives"""
    print("\n✔️  Adding New Votes...")

    votes_data = [
        # Lizzie Fletcher votes
        {"vote_id": 13, "bill_id": 1, "candidate_id": "7", "vote_choice": "Yes", "vote_date": datetime.fromisoformat("2024-03-15T14:30:00+00:00"), "notes": "Supporting healthcare access for all Americans"},
        {"vote_id": 14, "bill_id": 9, "candidate_id": "7", "vote_choice": "Yes", "vote_date": datetime.fromisoformat("2024-05-15T16:20:00+00:00"), "notes": "Infrastructure investment critical for Texas and Houston"},
        {"vote_id": 15, "bill_id": 2, "candidate_id": "7", "vote_choice": "Yes", "vote_date": datetime.fromisoformat("2024-05-22T15:45:00+00:00"), "notes": "Climate action is essential for our future"},
        # Michael McCaul votes
        {"vote_id": 16, "bill_id": 6, "candidate_id": "9", "vote_choice": "Yes", "vote_date": datetime.fromisoformat("2024-06-05T15:30:00+00:00"), "notes": "Strong national defense is my top priority"},
        {"vote_id": 17, "bill_id": 7, "candidate_id": "9", "vote_choice": "Yes", "vote_date": datetime.fromisoformat("2024-01-20T13:00:00+00:00"), "notes": "Securing our border is critical for national security"},
        {"vote_id": 18, "bill_id": 1, "candidate_id": "9", "vote_choice": "No", "vote_date": datetime.fromisoformat("2024-03-15T14:30:00+00:00"), "notes": "Government-run healthcare is not the solution"},
        # Lloyd Doggett votes
        {"vote_id": 19, "bill_id": 1, "candidate_id": "11", "vote_choice": "Yes", "vote_date": datetime.fromisoformat("2024-03-15T14:30:00+00:00"), "notes": "Healthcare is a right, not a privilege"},
        {"vote_id": 20, "bill_id": 5, "candidate_id": "11", "vote_choice": "Yes", "vote_date": datetime.fromisoformat("2024-04-12T14:15:00+00:00"), "notes": "Medicare for All is the path forward"},
        {"vote_id": 21, "bill_id": 3, "candidate_id": "11", "vote_choice": "No", "vote_date": datetime.fromisoformat("2024-07-10T13:20:00+00:00"), "notes": "Tax cuts for the wealthy are fiscally irresponsible"}
    ]

    added = 0
    for vote_data in votes_data:
        existing = db.query(Vote).filter(Vote.vote_id == vote_data["vote_id"]).first()
        if not existing:
            vote = Vote(**vote_data)
            db.add(vote)
            added += 1

    db.commit()
    print(f"✅ Added {added} new votes")


def main():
    print("=" * 60)
    print("Adding New Texas Data")
    print("=" * 60)

    db = SessionLocal()

    try:
        add_new_districts(db)
        add_new_candidates(db)
        add_new_candidacies(db)
        add_new_votes(db)

        print("\n" + "=" * 60)
        print("✨ All new Texas data added successfully!")
        print("=" * 60)

        # Show summary
        print("\n📊 Database Summary:")
        print(f"   • Total Districts: {db.query(District).count()}")
        print(f"   • Total Candidates: {db.query(Candidate).count()}")
        print(f"   • Total Candidacies: {db.query(Candidacy).count()}")
        print(f"   • Total Votes: {db.query(Vote).count()}")
        print()

    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
