# Formulary Backend

This document outlines the architecture and working logic of the `server/src` directory, which powers the Formulary application. The backend is built on Node.js, Express, PostgreSQL, and Redis.

## Directory Structure

### `controllers/`
The controllers handle incoming HTTP requests, process data, interact with services, and send HTTP responses.
- **`auth.controller.js`**: Manages user registration and login. Interacts with the auth service to validate credentials and issues JWT tokens upon successful authentication.
- **`medicine.controller.js`**: The core controller managing all medicine-related operations. It handles fetching search results, getting medicine details, and fetching substitutes. It also implements **Redis caching** to ensure high-performance read operations. Additionally, it handles admin-only operations (CRUD, bulk uploads) and invalidates caches when data is modified.

### `services/`
The service layer contains the business logic and direct database interactions (PostgreSQL queries).
- **`auth.service.js`**: Contains the logic to create new users in the database and verify passwords against stored hashes using `bcrypt`.
- **`medicine.service.js`**: Executes SQL queries to search for medicines, retrieve specific records, fetch substitutes based on matching formulas, and handle bulk data inserts/updates from CSV files.

### `config/`
- **`redis.js`**: Establishes the connection to the Redis server (or Docker container). It exports the client instance and ensures graceful handling of connection failures without crashing the application.

### `utils/`
- **`cache.js`**: Contains reusable helper functions (`getCache`, `setCache`, `invalidateCache`) that abstract away the raw Redis commands. It includes safety checks so the application seamlessly falls back to PostgreSQL if Redis becomes unavailable.

### `routes/`
- **`auth.routes.js`**: Defines the API endpoints for authentication (`/api/auth/register`, `/api/auth/login`).
- **`medicine.routes.js`**: Defines the API endpoints for medicine retrieval and admin operations, mapping them to the respective controller functions.

### `middleware/`
- Contains middlewares like `rateLimiter.js` for API request throttling and potential authentication/authorization guards for admin routes.

### `index.js`
- The entry point of the server. It configures the Express app, connects to Redis, applies global middlewares (CORS, Morgan, Rate Limiting), and registers the routers.
