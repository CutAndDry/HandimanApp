@echo off
REM HandimanApp Startup Script
REM This script starts the entire application with Docker Compose

cls
echo.
echo ====================================
echo   HandimanApp - Starting...
echo ====================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Starting services...
echo.

REM Start Docker Compose
docker-compose up -d

if errorlevel 1 (
    echo ERROR: Failed to start services!
    pause
    exit /b 1
)

echo.
echo ====================================
echo   ✓ Services started successfully!
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo API Docs: http://localhost:5000/swagger
echo Database: localhost:5432
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause
