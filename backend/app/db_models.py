"""
SQLAlchemy ORM models for database tables
These are different from Pydantic models (models.py) - these represent database structure
"""
from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class CandidateStatus(enum.Enum):
    """Enum for candidate status"""
    current = "current"
    future = "future"


class District(Base):
    """Districts table"""
    __tablename__ = "districts"

    id = Column(String, primary_key=True, index=True)  # e.g., "CA-12"
    name = Column(String, nullable=False)
    state = Column(String, nullable=False, index=True)
    geometry = Column(JSON, nullable=False)  # Store GeoJSON as JSON
    population = Column(Integer, nullable=False)
    median_income = Column(Integer, nullable=False)

    # Relationship to candidates
    candidates = relationship("Candidate", back_populates="district")


class Candidate(Base):
    """Candidates table"""
    __tablename__ = "candidates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    party = Column(String, nullable=False, index=True)
    district_id = Column(String, ForeignKey("districts.id"), nullable=False, index=True)
    status = Column(SQLEnum(CandidateStatus), nullable=False, index=True)
    image_url = Column(String, nullable=False)
    bio = Column(String, nullable=False)
    voting_record = Column(JSON, nullable=True)  # Store as JSON array
    funding = Column(JSON, nullable=False)  # Store funding info as JSON
    website = Column(String, nullable=True)
    email = Column(String, nullable=True)

    # Relationship to district
    district = relationship("District", back_populates="candidates")
