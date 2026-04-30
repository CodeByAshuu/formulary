# Formulary - Medicine Substitution Platform

![Formulary Preview](docs/images/image.png)

## Overview & Problem Statement
Healthcare costs are a significant burden for many individuals. A major contributing factor is the lack of transparency regarding cheaper, generic substitute medicines that share the exact same clinical formula as expensive brand-name drugs. 

**Formulary** is a web platform designed to solve this problem. It allows users to search for their prescribed medications and instantly view highly detailed profiles of the drug, alongside a list of cost-effective, chemically identical substitutes. 

## Solution
The application features a "Clinical Atelier" premium UI on the frontend, focusing on a minimal, editorial, and highly readable design. On the backend, it utilizes a robust Node.js, PostgreSQL, and Redis stack to quickly query a vast database of medicines and return price-optimized substitute recommendations in milliseconds.

## Tech Stack
- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Caching**: Redis

## Performance Improvements (Redis Caching)
To handle a read-heavy load, we implemented a robust Redis caching layer on our search and substitute APIs.

**Before Redis (Direct DB Queries):**
- Search Response: ~199ms
  ![Before Redis 1](docs/images/199ms.png)
- Substitute Response: ~125ms
  ![Before Redis 2](docs/images/125ms.png)

**After Redis (Cache Hits):**
- Search Response: ~7ms
  ![After Redis 1](docs/images/7ms.png)
- Substitute Response: ~15ms
  ![After Redis 2](docs/images/15ms.png)

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/formulary.git
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
DATABASE_URL=postgres://user:password@localhost:5432/formulary
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key
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
