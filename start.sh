#!/bin/sh
echo "Starting application on port $PORT..."
exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
