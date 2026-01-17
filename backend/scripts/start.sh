#!/bin/bash

# Start script for Political Transparency API

echo "Starting Political Transparency API..."
echo "========================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Copying from .env.example..."
    cp .env.example .env
fi

# Install/update dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Start the server
echo "Starting uvicorn server..."
echo "API will be available at: http://localhost:8000"
echo "API docs available at: http://localhost:8000/docs"
echo "========================================="
uvicorn app.main:app --reload --port 8000
