# Stroke Fast Track System - Developer Manual

## Project Overview

This project is designed to provide a Stroke Fast Track System with features that include managing patient records, tracking cases, and user management. The backend is powered by Express.js with TypeScript, while the frontend uses React. Docker is used for container management.

## Setup Instructions (Step-by-Step)

### Step 1: Clone the Repository

```bash
git clone https://github.com/duxmazter46/sft-project.git
cd sft-project
```

### Step 2: Set File Permissions (Linux/Mac)

```bash
chmod +x initdb/init.sh
```

### Step 3: Configure Environment Variables

* Rename the .env.example file to .env:

   ```bash
   mv .env.example .env
   ```

* Open the .env file and update the values as needed (e.g., database credentials, API URLs).

### Step 4: Initialize the Database

* Windows: Double-click or run the following in Command Prompt:

   ```bash
   init.bat
   ```

* Linux/Mac: Execute:

   ```bash
   ./initdb/init.sh
   ```

### Step 5: Start the Application

* Ensure Docker is installed and running.

* Use Docker Compose to start the full stack (backend, frontend, and database):

   ```bash
   docker-compose up -d
   ```

## Folder Structure

1. `api/`

   Stores API documentation and related files:

   * `sft-api.json`: JSON file with the API specification.

   * `Stroke-Fast-Track-API-Document.pdf`: PDF document detailing API endpoints and their usage

2. `backend/src/routes/`

   Contains route files for different API endpoints:

   * `cases.ts`: Handles operations related to case management.

   * `patient.ts`: Manages patient records and details.

   * `users.ts`: Manages user authentication and user-related operations.

3. `backend/`
   Houses backend source code:

   * `db.ts`: Manages database connections (PostgreSQL).

   * `index.ts`: Main entry point for the backend.

   * `docker-compose.yml`: Manages Docker containers for backend, frontend, and database.

   * `.env.example`: Example environment configuration file.

4. `db/`

   Stores SQL scripts for database management:

   * `setup.sql`: Initializes tables and database schema.

   * `snapshot.sql`: Contains database snapshots or backups.

5. `frontend/src/`

   Frontend code organized into components, pages, and routes:

   * `components/`: Reusable UI components.

   * `pages/`: Contains application views (e.g., AdminPage, MainPage).

   * `routes/`: Defines client-side routing for navigation.

6. Docker Configuration

   * `Dockerfile`: Defines how to build the Docker images.

   * `docker-compose.yml`: Manages backend, frontend, and database containers.

   * `nginx.conf`: NGINX configuration for static file serving or reverse proxy setup.

## API Overview and Endpoints

Below is a detailed summary of the API structure and available endpoints:

### Users

| **Method** | **Endpoint**              | **Description**                                      |
|------------|---------------------------|------------------------------------------------------|
| GET        | `/users/:username`        | Retrieve user details by username (Admin only).      |
| GET        | `/users/me`               | Retrieve the currently logged-in user's information. |
| GET        | `/users`                  | Get all users (Admin only).                          |
| POST       | `/users`                  | Create a new user.                                   |
| PATCH      | `/users/:username`        | Update user details (rename).                        |
| POST       | `/users/login`            | Log in a user.                                       |
| POST       | `/users/logout`           | Log out the current user.                            |
| PATCH      | `/users/:username/status` | Update the status of a user (Admin only).            |
| DELETE     | `/users/:username`        | Delete a user (Admin only).                          |

### Patients

### Cases

### BEFAST

### CT Scan

### NIHSS

### Thrombolytic

### **Injection**




