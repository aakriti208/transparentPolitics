"""
Main FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import districts, candidates, contact, bills, votes
from app.config import settings

app = FastAPI(
    title="Political Transparency API",
    description="API for accessing congressional district and candidate information",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(districts.router, prefix="/api/v1", tags=["districts"])
app.include_router(candidates.router, prefix="/api/v1", tags=["candidates"])
app.include_router(contact.router, prefix="/api/v1", tags=["contact"])
app.include_router(bills.router, prefix="/api/v1", tags=["bills"])
app.include_router(votes.router, prefix="/api/v1", tags=["votes"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Political Transparency API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}
