# PostgreSQL Database Setup Guide

This guide will walk you through setting up PostgreSQL for your Political Transparency application.

## Step 1: Install Dependencies

First, install the new Python packages:

```bash
cd backend
source venv/bin/activate  # Activate your virtual environment
pip install -r requirements.txt
```

This installs:
- `sqlalchemy` - ORM for database operations
- `psycopg2-binary` - PostgreSQL adapter for Python
- `alembic` - Database migration tool (for future use)

## Step 2: Create PostgreSQL Database

### Option A: Using Command Line (psql)

```bash
# Connect to PostgreSQL (default postgres user)
psql postgres

# In psql prompt, run:
CREATE DATABASE political_transparency;

# Verify database was created
\l

# Exit psql
\q
```

### Option B: Using pgAdmin

1. Open pgAdmin (if you don't have it, download from https://www.pgadmin.org/)
2. Connect to your local PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name it: `political_transparency`
5. Click "Save"

## Step 3: Configure Database Connection

The database URL is already configured in your `.env` file:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/political_transparency
```

**Format breakdown:**
```
postgresql://[username]:[password]@[host]:[port]/[database_name]
```

**If your PostgreSQL credentials are different:**
- Edit `backend/.env`
- Update username (default: `postgres`)
- Update password (default: `postgres`)
- Update host (default: `localhost`)
- Update port (default: `5432`)

**Example with custom credentials:**
```
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/political_transparency
```

## Step 4: Initialize Database Tables

Run the initialization script to create tables and load data:

```bash
cd backend
python scripts/init_db.py
```

This script will:
1. Create all necessary tables (districts, candidates)
2. Ask if you want to load data from JSON files
3. Migrate your existing JSON data to PostgreSQL

When prompted "Do you want to load data from JSON files?", type `y` and press Enter.

## Step 5: Verify Database Setup

### Using psql:

```bash
psql -d political_transparency

# List all tables
\dt

# View districts
SELECT id, name, state FROM districts;

# View candidates
SELECT id, name, party, status FROM candidates;

# Exit
\q
```

### Using pgAdmin:

1. Open pgAdmin
2. Navigate to: Servers → PostgreSQL → Databases → political_transparency → Schemas → public → Tables
3. Right-click on `districts` → "View/Edit Data" → "All Rows"
4. Repeat for `candidates` table

## Step 6: Start Your FastAPI Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Your API is now connected to PostgreSQL!

## Step 7: Test with Postman

### Test 1: Get All Districts
```
GET http://localhost:8000/api/v1/districts
```

Expected: JSON array of all districts

### Test 2: Get Specific District
```
GET http://localhost:8000/api/v1/districts/CA-12
```

Expected: Single district object for California 12th district

### Test 3: Get District Candidates
```
GET http://localhost:8000/api/v1/districts/CA-12/candidates
```

Expected: Array of candidates for that district

### Test 4: Get Specific Candidate
```
GET http://localhost:8000/api/v1/candidates/1
```

Expected: Full candidate profile with bio, voting record, funding

## Architecture Overview

```
┌─────────────────────────────────────────┐
│   PostgreSQL Database (Port 5432)      │
│   Database: political_transparency      │
│   Tables: districts, candidates         │
└────────────────┬────────────────────────┘
                 │
                 │ SQL Queries via SQLAlchemy ORM
                 │
┌────────────────▼────────────────────────┐
│   FastAPI Backend (Port 8000)          │
│   - app/database.py (connection)        │
│   - app/db_models.py (ORM models)       │
│   - app/services/data_service.py        │
│   - app/routers/*.py (endpoints)        │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP JSON API
                 │
┌────────────────▼────────────────────────┐
│   API Consumers                         │
│   - Postman (manual testing)            │
│   - React Frontend (production)         │
│   - curl/scripts (automation)           │
└─────────────────────────────────────────┘
```

## Common Operations

### View Database Connection String
```bash
cat backend/.env | grep DATABASE_URL
```

### Reset Database (WARNING: Deletes all data)
```bash
psql postgres -c "DROP DATABASE political_transparency;"
psql postgres -c "CREATE DATABASE political_transparency;"
python scripts/init_db.py
```

### Add New Data Manually (via Postman)

In the future, you can create POST endpoints like:

```
POST http://localhost:8000/api/v1/candidates
Content-Type: application/json

{
  "id": "new_candidate_id",
  "name": "John Doe",
  "party": "Independent",
  ...
}
```

### Query Database Directly (pgAdmin or psql)

```sql
-- Find all Democratic candidates
SELECT name, district_id
FROM candidates
WHERE party = 'Democratic';

-- Get district population stats
SELECT state, AVG(population) as avg_population
FROM districts
GROUP BY state;

-- Find candidates with funding over $1M
SELECT name, funding->>'total' as total_funding
FROM candidates
WHERE CAST(funding->>'total' AS INTEGER) > 1000000;
```

## Troubleshooting

### Error: "database does not exist"
- Make sure you created the database: `psql postgres -c "CREATE DATABASE political_transparency;"`

### Error: "password authentication failed"
- Check your DATABASE_URL in `.env`
- Verify PostgreSQL credentials with: `psql -U postgres`

### Error: "could not connect to server"
- Ensure PostgreSQL is running: `brew services list` (macOS)
- Start PostgreSQL: `brew services start postgresql` (macOS)

### Error: Import errors for sqlalchemy
- Make sure you installed dependencies: `pip install -r requirements.txt`
- Verify installation: `pip list | grep -i sqlalchemy`

### Tables not created
- Run: `python scripts/init_db.py` again
- Check for error messages in the output

## Next Steps

1. ✅ PostgreSQL database set up
2. ✅ Tables created and data loaded
3. ✅ FastAPI connected to database
4. ✅ Test with Postman
5. 🔜 Create POST/PUT/DELETE endpoints for adding/editing data
6. 🔜 Add authentication and user management
7. 🔜 Deploy to production with cloud database

## Files Changed/Created

- ✅ `requirements.txt` - Added SQLAlchemy, psycopg2, alembic
- ✅ `app/database.py` - Database connection setup
- ✅ `app/db_models.py` - SQLAlchemy ORM models
- ✅ `app/services/data_service.py` - Updated to use database
- ✅ `app/routers/districts.py` - Updated to use database sessions
- ✅ `app/routers/candidates.py` - Updated to use database sessions
- ✅ `app/config.py` - Added DATABASE_URL setting
- ✅ `.env` - Added DATABASE_URL
- ✅ `scripts/init_db.py` - Database initialization script
- 📦 `app/services/data_service_json_backup.py` - Backup of old JSON service
