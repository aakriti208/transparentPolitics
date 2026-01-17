# Political Transparency Web Application

A map-based application showing congressional districts where users can click districts to view current and future political candidates with detailed profiles.

## Tech Stack

- **Backend**: FastAPI (Python) serving static JSON data
- **Frontend**: React with TypeScript, Mapbox GL JS, TailwindCSS
- **Architecture**: Monorepo with `/backend` and `/frontend` folders

## Project Structure

```
transparentPolitics/
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── data/         # Static JSON data files
│   └── scripts/      # Utility scripts
├── frontend/         # React frontend
│   ├── src/         # Source code
│   └── public/      # Static assets
└── README.md        # This file
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn
- Mapbox API token (get one at https://www.mapbox.com/)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the example environment file and configure:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. Start the backend server:
   ```bash
   chmod +x scripts/start.sh
   ./scripts/start.sh
   ```

   Or manually:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and configure:
   ```bash
   cp .env.example .env
   # Add your Mapbox token and API URL
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

## API Endpoints

- `GET /api/v1/districts` - Get all districts
- `GET /api/v1/districts/{id}` - Get district by ID
- `GET /api/v1/districts/{id}/candidates` - Get candidates for a district
- `GET /api/v1/candidates/{id}` - Get full candidate details

## Development

### Backend

The backend uses static JSON files located in `/backend/data/`:
- `districts.json` - District information with GeoJSON boundaries
- `candidates.json` - Candidate profiles and information

TODO: Migrate to PostgreSQL database with PostGIS extension for production

### Frontend

Key components:
- `MapView` - Interactive map with district boundaries
- `DistrictDrawer` - Slide-in panel showing district information
- `CandidateCard` - Candidate summary cards
- `CandidateModal` - Detailed candidate information modal

## Future Enhancements

- [ ] Database migration (PostgreSQL + PostGIS)
- [ ] User authentication and saved districts
- [ ] Real-time data updates
- [ ] Advanced filtering and search
- [ ] Mobile-responsive design improvements
- [ ] Performance optimizations for large datasets

## License

MIT
