@echo off
REM Exit immediately if any command fails
setlocal enabledelayedexpansion

echo Starting PostgreSQL service...
docker-compose -f db.yml up -d

echo Waiting for PostgreSQL to be ready...
:wait_loop
docker exec sft-db psql -U postgres -c "\l" >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 1 >nul
    goto wait_loop
)
echo PostgreSQL is ready!

echo Stopping PostgreSQL service...
docker-compose -f db.yml down

echo Starting the full application...
docker-compose up -d

echo All services are up and running!
docker ps

endlocal
