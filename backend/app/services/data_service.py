"""
Data service for querying PostgreSQL database
Replaces the old JSON-based service
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app import db_models
from app.models import District, Candidate


class DataService:
    """Service for accessing PostgreSQL database"""

    def __init__(self, db: Session):
        """Initialize with database session"""
        self.db = db

    async def get_all_districts(self) -> List[District]:
        """Get all districts from database"""
        db_districts = self.db.query(db_models.District).all()
        # Convert SQLAlchemy models to Pydantic models
        return [District(
            id=d.id,
            name=d.name,
            state=d.state,
            geometry=d.geometry,
            population=d.population,
            median_income=d.median_income
        ) for d in db_districts]

    async def get_district_by_id(self, district_id: str) -> Optional[District]:
        """Get a specific district by ID from database"""
        db_district = self.db.query(db_models.District).filter(
            db_models.District.id == district_id
        ).first()

        if not db_district:
            return None

        return District(
            id=db_district.id,
            name=db_district.name,
            state=db_district.state,
            geometry=db_district.geometry,
            population=db_district.population,
            median_income=db_district.median_income
        )

    async def get_candidates_by_district(self, district_id: str) -> List[Candidate]:
        """Get all candidates for a specific district from database"""
        db_candidates = self.db.query(db_models.Candidate).filter(
            db_models.Candidate.district_id == district_id
        ).all()

        return [Candidate(
            id=c.id,
            name=c.name,
            party=c.party,
            district_id=c.district_id,
            status=c.status.value,  # Convert enum to string
            image_url=c.image_url,
            bio=c.bio,
            voting_record=c.voting_record,
            funding=c.funding,
            website=c.website,
            email=c.email
        ) for c in db_candidates]

    async def get_candidate_by_id(self, candidate_id: str) -> Optional[Candidate]:
        """Get a specific candidate by ID from database"""
        db_candidate = self.db.query(db_models.Candidate).filter(
            db_models.Candidate.id == candidate_id
        ).first()

        if not db_candidate:
            return None

        return Candidate(
            id=db_candidate.id,
            name=db_candidate.name,
            party=db_candidate.party,
            district_id=db_candidate.district_id,
            status=db_candidate.status.value,  # Convert enum to string
            image_url=db_candidate.image_url,
            bio=db_candidate.bio,
            voting_record=db_candidate.voting_record,
            funding=db_candidate.funding,
            website=db_candidate.website,
            email=db_candidate.email
        )

    async def get_all_candidates(self) -> List[Candidate]:
        """Get all candidates from database"""
        db_candidates = self.db.query(db_models.Candidate).all()

        return [Candidate(
            id=c.id,
            name=c.name,
            party=c.party,
            district_id=c.district_id,
            status=c.status.value,  # Convert enum to string
            image_url=c.image_url,
            bio=c.bio,
            voting_record=c.voting_record,
            funding=c.funding,
            website=c.website,
            email=c.email
        ) for c in db_candidates]
