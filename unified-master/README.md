# 🚀 Unified AWT Master Platform (ITUE301)
## All Course Practicals (1–13) & Week 4 Assignment in One Containerized Project

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Developer:** Ary Patel ([@Ary3126](https://github.com/Ary3126))  
**Stack:** React 19, Vite 8, Express 5, Node.js, MongoDB 7, Mongoose, JWT, bcrypt, node-cache, EventEmitter, Docker Compose, Nginx, GitHub Actions, OpenAI / Gemini AI APIs.

---

## 🌟 Executive Overview

This master application unites every individual course practical into a single, cohesive, production-grade full-stack platform. Instead of isolated folders, all frontend, backend, security, optimization, continuous integration, and AI capabilities operate simultaneously in a unified architecture.

---

## 📚 Step-by-Step Practical Integration Matrix

| Step / Practical | Curriculum Title | Core Technologies | Live Platform Implementation |
|---|---|---|---|
| **Practical 1** | React Component Architecture & JSX | React 19, Vite, JSX, CSS Variables | Modular component layout (`Header`, `Hero`, `About`, `Skills`, `Footer`) |
| **Practical 2** | React State & Interactive UI Handling | `useState`, controlled forms | Theme switcher (Dark/Light mode), form validation in `/contact` |
| **Practical 3** | Client-Side Routing & REST API | React Router v7, REST fetching | SPA client routing (`/`, `/tasks`, `/hateoas`, `/cache-analytics`, `/event-stream`, `/ai-cicd`) |
| **Practical 4** | Express REST API Architecture | Express 5, middleware, pipelines | Modular router pipelines, JSON validation, and centralized error middleware |
| **Practical 5** | MongoDB Persistence with Mongoose | MongoDB, Mongoose schemas | Task and User schemas with indexing, timestamps, and validation |
| **Practical 6** | Full Stack Integration | CORS, Optimistic UI, Toasts | Real-time health badge, optimistic UI updates, delete confirmation modals |
| **Week 4** | Richardson Maturity Model (0–3) | HTTP Semantics, HATEOAS | Interactive explorer comparing Levels 0, 1, 2, and 3 hypermedia `_links` |
| **Practical 7** | Authentication & Middleware | JWT, bcrypt (10 rounds) | User registration, login, Bearer token auth, and user-scoped task privacy |
| **Practical 8** | Lazy Loading & Performance | `React.lazy()`, `Suspense` | Dynamic route chunking and animated skeleton fallback loaders |
| **Practical 9** | In-Memory Caching & Optimization | `node-cache`, TTL, X-Cache | User-isolated caching, `X-Cache: HIT/MISS` headers, cache stats dashboard |
| **Practical 10** | Event-Driven Architecture | Node.js `EventEmitter` | Decoupled background notification workers (2s simulation) and live event log feed |
| **Practical 11** | Containerization with Docker Compose | Dockerfile, Nginx, Compose | Multi-container stack (Frontend + Backend + MongoDB) with persistent volume |
| **Practical 12** | CI/CD Pipeline with GitHub Actions | GitHub Actions, Jest, Supertest | Linting quality gate (`needs: [lint]`), automated regressions, status badges (`.github/workflows/ci.yml`) |
| **Practical 13** | AI API Integration & Graceful Degradation | Gemini / OpenAI, Rate Limiting | AI task description drafts, 5 req/min rate limiter, and intelligent heuristic fallback engine |

---

## 🏗️ Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                     |
|  - React 19 Single Page App (Vite 8)                                                  |
|  - Route-based Code Splitting (React.lazy + Suspense Fallbacks)                       |
|  - Dark / Light Mode with CSS Variables & Persistent LocalStorage                    |
|  - Centralized API Service with JWT Bearer Token Injection & Error Interception      |
+---------------------------------------------------------------------------------------+
                                        │ (Port 5173 / Port 80 Nginx)
                                        ▼
+---------------------------------------------------------------------------------------+
|                               EXPRESS 5 REST BACKEND                                  |
|                                                                                       |
|  [Middleware Pipeline]                                                                |
|  ├── CORS (Cross-Origin Resource Sharing)                                             |
|  ├── Request Logger (ISO Timestamps & Latency Metrics)                                |
|  ├── Content-Type & Payload Validation                                                |
|  └── JWT Authentication Middleware (Authorization: Bearer <token>)                   |
|                                                                                       |
|  [Modular Routers]                                                                    |
|  ├── /api/auth       -> Register, Login, Current User Profile                         |
|  ├── /api/tasks      -> Task CRUD with In-Memory Caching & Event Emission             |
|  ├── /api/v0 to /v3  -> Richardson Maturity Model (Level 0 RPC to Level 3 HATEOAS)    |
|  ├── /api/cache      -> node-cache Stats & Real-Time Cache Invalidation              |
|  ├── /api/events     -> Asynchronous Event Logs & SSE Live Stream                     |
|  └── /api/practicals -> Complete Curriculum Roadmap & Model Viva Examination Q&A      |
+------------------------------------+--------------------------------------------------+
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
+------------------------------------+   +----------------------------------------------+
|             MONGODB 7              |   |               IN-MEMORY CACHE                |
|  - Users Collection (bcrypt hash)  |   |  - node-cache engine (60s TTL)               |
|  - Tasks Collection (Mongoose ODM) |   |  - Partitioned per User: tasks:all:<userId>  |
|  - Persistent Docker Named Volume  |   |  - Instant Cache Invalidation on Mutations   |
+------------------------------------+   +----------------------------------------------+
```

---

## ⚡ How to Run Locally (Without Docker)

### Prerequisites
- Node.js v18+ (tested on Node 20 / Node 24)
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)

### Quick Start
```bash
# 1. Start the Express Backend (Port 5000)
cd "unified-master/backend"
npm start

# 2. In a second terminal, start the React Frontend (Port 5173)
cd "unified-master/frontend"
npm run dev
```

Open **`http://localhost:5173`** in your browser!

### Running Automated Test Suite
The platform includes an automated end-to-end test suite asserting all 17 requirements:
```bash
cd "unified-master/backend"
npm test
```

---

## 🐳 Containerization with Docker Compose (Practical 11)

The entire full-stack application is containerized with zero local software dependencies beyond Docker:

```bash
# From the unified-master folder (or the root directory):
docker compose up --build
```

### What Docker Compose Launches:
1. **`awt-unified-mongodb`**: Official MongoDB 7 container with persistent named volume `awt-mongo-data` and healthcheck.
2. **`awt-unified-backend`**: Node 20-alpine container running Express 5, connecting to MongoDB via container DNS (`mongodb:27017`).
3. **`awt-unified-frontend`**: Multi-stage build compiling React 19 via Vite and serving production static assets using **Nginx Alpine**, with built-in SPA fallback and `/api/` reverse-proxying.

### Access Endpoints in Docker Mode:
- **Frontend UI:** `http://localhost:5173` or `http://localhost:8080`
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`
- **HATEOAS Hypermedia:** `http://localhost:5000/api/v3/tasks`
- **Cache Statistics:** `http://localhost:5000/api/cache/stats`

To stop the containers:
```bash
docker compose down
```

---

## 🎓 Academic Viva Examination Guide

This platform incorporates a dedicated **"Pra 1–11 Tour"** tab in the UI containing model viva examination questions and answers for each practical milestone:
- **JSX & Virtual DOM Diffing** (Practical 1)
- **Unidirectional Data Flow & State Hooks** (Practical 2)
- **Client-Side vs Server-Side Routing** (Practical 3)
- **Express Middleware Chains & Centralized Error Handling** (Practical 4)
- **Mongoose Validation & ODM Architecture** (Practical 5)
- **Optimistic UI Updates & CORS Mechanism** (Practical 6)
- **Richardson Maturity Model 4 Levels (POX to HATEOAS)** (Week 4 Assignment)
- **JWT Secret Signing vs Asymmetric Hashing** (Practical 7)
- **Bundle Optimization with React.lazy and Code Splitting** (Practical 8)
- **In-Memory Caching Latency & Invalidation Strategies** (Practical 9)
- **Event Loops & Decoupled EventEmitter Workers** (Practical 10)
- **Container Isolation, Docker Compose & Multi-Stage Builds** (Practical 11)

