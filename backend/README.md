# Political Transparency API - Backend

FastAPI backend serving congressional district and candidate data from static JSON files.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration settings
│   ├── models.py            # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── districts.py     # District endpoints
│   │   └── candidates.py    # Candidate endpoints
│   └── services/
│       ├── __init__.py
│       └── data_service.py  # JSON data access layer
├── data/
│   ├── districts.json       # District data with GeoJSON
│   └── candidates.json      # Candidate profiles
├── scripts/
│   └── start.sh            # Development startup script
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

4. Run the development server:
   ```bash
   ./scripts/start.sh
   ```

   Or manually:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## API Documentation

Once running, visit:
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Districts

- `GET /api/v1/districts` - Get all districts
- `GET /api/v1/districts/{id}` - Get specific district
- `GET /api/v1/districts/{id}/candidates` - Get candidates for district

### Candidates

- `GET /api/v1/candidates/{id}` - Get candidate details

## Data Files

### districts.json

Contains congressional district information including:
- District ID (e.g., "CA-12")
- District name and state
- GeoJSON geometry for map rendering
- Demographic data (population, median income)

### candidates.json

Contains candidate profiles including:
- Basic info (name, party, district)
- Status (current representative or future candidate)
- Biography
- Voting record (for current representatives)
- Campaign funding breakdown
- Contact information

## Development Notes

### TODO: Database Migration

This application currently uses static JSON files for simplicity. For production, plan to migrate to:
- PostgreSQL database
- PostGIS extension for geographic data
- SQLAlchemy ORM
- Alembic for migrations

### Adding New Data

To add new districts or candidates:
1. Edit the appropriate JSON file in `/data/`
2. Follow the existing schema structure
3. Restart the server to reload data

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests (to be implemented)
pytest
```

## CORS Configuration

CORS is configured to allow requests from the frontend URL specified in `.env`. Modify `FRONTEND_URL` in `.env` if your frontend runs on a different port.
