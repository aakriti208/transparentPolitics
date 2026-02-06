"""
Candidate endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import Candidate
from app.services.data_service import DataService
from app.database import get_db

router = APIRouter()


@router.get("/candidates/{candidate_id}", response_model=Candidate)
async def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    """
    Get full details for a specific candidate

    Args:
        candidate_id: Unique candidate identifier

    Returns:
        Complete candidate profile including bio, voting record, and funding

    Raises:
        HTTPException: 404 if candidate not found
    """
    data_service = DataService(db)
    candidate = await data_service.get_candidate_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")
    return candidate
