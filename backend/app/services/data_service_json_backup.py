"""
Data service for reading and filtering JSON data
TODO: Replace with database queries when migrating to PostgreSQL
"""
import json
from pathlib import Path
from typing import List, Optional
from app.models import District, Candidate

# Path to data directory
DATA_DIR = Path(__file__).parent.parent.parent / "data"


class DataService:
    """Service for accessing static JSON data"""

    def __init__(self):
        """Initialize the data service and load JSON files"""
        self._districts: List[District] = []
        self._candidates: List[Candidate] = []
        self._load_data()

    def _load_data(self) -> None:
        """Load data from JSON files"""
        # Load districts
        districts_file = DATA_DIR / "districts.json"
        if districts_file.exists():
            with open(districts_file, 'r') as f:
                districts_data = json.load(f)
                self._districts = [District(**d) for d in districts_data]

        # Load candidates
        candidates_file = DATA_DIR / "candidates.json"
        if candidates_file.exists():
            with open(candidates_file, 'r') as f:
                candidates_data = json.load(f)
                self._candidates = [Candidate(**c) for c in candidates_data]

    async def get_all_districts(self) -> List[District]:
        """Get all districts"""
        return self._districts

    async def get_district_by_id(self, district_id: str) -> Optional[District]:
        """Get a specific district by ID"""
        for district in self._districts:
            if district.id == district_id:
                return district
        return None

    async def get_candidates_by_district(self, district_id: str) -> List[Candidate]:
        """Get all candidates for a specific district"""
        return [c for c in self._candidates if c.district_id == district_id]

    async def get_candidate_by_id(self, candidate_id: str) -> Optional[Candidate]:
        """Get a specific candidate by ID"""
        for candidate in self._candidates:
            if candidate.id == candidate_id:
                return candidate
        return None

    async def get_all_candidates(self) -> List[Candidate]:
        """Get all candidates"""
        return self._candidates


# Singleton instance
data_service = DataService()
