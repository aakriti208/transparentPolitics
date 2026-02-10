"""
Votes endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database import get_db
from app.db_models import Vote, Bill, Candidate, Topic, BillTopic

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/candidates/{candidate_id}/votes")
async def get_candidate_votes(candidate_id: str, db: Session = Depends(get_db)):
    """
    Get all votes by a specific candidate with bill details

    Args:
        candidate_id: The candidate ID

    Returns:
        List of votes with associated bill information
    """
    try:
        # Verify candidate exists
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")

        # Get votes with bill information
        votes = db.query(Vote).filter(Vote.candidate_id == candidate_id).all()

        result = []
        for vote in votes:
            # Get bill details
            bill = db.query(Bill).filter(Bill.bill_id == vote.bill_id).first()

            if not bill:
                continue

            # Get bill topics
            bill_topics = db.query(Topic).join(
                BillTopic, Topic.topic_id == BillTopic.topic_id
            ).filter(BillTopic.bill_id == bill.bill_id).all()

            primary_topic = bill_topics[0].topic_name if bill_topics else "Other"

            result.append({
                "vote_id": vote.vote_id,
                "vote_choice": vote.vote_choice,
                "vote_date": vote.vote_date.isoformat() if vote.vote_date else None,
                "notes": vote.notes,
                "bill": {
                    "bill_id": bill.bill_id,
                    "bill_code": bill.bill_code,
                    "official_title": bill.official_title,
                    "simple_summary": bill.simple_summary,
                    "status": bill.status,
                    "topic": primary_topic,
                    "full_text_url": bill.full_text_url
                }
            })

        # Sort by vote date (most recent first)
        result.sort(key=lambda x: x['vote_date'] if x['vote_date'] else '', reverse=True)

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching votes for candidate {candidate_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch candidate votes")
