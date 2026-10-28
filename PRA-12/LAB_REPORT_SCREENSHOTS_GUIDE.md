# Practical 12: Lab Journal & Report Screenshots Guide

This guide details all required and recommended screenshots, terminal logs, and Postman API outputs to include in your **Practical 12 Lab Report / Journal**.

---

## 📸 Summary of Required Screenshots

| # | Category | Screenshot Name | Source / Tool | Key Element to Highlight |
|---|---|---|---|---|
| **1** | **CI/CD** | GitHub Actions Pipeline Overview | GitHub Web UI (`Actions` Tab) | Green checkmark on `pra-12 complete` |
| **2** | **CI/CD** | Passing Pipeline Run Details | GitHub Web UI (`ci.yml` run) | Both jobs passed: `Lint` & `Build & Tests` |
| **3** | **CI/CD** | Automated Test Step Passing Log | GitHub Actions Step Log | `PASS PRA-12/tests/tasks.test.js (4 passed)` |
| **4** | **CI/CD** | Deliberately Broken Pipeline (Red X) | GitHub Web UI / Terminal | Red X failure: `Expected 500, Received 200` |
| **5** | **CI/CD** | README Status Badge | GitHub Repository Main Page | `build passing` status badge |
| **6** | **Terminal** | Local Test & Lint Execution | VS Code Terminal / PowerShell | `npm run lint` and `npm test` exit code 0 |
| **7** | **API** | Postman `GET /tasks` | Postman / Thunder Client | Status `200 OK` with JSON tasks list |
| **8** | **API** | Postman `GET /api/health` | Postman / Thunder Client | Status `200 OK` with `status: "healthy"` |
| **9** | **API** | Postman `GET /` | Postman / Thunder Client | Status `200 OK` with API Documentation |

---

## 1️⃣ GitHub Actions CI/CD Screenshots (Primary Deliverables)

### Screenshot 1: GitHub Actions Overview
- **Where to capture**: Visit your repository on GitHub:  
  `https://github.com/Ary3126/Advance-web-technology/actions`
- **What it shows**:
  - Workflow Name: **CI Pipeline**
  - Commit message: `pra-12 complete: CI/CD Pipeline with GitHub Actions and Automated Testing`
  - Status: Green checkmark (Passed)
  - Execution duration (e.g., `38s`)

---

### Screenshot 2: Passing Pipeline Run Details (Multi-Job Workflow)
- **Where to capture**: Click on the latest workflow run on GitHub Actions.
- **What it shows**:
  - The job dependency graph showing both sequential jobs:
    1. `Lint Code (ESLint)` &mdash; Status: Passed (Green checkmark)
    2. `Build & Automated Tests` &mdash; Status: Passed (Green checkmark)
  - Demonstrates fulfillment of **Supplementary Problem 1** (ESLint job runs before test job).

---

### Screenshot 3: Passing Test Step Logs in GitHub Actions
- **Where to capture**: Inside the `Build & Automated Tests` job, click and expand the step **Run automated tests (npm test)**.
- **Log content to highlight**:
  ```text
  PASS PRA-12/tests/tasks.test.js
    Task Management API - CI/CD Automated Test Suite
      √ GET /tasks returns 200 (31 ms)
      √ GET /api/health returns 200 and healthy status (7 ms)
      √ GET / returns 200 with practical details (5 ms)
      √ GET /api/nonexistent returns 404 status code (5 ms)

  Test Suites: 1 passed, 1 total
  Tests:       4 passed, 4 total
  ```

---

### Screenshot 4: Deliberately Broken Pipeline Run (Step 5 Demonstration)
- **Where to capture**:
  - **Option A (GitHub Actions)**: If pushed with `toBe(500)`, the workflow run showing a Red ❌ on step `npm test`.
  - **Option B (VS Code Terminal)**: The output of running `npm run test:broken`:
- **Log content to highlight**:
  ```text
  FAIL PRA-12/tests/broken.test.sample.js
    ● [DEMO ONLY] Deliberately Broken Test Case › DELIBERATELY BROKEN: Expects status 500 but GET /tasks returns 200

      expect(received).toBe(expected) // Object.is equality

      Expected: 500
      Received: 200

        35 |     // Expected: 500
        36 |     // Received: 200
      > 37 |     expect(res.statusCode).toBe(500);
           |                            ^
  ```

---

### Screenshot 5: Status Badge in README
- **Where to capture**: GitHub repository root page (`https://github.com/Ary3126/Advance-web-technology`).
- **What it shows**:
  - The CI Pipeline badge embedded at the top of the `README.md`:
  - `[![CI Pipeline](https://github.com/Ary3126/Advance-web-technology/actions/workflows/ci.yml/badge.svg?branch=main)]`

---

## 2️⃣ Terminal / VS Code Screenshots

### Screenshot 6: Terminal Test & Lint Execution
- **Command**:
  ```powershell
  npm run lint
  npm test
  ```
- **What it shows**:
  - ESLint checks passing with zero warnings or errors.
  - Jest executing 4 test suites and passing all 4 assertions.

---

## 3️⃣ Postman API Outputs & Screenshots

To capture Postman screenshots:
1. Start the server in terminal:
   ```powershell
   npm run dev:pra12
   ```
2. Import [`PRA-12/postman_collection.json`](postman_collection.json) into Postman.
3. Send requests and screenshot the responses below:

---

### Screenshot 7: `GET http://localhost:5000/tasks`
- **Method**: `GET`
- **URL**: `http://localhost:5000/tasks`
- **Expected Status**: `200 OK`
- **Response Body (JSON)**:
  ```json
  {
    "success": true,
    "message": "Tasks retrieved successfully (Practical 12 CI/CD)",
    "count": 3,
    "tasks": [
      {
        "id": "1",
        "title": "Setup GitHub Actions CI pipeline",
        "completed": true,
        "priority": "high"
      },
      {
        "id": "2",
        "title": "Write automated Jest & Supertest tests",
        "completed": true,
        "priority": "medium"
      },
      {
        "id": "3",
        "title": "Validate pipeline pass/fail and status badge",
        "completed": false,
        "priority": "high"
      }
    ]
  }
  ```

---

### Screenshot 8: `GET http://localhost:5000/api/health`
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/health`
- **Expected Status**: `200 OK`
- **Response Body (JSON)**:
  ```json
  {
    "status": "healthy",
    "uptime": 14.823,
    "database": "disconnected",
    "timestamp": "2026-10-28T07:25:00.000Z"
  }
  ```

---

### Screenshot 9: `GET http://localhost:5000/`
- **Method**: `GET`
- **URL**: `http://localhost:5000/`
- **Expected Status**: `200 OK`
- **Response Body (JSON)**:
  ```json
  {
    "practical": "Practical 12: CI/CD Pipeline with GitHub Actions",
    "status": "online",
    "ci": "active",
    "database": "Disconnected",
    "endpoints": {
      "root": "GET /",
      "tasks": "GET /tasks",
      "health": "GET /api/health",
      "register": "POST /api/auth/register",
      "login": "POST /api/auth/login",
      "me": "GET /api/auth/me",
      "getTasks": "GET /api/tasks",
      "getTask": "GET /api/tasks/:id",
      "createTask": "POST /api/tasks",
      "updateTask": "PUT /api/tasks/:id",
      "deleteTask": "DELETE /api/tasks/:id",
      "cacheStats": "GET /api/cache/stats"
    }
  }
  ```

