# ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)
## Course Practical & Assignment Repository

[![CI Pipeline](https://github.com/Ary3126/Advance-web-technology/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Ary3126/Advance-web-technology/actions/workflows/ci.yml)

This repository contains all laboratory practicals and assignments for **Advanced Web Development Frameworks (ITUE301)**, covering frontend React single-page architecture, backend Node.js & Express REST APIs, MongoDB persistence with Mongoose, JWT authentication, lazy loading, in-memory caching, asynchronous event-driven architecture, multi-container Docker Compose deployment, automated CI/CD pipelines with GitHub Actions, and applied AI API integration with graceful degradation.

---

## 🌟 Master Unified Platform (All Practicals in One Big Project)

All 13 practicals and the Week 4 Richardson Maturity Model assignment have been fully integrated into a single, cohesive, production-grade application located in [`unified-master/`](./unified-master):

- **Directory:** [`unified-master/`](./unified-master)
- **Frontend:** React 19 + Vite 8 + React Router v7 with route-based lazy loading chunks (Port `5173`)
- **Backend:** Node.js + Express 5 with JWT Auth, Mongoose, node-cache, EventEmitter, and AI proxy (Port `5000`)
- **Database:** MongoDB 7 (`mongodb://127.0.0.1:27017/unifiedAwtHub`)
- **Applied AI:** Google Gemini & OpenAI API proxy with 5 req/min rate limiting and heuristic fallback engine
- **Containerization:** Complete Docker Compose stack with Nginx reverse proxy and persistent volumes
- **Test Suite:** 24/24 automated assertions passing across 6 test suites (`npm run test:master`)

### Quick Start (Master Platform)
```bash
# Option 1: Run with Docker Compose (Practical 11)
docker compose up --build

# Option 2: Run locally with Node
npm run dev:master-backend    # Starts Express API on http://localhost:5000
npm run dev:master-frontend   # Starts React SPA on http://localhost:5173

# Run automated tests
npm run test:master
```

---

## 📚 Practical & Assignment Index

| Module / Practical | Title | Technology Stack | Location Directory |
|---|---|---|---|
| **Master Project** | **Unified AWT Full-Stack Platform** | React 19, Express 5, MongoDB, Docker, JWT, Cache, Events, AI | [`unified-master/`](./unified-master) |
| **Practical 1** | React Component Architecture & JSX | React 19, Vite, Vanilla CSS | [`PRA-1/`](./PRA-1) / [`pra-1 to 3/`](./pra-1%20to%203) |
| **Practical 2** | React State & Interactive UI Handling | React Hooks (`useState`), Controlled Forms | [`pra-1 to 3/`](./pra-1%20to%203) |
| **Practical 3** | Client-Side Routing & REST API Consumption | React Router v7, REST Client | [`pra-1 to 3/`](./pra-1%20to%203) |
| **Practical 4** | Node.js & Express REST API Architecture | Express 5, Middleware Pipelines, Error Handling | [`unified-master/backend`](./unified-master/backend) |
| **Practical 5** | MongoDB Database Integration with Mongoose | MongoDB, Mongoose Schemas & CRUD | [`unified-master/backend`](./unified-master/backend) |
| **Practical 6** | Full Stack Integration (React + Node + Mongo) | React, Express, MongoDB, Optimistic UI, CORS | [`pra-6/`](./pra-6) |
| **Week 4 Assignment** | Richardson Maturity Model Evaluation (Levels 0–3) | Express, REST Verbs, HATEOAS Hypermedia | [`assignment-w4/`](./assignment-w4) |
| **Practical 7** | Authentication & Middleware Pipeline | JWT, bcrypt, Auth Middleware Guards | [`PRA-7/`](./PRA-7) |
| **Practical 8** | Performance Optimization & Lazy Loading | `React.lazy()`, `Suspense`, Code Splitting | [`PRA-8/`](./PRA-8) |
| **Practical 9** | In-Memory Caching & Query Optimization | `node-cache`, TTL, `X-Cache: HIT/MISS` | [`PRA-9/`](./PRA-9) |
| **Practical 10** | Asynchronous Processing with Event-Driven Architecture | Node.js native `EventEmitter`, Decoupled Workers | [`PRA-10/`](./PRA-10) |
| **Practical 11** | Containerization with Docker Compose | Dockerfile, Nginx, Compose, Persistent Volumes | [`PRA-11/`](./PRA-11) |
| **Practical 12** | CI/CD Pipeline with GitHub Actions | GitHub Actions, Jest, Supertest, Lint Quality Gates | [`PRA-12/`](./PRA-12) |
| **Practical 13** | AI API Integration & Graceful Degradation | Gemini / OpenAI, Rate Limiting, Heuristic Fallback | [`PRA-13/`](./PRA-13) |

---

## ⚡ Highlights

### Master Platform Highlights
- **Single Integrated UI**: Explore all 13 practicals in a unified React 19 app with real-time health checks, dark/light theme, and embedded Viva exam guide.
- **AI Task Copilot (Practical 13)**: Backend-protected AI descriptions with 5 req/min rate limiting and resilient graceful degradation fallback.
- **Richardson Maturity Model Playground (Week 4)**: Interactive side-by-side comparison of Levels 0, 1, 2, and 3 HATEOAS with clickable hypermedia links.
- **In-Memory Cache Latency Gauge (Practical 9)**: Process-local `node-cache` serving warm queries in <1ms with instant invalidation.

---

## 🚀 Running Any Practical

```bash
# Unified Master Application (Practicals 1 to 13)
npm run dev:master-backend
npm run dev:master-frontend

# Automated Master Test Suite (24/24 passing)
npm run test:master

# Individual Practical 6 Full Stack
npm run dev:pra6-backend
npm run dev:pra6-frontend

# Individual Practical 10 Event-Driven Backend
npm run dev:pra10

# Practical 11 Containerized Stack
npm run dev:pra11

# Individual Practical 12 CI/CD Backend & Tests
npm run dev:pra12
npm test

# Individual Practical 13 AI Integration
npm run dev:pra13-backend
npm run dev:pra13-frontend
npm run test:pra13
```
