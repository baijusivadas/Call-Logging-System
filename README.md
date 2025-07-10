# Node.js Sales Tracking Backend

## Overview
This application manages and tracks field sales team activities, including:
- Call logging (inbound and outbound)
- Client and officer management
- Call volume and analytics reporting

## Why SQL?
We chose PostgreSQL (SQL) because:
- Supports structured relational data
- ACID compliance for data consistency
- Efficient for analytics queries
- Easily scalable with read replicas and partitioning

## Database Structure
- **Officers:** Manages sales officers.
- **Clients:** Manages clients.
- **Calls:** Logs calls between officers and clients, with analytics-ready structure.

## Scalability & Performance
- Indexes on frequently queried columns
- Connection pooling using Sequelize
- Partitioning and read replicas for high call volumes
- JSON fields for semi-structured future requirements

## Setup

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/sales-tracking-backend.git
cd sales-tracking-backend
