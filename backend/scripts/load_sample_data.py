#!/usr/bin/env python3
"""
Load sample data for new tables into the database
"""
import sys
import json
from pathlib import Path
from datetime import datetime

# Add parent directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.db_models import Topic, Bill, Candidacy, Vote, BillTopic, BillSponsor


def load_topics(db, data_dir):
    """Load topics data"""
    print("\n📚 Loading Topics...")
    topics_file = data_dir / "topics.json"

    if not topics_file.exists():
        print("❌ topics.json not found")
        return

    with open(topics_file, 'r') as f:
        topics_data = json.load(f)

    for topic_data in topics_data:
        topic = Topic(
            topic_id=topic_data["topic_id"],
            topic_name=topic_data["topic_name"],
            description=topic_data.get("description")
        )
        db.add(topic)

    db.commit()
    print(f"✅ Loaded {len(topics_data)} topics")


def load_bills(db, data_dir):
    """Load bills data"""
    print("\n📜 Loading Bills...")
    bills_file = data_dir / "bills.json"

    if not bills_file.exists():
        print("❌ bills.json not found")
        return

    with open(bills_file, 'r') as f:
        bills_data = json.load(f)

    for bill_data in bills_data:
        # Convert date strings to date objects
        introduced_date = datetime.strptime(bill_data["introduced_date"], "%Y-%m-%d").date() if bill_data.get("introduced_date") else None
        vote_date = datetime.strptime(bill_data["vote_date"], "%Y-%m-%d").date() if bill_data.get("vote_date") else None

        bill = Bill(
            bill_id=bill_data["bill_id"],
            bill_code=bill_data["bill_code"],
            official_title=bill_data["official_title"],
            simple_summary=bill_data.get("simple_summary"),
            full_text_url=bill_data.get("full_text_url"),
            status=bill_data.get("status"),
            congress_session=bill_data.get("congress_session"),
            introduced_date=introduced_date,
            vote_date=vote_date,
            vote_result_yes=bill_data.get("vote_result_yes", 0),
            vote_result_no=bill_data.get("vote_result_no", 0),
            vote_result_present=bill_data.get("vote_result_present", 0),
            vote_result_absent=bill_data.get("vote_result_absent", 0)
        )
        db.add(bill)

    db.commit()
    print(f"✅ Loaded {len(bills_data)} bills")


def load_candidacies(db, data_dir):
    """Load candidacies data"""
    print("\n🗳️  Loading Candidacies...")
    candidacies_file = data_dir / "candidacies.json"

    if not candidacies_file.exists():
        print("❌ candidacies.json not found")
        return

    with open(candidacies_file, 'r') as f:
        candidacies_data = json.load(f)

    for candidacy_data in candidacies_data:
        candidacy = Candidacy(
            candidacy_id=candidacy_data["candidacy_id"],
            candidate_id=candidacy_data["candidate_id"],
            district_id=candidacy_data["district_id"],
            role_running_for=candidacy_data["role_running_for"],
            election_year=candidacy_data["election_year"],
            is_incumbent=candidacy_data.get("is_incumbent", False),
            status=candidacy_data.get("status", "Running")
        )
        db.add(candidacy)

    db.commit()
    print(f"✅ Loaded {len(candidacies_data)} candidacies")


def load_votes(db, data_dir):
    """Load votes data"""
    print("\n✔️  Loading Votes...")
    votes_file = data_dir / "votes.json"

    if not votes_file.exists():
        print("❌ votes.json not found")
        return

    with open(votes_file, 'r') as f:
        votes_data = json.load(f)

    for vote_data in votes_data:
        # Convert ISO datetime string to datetime object
        vote_date = datetime.fromisoformat(vote_data["vote_date"].replace('Z', '+00:00'))

        vote = Vote(
            vote_id=vote_data["vote_id"],
            bill_id=vote_data["bill_id"],
            candidate_id=vote_data["candidate_id"],
            vote_choice=vote_data["vote_choice"],
            vote_date=vote_date,
            notes=vote_data.get("notes")
        )
        db.add(vote)

    db.commit()
    print(f"✅ Loaded {len(votes_data)} votes")


def load_bill_topics(db, data_dir):
    """Load bill_topics junction data"""
    print("\n🏷️  Loading Bill-Topic Relationships...")
    bill_topics_file = data_dir / "bill_topics.json"

    if not bill_topics_file.exists():
        print("❌ bill_topics.json not found")
        return

    with open(bill_topics_file, 'r') as f:
        bill_topics_data = json.load(f)

    for bt_data in bill_topics_data:
        bill_topic = BillTopic(
            bill_id=bt_data["bill_id"],
            topic_id=bt_data["topic_id"]
        )
        db.add(bill_topic)

    db.commit()
    print(f"✅ Loaded {len(bill_topics_data)} bill-topic relationships")


def load_bill_sponsors(db, data_dir):
    """Load bill_sponsors junction data"""
    print("\n👥 Loading Bill Sponsors...")
    bill_sponsors_file = data_dir / "bill_sponsors.json"

    if not bill_sponsors_file.exists():
        print("❌ bill_sponsors.json not found")
        return

    with open(bill_sponsors_file, 'r') as f:
        bill_sponsors_data = json.load(f)

    for bs_data in bill_sponsors_data:
        bill_sponsor = BillSponsor(
            bill_id=bs_data["bill_id"],
            candidate_id=bs_data["candidate_id"],
            sponsor_type=bs_data["sponsor_type"]
        )
        db.add(bill_sponsor)

    db.commit()
    print(f"✅ Loaded {len(bill_sponsors_data)} bill sponsors")


def clear_existing_data(db):
    """Clear existing data from new tables (keeps candidates and districts)"""
    print("\n🗑️  Clearing existing data from new tables...")

    try:
        # Delete in reverse order of dependencies
        db.query(BillSponsor).delete()
        db.query(BillTopic).delete()
        db.query(Vote).delete()
        db.query(Candidacy).delete()
        db.query(Bill).delete()
        db.query(Topic).delete()
        db.commit()
        print("✅ Cleared existing data")
    except Exception as e:
        print(f"⚠️  Note: {e}")
        db.rollback()


def main():
    """Main loading function"""
    print("=" * 70)
    print("🚀 Loading Sample Data into Database")
    print("=" * 70)

    data_dir = Path(__file__).parent.parent / "data"
    db = SessionLocal()

    try:
        # Clear existing data first
        clear_existing_data(db)

        # Load data in order (respecting foreign key dependencies)
        load_topics(db, data_dir)
        load_bills(db, data_dir)
        load_candidacies(db, data_dir)
        load_votes(db, data_dir)
        load_bill_topics(db, data_dir)
        load_bill_sponsors(db, data_dir)

        print("\n" + "=" * 70)
        print("✨ All sample data loaded successfully!")
        print("=" * 70)
        print("\n📊 Summary:")
        print(f"   • Topics: {db.query(Topic).count()}")
        print(f"   • Bills: {db.query(Bill).count()}")
        print(f"   • Candidacies: {db.query(Candidacy).count()}")
        print(f"   • Votes: {db.query(Vote).count()}")
        print(f"   • Bill-Topic Links: {db.query(BillTopic).count()}")
        print(f"   • Bill Sponsors: {db.query(BillSponsor).count()}")
        print()

    except Exception as e:
        print(f"\n❌ Error loading data: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
