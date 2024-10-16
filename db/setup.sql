-- setup.sql
-- This SQL script initializes the PostgreSQL database according to the default 
-- configuration in the provided .env.example file. 
-- 
-- Make sure your .env file has the following variables matching these values:
-- POSTGRES_APP_USER=appuser
-- POSTGRES_APP_PASSWORD=1234
-- POSTGRES_DB=mydb

-- Step 1: Revoke public access to the database and schema.
REVOKE CONNECT ON DATABASE mydb FROM public;
REVOKE ALL ON SCHEMA public FROM public;

-- Step 2: Create a new user for the application (appuser).
-- Ensure the password matches the value in your .env file.
CREATE USER appuser WITH PASSWORD '1234';

-- Step 3: Grant necessary privileges to the new user on the database and schemas.
GRANT ALL ON DATABASE mydb TO appuser;
GRANT ALL ON SCHEMA public TO appuser;
GRANT ALL ON SCHEMA drizzle TO appuser;