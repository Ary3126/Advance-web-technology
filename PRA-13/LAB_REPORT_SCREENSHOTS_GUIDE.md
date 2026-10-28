# Practical 13: Lab Journal & Report Screenshots Guide

This guide details all required screenshots, Postman requests, and terminal outputs for **Practical 13: AI API Integration into a Web Application**.

---

## 📸 Checklist of Screenshots for Lab Journal

| # | Category | Screenshot Name | Source / Tool | Key Element to Highlight |
|---|---|---|---|---|
| **1** | **Frontend** | Task Form with AI Button | Browser (`http://localhost:5174`) | "✨ Generate AI Description" button & disclaimer |
| **2** | **Frontend** | AI Loading State (Supplementary 1) | Browser | Button showing "🤖 Generating AI suggestion..." (disabled) |
| **3** | **Frontend** | Generated Editable Description (Step 5) | Browser | AI response populated into `<textarea>` + Priority |
| **4** | **Frontend** | Human Review & Editing (Step 5) | Browser | User customizing the AI draft before submission |
| **5** | **Frontend** | Graceful Degradation on Failure (Step 6) | Browser ("Simulate AI Failure") | Fallback message displayed without app crash |
| **6** | **Frontend** | Task List with Created Task | Browser | Task article with AI-assisted description & tag |
| **7** | **Postman** | `POST /api/ai/generate-description` Success | Postman / Thunder Client | Status `200 OK` with JSON description |
| **8** | **Postman** | `POST /api/ai/generate-description` Fallback | Postman with header `X-Simulate-AI-Failure` | Status `200 OK` with `fallback: true` |
| **9** | **Postman** | `POST /api/ai/generate-description` Missing Title | Postman with empty `{}` | Status `400 Bad Request` validation message |
| **10**| **Postman** | `GET /api/health` | Postman | Status `200 OK` showing `aiService` status |
| **11**| **Terminal** | Automated Test Execution | VS Code Terminal (`npm run test:pra13`) | 5/5 Jest tests passing in green |

---

## 🌐 1. React Frontend Screenshots

Start both backend and frontend servers:
```powershell
# Terminal 1: Start Backend API (Port 5000)
npm run dev:pra13-backend

# Terminal 2: Start React Frontend (Port 5174)
npm run dev:pra13-frontend
```
Open `http://localhost:5174` in your browser.

---

### Screenshot 1: Task Creation Form & AI Action Bar
* **Action**: Enter a title such as `"Implement user login with OAuth2"` in the Task Title field.
* **Highlight**:
  * The **✨ Generate AI Description** button.
  * The **⚠️ Responsible AI Review** disclaimer.

---

### Screenshot 2: AI Loading State (Supplementary Problem 1)
* **Action**: Click the **✨ Generate AI Description** button.
* **Highlight**:
  * Button text transitions to `🤖 Generating AI suggestion...`.
  * Button and form controls are disabled while waiting for the API response.

---

### Screenshot 3 & 4: Editable Suggestion & Human-in-the-Loop Review (Step 5)
* **Action**: Once the AI generates text, view the description populated in the `<textarea>`.
* **Highlight**:
  * The description is inserted into an **editable textarea** (not static text).
  * The user can freely edit or augment the suggestion before clicking "Add Task".
  * Suggested priority (e.g., `high`, `medium`) is automatically selected.

---

### Screenshot 5: Graceful Degradation on Failure (Step 6 Demonstration)
* **Action**: Click the **Simulate AI Failure** button (or set an invalid API key in `.env`).
* **Highlight**:
  * Notification shows: *"Graceful degradation: Simulated AI API failure. Fallback suggestion provided."*
  * The application does **NOT** crash; it gracefully serves a meaningful contextual fallback draft!

---

## 📬 2. Postman API Outputs

Import [`PRA-13/postman_collection.json`](postman_collection.json) into Postman.

### Screenshot 7: `POST /api/ai/generate-description` (Success Path)
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/ai/generate-description`
* **Headers**: `Content-Type: application/json`
* **Body**:
  ```json
  {
    "title": "Implement JWT Authentication Middleware"
  }
  ```
* **Response Status**: `200 OK`
* **Response Body**:
  ```json
  {
    "success": true,
    "fallback": false,
    "source": "openai-gpt-4o-mini",
    "description": "Develop secure JWT authentication middleware to verify incoming Bearer tokens and protect sensitive API endpoints.",
    "suggestedPriority": "high"
  }
  ```

---

### Screenshot 8: `POST /api/ai/generate-description` (Graceful Fallback Path)
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/ai/generate-description`
* **Headers**:
  * `Content-Type: application/json`
  * `X-Simulate-AI-Failure: true`
* **Body**:
  ```json
  {
    "title": "Fix memory leak in background worker service"
  }
  ```
* **Response Status**: `200 OK`
* **Response Body**:
  ```json
  {
    "success": true,
    "fallback": true,
    "source": "graceful-fallback-simulated",
    "description": "Investigate and resolve the issue regarding \"Fix memory leak in background worker service\". Identify root cause, write regression tests, and verify fix in staging.",
    "suggestedPriority": "high",
    "message": "Graceful degradation: Simulated AI API failure. Fallback suggestion provided."
  }
  ```

---

### Screenshot 9: Validation Error (Missing Title)
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/ai/generate-description`
* **Body**: `{ "title": "" }`
* **Response Status**: `400 Bad Request`
* **Response Body**:
  ```json
  {
    "success": false,
    "message": "Task title is required to generate an AI description."
  }
  ```

---

### Screenshot 10: `GET /api/health`
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/health`
* **Response Status**: `200 OK`
* **Response Body**:
  ```json
  {
    "status": "healthy",
    "uptime": 45.12,
    "database": "connected",
    "aiService": {
      "openaiConfigured": true,
      "geminiConfigured": false,
      "fallbackReady": true
    },
    "timestamp": "2026-10-28T08:00:00.000Z"
  }
  ```

---

## 💻 3. Terminal Execution Screenshot

### Screenshot 11: Automated Jest Test Suite
```powershell
npm run test:pra13
```
* **Expected Output**:
  ```text
  PASS PRA-13/backend/tests/ai.test.js
    Practical 13: AI API Integration & Graceful Degradation Test Suite
      √ POST /api/ai/generate-description returns 400 when title is missing (29 ms)
      √ POST /api/ai/generate-description returns 200 with description and priority (6 ms)
      √ POST /api/ai/generate-description gracefully handles failures and returns fallback: true (3 ms)
      √ GET /api/health returns 200 and AI service status (3 ms)
      √ GET / returns 200 and practical metadata (3 ms)

  Test Suites: 1 passed, 1 total
  Tests:       5 passed, 5 total
  ```
