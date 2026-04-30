# Prompt: Implement Redis Caching in Medicine Alternatives Backend (PERN)

## Context

You are building a backend system (Node.js + Express + PostgreSQL) for a healthcare platform that:

- Allows users to search medicines  
- Fetch substitute medicines  
- Compare prices  

The system is **read-heavy**, meaning:
- Many users will search the same medicines repeatedly  
- Substitute queries will be called frequently  

To improve performance and reduce database load, you must integrate **Redis caching**.

---

## Objective

Implement Redis caching to:

- Reduce response time  
- Minimize repeated database queries  
- Improve scalability  

---

## Tech Stack

- React + TailwindCSS
- Node.js + Express  
- PostgreSQL  
- Redis  

---

## What to Implement

### 1. Redis Setup

- Install Redis client (`redis` npm package)  
- Create a reusable Redis connection module  

Example requirement:
- Single Redis client instance  
- Handle connection errors  
- Export client for reuse  

---

### 2. Caching Strategy

#### Cache these endpoints:

1. **Search Medicines**
   - Endpoint: `/api/medicines/search?q=...`
   - Cache key:
     ```
     search:<query>
     ```

2. **Get Substitutes**
   - Endpoint: `/api/medicines/:id/substitutes`
   - Cache key:
     ```
     substitutes:<medicine_id>
     ```

---

### 3. Cache Flow (IMPORTANT)

For each request:

#### Step 1: Check cache
- If data exists → return cached response  

#### Step 2: If not found
- Query PostgreSQL  
- Store result in Redis  

#### Step 3: Return response  

---

### 4. Cache Expiration

- Set TTL (Time To Live):
  - 60–300 seconds (configurable)

Example:
- Search → 60s  
- Substitutes → 120s  

---

### 5. Cache Invalidation (VERY IMPORTANT)

Whenever admin modifies data:

#### On:
- Add medicine  
- Update medicine  
- Delete medicine  
- Upload CSV  

You must:
- Clear relevant cache OR
- Use pattern-based invalidation  

Example:
Delete keys starting with:
search:*
substitutes:*


---

### 6. Error Handling

- If Redis fails:
  - System should still work using DB  
- Do not crash application  

---

### 7. Code Structure

Organize Redis logic cleanly:

- `/config/redis.js` → connection  
- `/utils/cache.js` → helper functions  
- Use inside services/controllers  

---

## Expected Behavior

- First request → slower (DB hit)  
- Subsequent requests → faster (cache hit)  

---

## Performance Goal

- Reduce repeated DB queries  
- Improve response time for frequent searches  

---

## Constraints

- Do not over-cache everything  
- Only cache read-heavy endpoints  
- Ensure consistency after updates  

---

## Final Objective

Build a caching layer that:

- Improves performance  
- Reduces DB load  
- Maintains correctness after updates  

---

## Key Insight

> Redis is used to optimize **read operations**, not replace your database.