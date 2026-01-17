"""
Candidate endpoints
"""
from fastapi import APIRouter, HTTPException
from app.models import Candidate
from app.services.data_service import data_service

router = APIRouter()


@router.get("/candidates/{candidate_id}", response_model=Candidate)
async def get_candidate(candidate_id: str):
    """
    Get full details for a specific candidate

    Args:
        candidate_id: Unique candidate identifier

    Returns:
        Complete candidate profile including bio, voting record, and funding

    Raises:
        HTTPException: 404 if candidate not found
    """
    candidate = await data_service.get_candidate_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")
    return candidate
