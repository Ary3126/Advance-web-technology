# ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)
## Course Practical & Assignment Repository

[![CI Pipeline](https://github.com/Ary3126/Advance-web-technology/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Ary3126/Advance-web-technology/actions/workflows/ci.yml)

This repository contains all laboratory practicals and assignments for **Advanced Web Development Frameworks (ITUE301)**, covering frontend React single-page architecture, backend Node.js & Express REST APIs, MongoDB database persistence with Mongoose, caching, event-driven architectures, containerization, and automated CI/CD pipelines with GitHub Actions.

---

## 📚 Practical & Assignment Index

| Module / Practical | Title | Technology Stack | Location Directory |
|---|---|---|---|
| **Practical 1** | React Component Architecture & JSX | React 19, Vite, Vanilla CSS | [`pra-1 to 3/`](pra-1%20to%203) |
| **Practical 2** | React State & Interactive UI Handling | React Hooks (`useState`), Forms | [`pra-1 to 3/`](pra-1%20to%203) |
| **Practical 3** | Client-Side Routing & REST API Consumption | React Router v6, GitHub API | [`pra-1 to 3/`](pra-1%20to%203) |
| **Practical 4** | Node.js & Express REST API Architecture | Express 5, Middleware, Error Handling | [`pra-4 to 5/`](pra-4%20to%205) |
| **Practical 5** | MongoDB Database Integration with Mongoose | MongoDB, Mongoose Schema, CRUD | [`pra-4 to 5/`](pra-4%20to%205) |
| **Practical 6** | **Full Stack Integration React + Node + MongoDB** | React, Express, MongoDB, CORS | [`pra-6/`](pra-6) |
| **Week 4 Assignment** | **Richardson Maturity Model Evaluation (Levels 0–3)** | Express, REST Verbs, HATEOAS | [`assignment-w4/`](assignment-w4) |
| **Practical 7** | Advanced Authentication & JWT Security | Express, JWT, Bcrypt | [`PRA-7/`](PRA-7) |
| **Practical 8** | Frontend State Management & Routing | React Router, Context API | [`PRA-8/`](PRA-8) |
| **Practical 9** | API Caching & Performance Optimization | NodeCache, Express, MongoDB | [`PRA-9/`](PRA-9) |
| **Practical 10** | Event-Driven Architecture with EventEmitter | Node.js EventEmitter, Async Tasks | [`PRA-10/`](PRA-10) |
| **Practical 11** | Containerization with Docker Compose | Docker, Compose, Multi-container Stack | [`PRA-11/`](PRA-11) |
| **Practical 12** | **CI/CD Pipeline with GitHub Actions** | GitHub Actions, Jest, Supertest, ESLint | [`PRA-12/`](PRA-12) |

---

## ⚡ Highlights

### Practical 12: CI/CD Pipeline with GitHub Actions
- **Continuous Integration**: Automated workflow `.github/workflows/ci.yml` running on every `push` and `pull_request` targeting `main`.
- **Quality Gates**:
  - **Job 1 (Lint)**: ESLint code style and syntax verification.
  - **Job 2 (Build & Test)**: Node.js 18 environment running automated tests via **Jest** and **Supertest**.
- **Automated Tests**: Validating `GET /tasks` (status 200), `GET /api/health` (status 200), `GET /`, and 404 handlers.
- **Status Badge**: Real-time pipeline status badge reflected in README.
- **Demonstration**: Documented proof of both deliberately broken pipeline (Red X) and corrected pipeline (Green checkmark).

### Practical 11: Containerization with Docker Compose
- Multi-container architecture with separate `frontend`, `backend`, and `mongodb` services networked via `app-network`.

### Practical 6: Full Stack Integration
- **Backend**: Express + Mongoose + CORS on `http://localhost:5000`
- **Frontend**: React + Centralized API Client on `http://localhost:5173`
- **Database**: MongoDB collection `tasks` on `mongodb://127.0.0.1:27017/taskManager`
- **Features**: Optimistic UI, Delete Confirmation Modal, Toast alerts, Search & filters.

### Week 4 Assignment: Richardson Maturity Model
- **Evaluation Report**: [`assignment-w4/MATURITY.md`](assignment-w4/MATURITY.md) assessing Levels 0 to 3.
- **Demonstration Server**: [`assignment-w4/server.js`](assignment-w4/server.js) with Level 2 compliance and Level 3 HATEOAS hypermedia links.
- **Automated Test Suite**: [`assignment-w4/test_maturity.js`](assignment-w4/test_maturity.js) passing **21/21** assertions.

---

## 🚀 Running Any Project Locally

```bash
# Practical 12 (CI/CD Automated Tests & Linter)
npm test                # Run Jest automated test suite
npm run lint            # Run ESLint quality check
npm run test:broken     # Run deliberate failure test demonstration
npm run dev:pra12       # Run Practical 12 API server

# Practical 6 Full Stack
npm run dev:pra6-backend   # Express API (Port 5000)
npm run dev:pra6-frontend  # React SPA (Port 5173)

# Week 4 Assignment
node assignment-w4/test_maturity.js
npm run dev:assignment-w4  # Runs on Port 5001
```
