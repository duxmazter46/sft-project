#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Step 1: Start the PostgreSQL service only
echo "Starting PostgreSQL service..."
docker-compose -f db.yml up -d

# Step 2: Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec sft-db psql -U postgres -c '\l' > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Step 3: Run the setup SQL script
echo "Running setup.sql..."
docker exec sft-db psql -U postgres -d mydb -f /docker-entrypoint-initdb.d/setup.sql

# Step 4: Run the snapshot SQL script
echo "Running snapshot-241017.sql..."
docker exec sft-db psql -U postgres -d mydb -f /docker-entrypoint-initdb.d/snapshot-241017.sql

# Step 5: Shut down the PostgreSQL-only setup
echo "Stopping PostgreSQL service..."
docker-compose -f db.yml down

# Step 6: Start the full stack with backend and frontend
echo "Starting the full application..."
docker-compose up -d

# Final Step: Show running containers
echo "All services are up and running!"
docker ps
