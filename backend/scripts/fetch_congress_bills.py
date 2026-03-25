#!/usr/bin/env python3
"""
Fetch bills from the Congress.gov API and load them into the database.

Usage:
    python fetch_congress_bills.py --congress 118 --limit 500
    python fetch_congress_bills.py --congress 118 --bill-type hr --limit 250

Requirements:
    - CONGRESS_API_KEY set in backend/.env  (get free key at api.congress.gov)
    - pip install requests python-dotenv
"""
import sys
import time
import argparse
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import os

# Add parent directory so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))
load_dotenv(Path(__file__).parent.parent / ".env")

from app.database import SessionLocal
from app.db_models import Bill, Topic, BillTopic

API_KEY = os.getenv("CONGRESS_API_KEY")
BASE_URL = "https://api.congress.gov/v3"


def get_bills_page(congress: int, bill_type: str, offset: int, limit: int = 250) -> dict:
    """Fetch one page of bills from Congress.gov API."""
    url = f"{BASE_URL}/bill/{congress}/{bill_type}"
    params = {
        "api_key": API_KEY,
        "limit": limit,
        "offset": offset,
        "sort": "updateDate+desc",
    }
    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    return response.json()


def get_bill_detail(congress: int, bill_type: str, bill_number: int) -> dict:
    """Fetch full detail for a single bill."""
    url = f"{BASE_URL}/bill/{congress}/{bill_type}/{bill_number}"
    params = {"api_key": API_KEY}
    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    return response.json().get("bill", {})


def parse_date(date_str: str):
    """Parse a date string from the API into a Python date object."""
    if not date_str:
        return None
    for fmt in ("%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    return None


def get_or_create_topic(db, topic_name: str) -> Topic:
    """Return existing topic or create a new one."""
    topic = db.query(Topic).filter_by(topic_name=topic_name[:50]).first()
    if not topic:
        topic = Topic(topic_name=topic_name[:50])
        db.add(topic)
        db.flush()  # get the auto-generated topic_id
    return topic


def bill_code_from(congress: int, bill_type: str, bill_number: int) -> str:
    return f"{bill_type.upper()}{bill_number}-{congress}"


def upsert_bill(db, congress: int, bill_type: str, summary_data: dict, fetch_detail: bool) -> Bill | None:
    """Insert or update a bill record. Returns the Bill or None on error."""
    bill_number = summary_data.get("number")
    if not bill_number:
        return None

    code = bill_code_from(congress, bill_type, bill_number)
    existing = db.query(Bill).filter_by(bill_code=code).first()

    # Optionally fetch full detail for richer data
    if fetch_detail:
        try:
            detail = get_bill_detail(congress, bill_type, bill_number)
            time.sleep(0.15)  # ~6 req/s, well under 1000/hr limit
        except Exception as e:
            print(f"  Warning: could not fetch detail for {code}: {e}")
            detail = summary_data
    else:
        detail = summary_data

    title = (
        detail.get("title")
        or detail.get("shortTitle")
        or summary_data.get("title")
        or "Untitled"
    )

    introduced_date = parse_date(detail.get("introducedDate") or summary_data.get("introducedDate"))

    # Latest action doubles as a rough status
    latest_action = detail.get("latestAction") or {}
    status = latest_action.get("text", "")[:50] if latest_action else None

    # Policy area → topic
    policy_area = detail.get("policyArea") or {}
    topic_name = policy_area.get("name") if policy_area else None

    if existing:
        existing.official_title = title
        existing.status = status
        existing.introduced_date = introduced_date
        bill = existing
    else:
        bill = Bill(
            bill_code=code,
            official_title=title,
            status=status,
            congress_session=congress,
            introduced_date=introduced_date,
            vote_result_yes=0,
            vote_result_no=0,
            vote_result_present=0,
            vote_result_absent=0,
        )
        db.add(bill)

    db.flush()  # ensure bill_id is available

    # Link topic if present and not already linked
    if topic_name:
        topic = get_or_create_topic(db, topic_name)
        linked = db.query(BillTopic).filter_by(bill_id=bill.bill_id, topic_id=topic.topic_id).first()
        if not linked:
            db.add(BillTopic(bill_id=bill.bill_id, topic_id=topic.topic_id))

    return bill


def fetch_and_load(congress: int, bill_type: str, max_bills: int, fetch_detail: bool):
    """Main loop: paginate through API and load bills into DB."""
    if not API_KEY:
        print("ERROR: CONGRESS_API_KEY not set in .env")
        print("  Get a free key at https://api.congress.gov/sign-up")
        sys.exit(1)

    db = SessionLocal()
    loaded = 0
    offset = 0
    page_size = 250  # max allowed by API

    print(f"\nFetching {bill_type.upper()} bills from Congress {congress} (max {max_bills})...")
    print("-" * 60)

    try:
        while loaded < max_bills:
            fetch_count = min(page_size, max_bills - loaded)
            try:
                page = get_bills_page(congress, bill_type, offset, fetch_count)
            except requests.HTTPError as e:
                print(f"API error on offset {offset}: {e}")
                break

            bills_data = page.get("bills", [])
            if not bills_data:
                print("No more bills returned by API.")
                break

            for summary in bills_data:
                try:
                    upsert_bill(db, congress, bill_type, summary, fetch_detail)
                    loaded += 1
                    if loaded % 50 == 0:
                        db.commit()
                        print(f"  Committed {loaded} bills so far...")
                except Exception as e:
                    print(f"  Skipping bill due to error: {e}")
                    db.rollback()

            db.commit()
            offset += len(bills_data)

            # Respect rate limit: ~1000 req/hr → sleep between pages
            time.sleep(0.5)

            if len(bills_data) < fetch_count:
                break  # last page

        db.commit()
        total_bills = db.query(Bill).count()
        total_topics = db.query(Topic).count()
        print("-" * 60)
        print(f"Done. Loaded {loaded} bills this run.")
        print(f"Database totals: {total_bills} bills, {total_topics} topics")

    except Exception as e:
        db.rollback()
        print(f"Fatal error: {e}")
        import traceback
        traceback.traceback()
        sys.exit(1)
    finally:
        db.close()


def main():
    parser = argparse.ArgumentParser(description="Fetch congressional bills from Congress.gov API")
    parser.add_argument("--congress", type=int, default=118, help="Congress number (e.g. 118 = 2023-2025)")
    parser.add_argument("--bill-type", default="hr", choices=["hr", "s", "hjres", "sjres", "hconres", "sconres", "hres", "sres"],
                        help="Type of bill to fetch (default: hr = House bills)")
    parser.add_argument("--limit", type=int, default=500, help="Max number of bills to fetch (default: 500)")
    parser.add_argument("--no-detail", action="store_true", help="Skip per-bill detail fetch (faster, less data)")
    args = parser.parse_args()

    fetch_and_load(
        congress=args.congress,
        bill_type=args.bill_type,
        max_bills=args.limit,
        fetch_detail=not args.no_detail,
    )


if __name__ == "__main__":
    main()
