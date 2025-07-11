# Call-Logging-System Backend

## Overview

This is a Node.js backend application designed to manage and track a large-scale field sales team's activities, including real-time call logging, client/officer data management, and performance analytics. It's built for high-volume operations (30,000+ calls/month).

## Why SQL?

We chose PostgreSQL (SQL) because:

- Supports structured relational data
- ACID compliance for data consistency
- Efficient for analytics queries
- Easily scalable with read replicas and partitioning

## Key Features

- Call Logging: Real-time entry of call duration, type, outcome, comments, and timestamps.
- Performance Analytics: Daily/monthly call volumes, total call time per officer, calls per officer per day.
- Client Management: Store client details and view complete interaction history.
- Officer Management: Store officer details and view complete interaction history.

## Database Structure

- **Officers:** Manages sales officers.
- **Clients:** Manages clients.
- **Calls:** Logs calls between officers and clients, with analytics-ready structure.

## Technologies Used

- Node.js & Express.js: Backend framework.
- PostgreSQL & Sequelize: Database and ORM.
- Redis: For caching analytics data and rate limiting.
- JWT & bcrypt: For secure authentication.
- CommonJS Modules: (require/module.exports) for consistent module handling.

## Setup & Running the Application

- Node.js (LTS) & npm
- PostgreSQL database server
- Redis server (Docker recommended for local setup)

## Quick Setup

Clone:

## Install Dependencies:

- npm install express sequelize pg dotenv jsonwebtoken bcrypt cors nodemon ioredis express-rate-limit rate-limit-redis
- npm install -D sequelize-cli

## Configure .env: Create a .env file in the root with your database and Redis credentials:

- PORT=3000
- DB_USER="your_db_username"
- DB_PASSWORD="your_db_password"
- DB_NAME="sales_tracker_db"
- DB_HOST="localhost"
- DB_PORT=5432
- JWT_SECRET="your_very_strong_jwt_secret_key"
- REDIS_URI="redis://localhost:6379"

## Database & Redis Setup:

- Ensure PostgreSQL and Redis servers are running.
- Create a PostgreSQL database (e.g., sales_tracker_db).
- Place model files (officer.js, client.js, call.js) in the models/ directory.
- Place config file (config.js) in the config/ directory.
- Place middleware files (authMiddleware.js, rateLimitMiddleware.js) in the middleware/ directory.
- Place controller files (authController.js, officerController.js, clientController.js, callController.js, analyticsController.js)   in the controllers/ directory.
- Place route files (authRoutes.js, officerRoutes.js, clientRoutes.js, callRoutes.js, analyticsRoutes.js) in the routes/ directory.
- Update all import/export statements to require/module.exports across all .js files.

## Generate & Run Migrations:

npx sequelize-cli init # If not already done
npx sequelize-cli migration:generate --name create-officers-table
npx sequelize-cli migration:generate --name create-clients-table
npx sequelize-cli migration:generate --name create-calls-table

# Populate migration files with schema definitions (ensure indexes on calls table)

npx sequelize-cli db:migrate

## How to Run
- npm run dev # For development (with nodemon)
- The server will run on http://localhost:3000.

## API Endpoints
- All endpoints are prefixed with /api. Protected routes require a JWT in the Authorization: Bearer <token> header.

Authentication:

- POST /api/auth/register
- POST /api/auth/login (captures JWT)
- GET /api/auth/profile (Protected)

 Officer Management:

- GET /api/officers (Protected)
- GET /api/officers/:id (Protected, with call history)
- PUT /api/officers/:id (Protected)
- DELETE /api/officers/:id (Protected)

Client Management:

- POST /api/clients (Protected)
- GET /api/clients (Protected)
- GET /api/clients/:id (Protected, with interaction history)
- PUT /api/clients/:id (Protected)
- DELETE /api/clients/:id (Protected)

Call Logging:

- POST /api/calls (Protected)
- GET /api/calls (Protected, with filters)
- GET /api/calls/:id (Protected)
- PUT /api/calls/:id (Protected)
- DELETE /api/calls/:id (Protected)

Performance Analytics (Protected, Cached with Redis):

- GET /api/analytics/volumes (Daily & Monthly)
- GET /api/analytics/call-time-per-officer
- GET /api/analytics/calls-per-officer-per-day

## Scalability & Optimization
- Database Indexing: Critical indexes on calls table (officerId, clientId, timestamp, (officerId, timestamp)).
- Redis Caching: Analytics endpoints are cached in Redis for faster responses and reduced DB load.
- Rate Limiting: express-rate-limit with Redis store protects against abuse on all APIs, with stricter limits on auth routes.
- Future: Consider Materialized Views, Read Replicas, and Database Partitioning for further scaling.
