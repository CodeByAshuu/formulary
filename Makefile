.PHONY: up down build logs seed ps clean

# ── Start all services (detached)
up:
	docker compose up -d

# ── Build all images without cache
build:
	docker compose build --no-cache

# ── Start and force rebuild
dev:
	docker compose up --build

# ── Stop and remove containers (keep volumes)
down:
	docker compose down

# ── Follow logs for all services
logs:
	docker compose logs -f

# ── Follow logs for a specific service: make logs-server
logs-%:
	docker compose logs -f $*

# ── Show running containers
ps:
	docker compose ps

# ── Run the DB seed script inside the server container 
seed:
	docker compose exec server node src/database/seed.js

# ── Open a psql shell 
psql:
	docker compose exec db psql -U $${DB_USER:-postgres} -d $${DB_NAME:-healthcare_db}

# ── Open a Redis CLI
redis-cli:
	docker compose exec redis redis-cli

# ── Stop containers AND remove named volumes (destructive!)
clean:
	docker compose down -v
	@echo "⚠ All volumes (DB data, Redis data) have been removed."
