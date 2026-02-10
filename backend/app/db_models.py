"""
SQLAlchemy ORM models for database tables
These are different from Pydantic models (models.py) - these represent database structure
"""
from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Enum as SQLEnum, Text, DateTime, Date, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class CandidateStatus(enum.Enum):
    """Enum for candidate status"""
    current = "current"
    future = "future"


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
    

class District(Base):
    """Districts table"""
    __tablename__ = "districts"

    id = Column(String, primary_key=True, index=True)  
    name = Column(String, nullable=False)
    state = Column(String, nullable=False, index=True)
    geometry = Column(JSON, nullable=False)  # Store GeoJSON as JSON
    population = Column(Integer, nullable=False)
    median_income = Column(Integer, nullable=False)

    # Relationship to candidates
    candidates = relationship("Candidate", back_populates="district")

    
class Topic(Base):
    """Topics table for categorizing bills"""
    __tablename__ = "topics"

    topic_id = Column(Integer, primary_key=True, autoincrement=True)
    topic_name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bills = relationship("BillTopic", back_populates="topic")


class Bill(Base):
    """Bills table for legislation tracking"""
    __tablename__ = "bills"

    bill_id = Column(Integer, primary_key=True, autoincrement=True)
    bill_code = Column(String(20), unique=True, nullable=False, index=True)
    official_title = Column(Text, nullable=False)
    simple_summary = Column(Text, nullable=True)
    full_text_url = Column(Text, nullable=True)
    status = Column(String(50), nullable=True, index=True)
    congress_session = Column(Integer, nullable=True, index=True)
    introduced_date = Column(Date, nullable=True)
    vote_date = Column(Date, nullable=True)
    vote_result_yes = Column(Integer, default=0, nullable=False)
    vote_result_no = Column(Integer, default=0, nullable=False)
    vote_result_present = Column(Integer, default=0, nullable=False)
    vote_result_absent = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    topics = relationship("BillTopic", back_populates="bill")
    sponsors = relationship("BillSponsor", back_populates="bill")
    votes = relationship("Vote", back_populates="bill")


class Candidacy(Base):
    """Candidacies table - tracks candidates running for office"""
    __tablename__ = "candidacies"

    candidacy_id = Column(Integer, primary_key=True, autoincrement=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False, index=True)
    district_id = Column(String, ForeignKey("districts.id"), nullable=False, index=True)
    role_running_for = Column(String(100), nullable=False)
    election_year = Column(Integer, nullable=False, index=True)
    is_incumbent = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default='Running', nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    candidate = relationship("Candidate", backref="candidacies")
    district = relationship("District", backref="candidacies")


class BillTopic(Base):
    """Junction table linking bills to topics"""
    __tablename__ = "bill_topics"

    bill_id = Column(Integer, ForeignKey("bills.bill_id"), primary_key=True)
    topic_id = Column(Integer, ForeignKey("topics.topic_id"), primary_key=True)

    # Relationships
    bill = relationship("Bill", back_populates="topics")
    topic = relationship("Topic", back_populates="bills")


class BillSponsor(Base):
    """Junction table linking bills to sponsors (candidates)"""
    __tablename__ = "bill_sponsors"

    bill_id = Column(Integer, ForeignKey("bills.bill_id"), primary_key=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), primary_key=True)
    sponsor_type = Column(String(50), nullable=False)

    # Relationships
    bill = relationship("Bill", back_populates="sponsors")
    candidate = relationship("Candidate", backref="sponsored_bills")


class Vote(Base):
    """Votes table - tracks how candidates voted on bills"""
    __tablename__ = "votes"

    vote_id = Column(Integer, primary_key=True, autoincrement=True)
    bill_id = Column(Integer, ForeignKey("bills.bill_id"), nullable=False, index=True)
    candidate_id = Column(String, ForeignKey("candidates.id"), nullable=False, index=True)
    vote_choice = Column(String(20), nullable=False)
    vote_date = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bill = relationship("Bill", back_populates="votes")
    candidate = relationship("Candidate", backref="votes")
