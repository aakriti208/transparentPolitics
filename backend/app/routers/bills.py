"""
Bills endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database import get_db
from app.db_models import Bill, Topic, BillTopic

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/bills")
async def get_all_bills(db: Session = Depends(get_db)):
    """
    Get all bills with their topics

    Returns:
        List of bills with associated topic information
    """
    try:
        bills = db.query(Bill).all()

        result = []
        for bill in bills:
            # Get topics for this bill
            bill_topics = db.query(Topic).join(
                BillTopic, Topic.topic_id == BillTopic.topic_id
            ).filter(BillTopic.bill_id == bill.bill_id).all()

            # Get primary topic (first one) or default
            primary_topic = bill_topics[0].topic_name if bill_topics else "Other"

            result.append({
                "bill_id": bill.bill_id,
                "bill_code": bill.bill_code,
                "official_title": bill.official_title,
                "simple_summary": bill.simple_summary,
                "full_text_url": bill.full_text_url,
                "status": bill.status,
                "congress_session": bill.congress_session,
                "introduced_date": bill.introduced_date.isoformat() if bill.introduced_date else None,
                "vote_date": bill.vote_date.isoformat() if bill.vote_date else None,
                "vote_result_yes": bill.vote_result_yes,
                "vote_result_no": bill.vote_result_no,
                "vote_result_present": bill.vote_result_present,
                "vote_result_absent": bill.vote_result_absent,
                "topic": primary_topic,
                "topics": [t.topic_name for t in bill_topics]
            })

        return result

    except Exception as e:
        logger.error(f"Error fetching bills: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch bills")


@router.get("/bills/{bill_id}")
async def get_bill_by_id(bill_id: int, db: Session = Depends(get_db)):
    """
    Get a specific bill by ID with full details

    Args:
        bill_id: The bill ID

    Returns:
        Bill details with topics and votes
    """
    try:
        bill = db.query(Bill).filter(Bill.bill_id == bill_id).first()

        if not bill:
            raise HTTPException(status_code=404, detail="Bill not found")

        # Get topics
        bill_topics = db.query(Topic).join(
            BillTopic, Topic.topic_id == BillTopic.topic_id
        ).filter(BillTopic.bill_id == bill.bill_id).all()

        return {
            "bill_id": bill.bill_id,
            "bill_code": bill.bill_code,
            "official_title": bill.official_title,
            "simple_summary": bill.simple_summary,
            "full_text_url": bill.full_text_url,
            "status": bill.status,
            "congress_session": bill.congress_session,
            "introduced_date": bill.introduced_date.isoformat() if bill.introduced_date else None,
            "vote_date": bill.vote_date.isoformat() if bill.vote_date else None,
            "vote_result_yes": bill.vote_result_yes,
            "vote_result_no": bill.vote_result_no,
            "vote_result_present": bill.vote_result_present,
            "vote_result_absent": bill.vote_result_absent,
            "topics": [{"id": t.topic_id, "name": t.topic_name} for t in bill_topics]
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching bill {bill_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch bill")
