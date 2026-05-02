# Formulary - Medicine Substitution Platform

![Formulary Preview](docs/images/image.png)

## Overview
**Formulary** is a backend-driven healthcare platform that enables users to search medicines, discover equivalent substitutes, and compare prices to identify cost-effective alternatives.

The system is designed as a read-heavy, high-performance API, optimized using caching and efficient database querying.

## Problem
Patients often pay higher prices for branded medicines due to lack of visibility into cheaper substitutes with identical compositions.

## Solution
Formulary provides:

- Fast medicine search
- Substitute discovery using composition-based mapping
- Price comparison across equivalent medicines
- Admin-controlled data management with bulk uploads

## Tech Stack
- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Caching**: Redis
- **Containerization** : Docker, Docker Compose
- **CI/CD** : GitHub Actions

## Performance Improvements (Redis Caching)
To handle a read-heavy load, we implemented a robust Redis caching layer on our search and substitute APIs.


| Endpoint    | Before (DB) | After (Cache) | Improvement |
| ----------- | ----------- | ------------- | ----------- |
| Search      | ~80–200 ms  | ~7–12 ms      | ~85% faster |
| Substitutes | ~120 ms     | ~10–20 ms     | ~80% faster |

<h3>Before Redis (Direct DB Queries)</h3>

<p>
  <img src="docs/images/199ms.png" width="48%" />
  <img src="docs/images/125ms.png" width="48%" />
</p>

<h3>After Redis (Cache Hits)</h3>

<p>
  <img src="docs/images/7ms.png" width="48%" />
  <img src="docs/images/15ms.png" width="48%" />
</p>

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/CodeByAshuu/formulary.git
cd formulary
```

### 2. Setup the Backend
```bash
cd server
npm install
```
- Create a `.env` file in the `server` directory with your Postgres and Redis credentials.
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=formulary_db
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://localhost:6379
JWT_SECRET= your_secret_key
ADMIN_PASSWORD=admin
ADMIN_EMAIL=admin@example.com
```
- Seed the database (if applicable) and start the server:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm run dev
```

---

## How to use Redis (Two Ways)

The application utilizes Redis to cache API responses. You can run Redis locally either by installing it directly or by using Docker.

### Method 1: Using Docker (Recommended)
Running Redis via Docker ensures a clean environment without system-level installations.
1. Ensure Docker is installed and running on your machine.
2. Run the following command to start a Redis container:
   ```bash
   docker run -d --name formulary-redis -p 6379:6379 redis
   ```
3. The server will automatically connect to `redis://localhost:6379`.
4. Open Redis CLI inside container
    ```bash
   docker exec -it formulary-redis redis-cli
   ```
5. Clear Cache (everything)
   ```bash
    FLUSHALL
    ```

### Method 2: Native Redis Server (Windows/Mac/Linux)
1. **Windows**: Install using WSL (Windows Subsystem for Linux) and run:
   ```bash
   sudo apt-get install redis-server
   sudo service redis-server start
   ```
   *Alternatively, download the pre-compiled Windows port of Redis from GitHub.*
2. **Mac**: Use Homebrew:
   ```bash
   brew install redis
   brew services start redis
   ```
3. **Linux**: Use your package manager (e.g., APT):
   ```bash
   sudo apt install redis-server
   sudo systemctl start redis-server
   ```

Once running locally, the application will automatically connect to the default port `6379`.

## Key Features

* High-performance search with indexing
* Redis caching with TTL and invalidation
* Bulk CSV upload for medicines
* Automatic substitute linking using composition
* Secure admin APIs with JWT authentication
* Containerized deployment

---

## CI/CD

* CI pipeline:

  * Linting + dependency install
  * PostgreSQL + Redis service containers
  * Backend smoke test

* CD pipeline:

  * Docker image build
  * Push to GitHub Container Registry (GHCR)

---

## Future Improvements

* Fuzzy search (typo tolerance)
* Advanced filtering (price range, manufacturer)
* Rate limiting
* Observability (logs, metrics)

---

## Author

Sagar Sahu
