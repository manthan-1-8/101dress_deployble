@echo off
echo ==========================================
echo   101-Dress Development Startup Script
echo ==========================================

echo.
echo [1/2] Setting up and starting Backend...
rem Installing dependencies silently
pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] python-multipart
rem Starting Backend on PORT 8001 to match Frontend config
start "101-Dress Backend" cmd /k "python -m uvicorn backend.main:app --reload --port 8001"

echo.
echo [2/2] Setting up and starting Frontend...
cd frontend
echo Installing frontend dependencies...
call npm.cmd install
echo Starting Frontend server...
call npm.cmd run dev
