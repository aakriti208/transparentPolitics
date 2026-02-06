"""
District endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.models import District, Candidate
from app.services.data_service import DataService
from app.database import get_db

router = APIRouter()


@router.get("/districts", response_model=List[District])
async def get_all_districts(db: Session = Depends(get_db)):
    """
    Get all congressional districts

    Returns:
        List of all districts with their GeoJSON boundaries
    """
    data_service = DataService(db)
    districts = await data_service.get_all_districts()
    return districts


@router.get("/districts/{district_id}", response_model=District)
async def get_district(district_id: str, db: Session = Depends(get_db)):
    """
    Get a specific district by ID

    Args:
        district_id: District identifier (e.g., CA-12)

    Returns:
        District details including boundary geometry

    Raises:
        HTTPException: 404 if district not found
    """
    data_service = DataService(db)
    district = await data_service.get_district_by_id(district_id)
    if not district:
        raise HTTPException(status_code=404, detail=f"District {district_id} not found")
    return district


@router.get("/districts/{district_id}/candidates", response_model=List[Candidate])
async def get_district_candidates(district_id: str, db: Session = Depends(get_db)):
    """
    Get all candidates for a specific district

    Args:
        district_id: District identifier (e.g., CA-12)

    Returns:
        List of current and future candidates for the district

    Raises:
        HTTPException: 404 if district not found
    """
    data_service = DataService(db)

    # Verify district exists
    district = await data_service.get_district_by_id(district_id)
    if not district:
        raise HTTPException(status_code=404, detail=f"District {district_id} not found")

    candidates = await data_service.get_candidates_by_district(district_id)
    return candidates
