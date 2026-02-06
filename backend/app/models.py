"""
Pydantic models for request/response schemas
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Literal


class Geometry(BaseModel):
    """GeoJSON geometry model"""
    type: str
    coordinates: List[Any]


class District(BaseModel):
    """Congressional district model"""
    id: str = Field(..., description="District identifier (e.g., CA-12)")
    name: str = Field(..., description="Full district name")
    state: str = Field(..., description="State name")
    geometry: Geometry = Field(..., description="GeoJSON geometry for district boundary")
    population: int = Field(..., description="District population")
    median_income: int = Field(..., description="Median household income")


class FundingSource(BaseModel):
    """Campaign funding source"""
    name: str
    amount: int
    type: str  # e.g., "individual", "PAC", "party"


class Funding(BaseModel):
    """Campaign funding information"""
    total: int
    sources: List[FundingSource]


class VotingRecord(BaseModel):
    """Individual voting record entry"""
    bill_id: str
    bill_name: str
    vote: Literal["yes", "no", "abstain"]
    date: str


class Candidate(BaseModel):
    """Political candidate model"""
    id: str = Field(..., description="Unique candidate identifier")
    name: str = Field(..., description="Candidate full name")
    party: str = Field(..., description="Political party")
    district_id: str = Field(..., description="Associated district ID")
    status: Literal["current", "future"] = Field(..., description="Current or future candidate")
    image_url: str = Field(..., description="Profile image URL")
    bio: str = Field(..., description="Candidate biography")
    voting_record: Optional[List[VotingRecord]] = Field(default=None, description="Voting history")
    funding: Funding = Field(..., description="Campaign funding information")
    website: Optional[str] = Field(default=None, description="Campaign website")
    email: Optional[str] = Field(default=None, description="Contact email")


class CandidateSummary(BaseModel):
    """Abbreviated candidate information for list views"""
    id: str
    name: str
    party: str
    district_id: str
    status: Literal["current", "future"]
    image_url: str


class ContactRequest(BaseModel):
    """Contact form submission request"""
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    message: str = Field(..., min_length=1, max_length=2000)


class ContactResponse(BaseModel):
    """Contact form submission response"""
    success: bool
    message: str
