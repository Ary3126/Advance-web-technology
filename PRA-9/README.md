# Practical 9: In-Memory Caching and Query Optimization

This practical extends the authenticated task API from Practical 7 with
process-local caching using `node-cache`. The backend is self-contained in
this folder.

## Features

- `GET /api/tasks` caches each authenticated user's task list for 60 seconds.
- `GET /api/tasks/:id` uses a separate cache entry for one task.
- Successful `POST`, `PUT`, and `DELETE` operations invalidate affected cache
  entries before returning.
- `X-Cache: HIT` or `X-Cache: MISS` identifies the result source.
- `GET /api/cache/stats` reports hits, misses, invalidations, active keys, and
  the configured TTL.
- Cache keys include the authenticated user ID, preventing cross-user results.

## Run the API

```powershell
cd PRA-9\backend
npm install
Copy-Item .env.example .env
# Set a private JWT_SECRET in .env
npm start
```

MongoDB must be running at the `MONGO_URI` configured in `.env`. The default
server URL is `http://localhost:5000`.

## Endpoint flow

```text
GET /api/tasks
  ├─ cache HIT  -> return cached list immediately
  └─ cache MISS -> query MongoDB -> store list -> return list

POST/PUT/DELETE /api/tasks
  └─ write MongoDB successfully -> invalidate relevant cache entries
```

All task endpoints remain protected by JWT authentication. Register and log
in first, then send `Authorization: Bearer <token>`.

## Measuring response time

Use Postman or Thunder Client with the same authenticated request and dataset.
Restart the server before the first cached reading so the first call is a
miss. Record the request time shown by the client in milliseconds.

| Condition | Reading 1 | Reading 2 | Reading 3 | Average |
| --- | ---: | ---: | ---: | ---: |
| Uncached (`X-Cache: MISS`) | 42 ms | 35 ms | 38 ms | 38.3 ms |
| Cached (`X-Cache: HIT`) | 5 ms | 4 ms | 5 ms | 4.7 ms |

These are sample lab readings; replace them with measurements from the local
MongoDB and machine. A small database can make the difference less visible
because MongoDB may already answer quickly.

The included [Postman collection](./postman_collection.json) contains register,
login, task-read, single-task, and cache-stat requests. For command-line
measurements, copy the JWT from login and run:

```powershell
$env:AUTH_TOKEN = "<token from login>"
cd PRA-9\backend
node benchmark.js
```

The script prints each request's elapsed time and its `X-Cache` status. Repeat
the experiment with the cache lookup disabled only in a temporary local copy
or compare against `X-Cache: MISS` readings; restore caching before committing.

## Analysis

### Why invalidate after every write?

The cached list and single-task response are snapshots. If a task is created,
updated, or deleted without invalidation, a later read can return the old
snapshot until the TTL expires. Invalidating after a successful database write
makes the next request read current data from MongoDB and repopulate the cache.

### Choosing a TTL

Sixty seconds is reasonable for a lab task manager: repeated reads benefit from
the cache while changes become visible within at most one minute even if an
invalidation path is accidentally missed. A longer TTL improves hit rate and
reduces database work but increases the maximum stale-data window. A shorter
TTL improves freshness but reduces the performance benefit.

### Why node-cache is not for multiple server instances

`node-cache` stores data inside one Node.js process. With two server instances,
each instance has different keys and counters, so a write handled by instance A
cannot invalidate instance B's cache. A shared Redis or Memcached deployment is
needed when instances scale horizontally.

### Observed trade-off

The cache is lost whenever the process restarts, which is expected for
in-memory storage. MongoDB remains the source of truth and caching is only a
read optimization.
