# ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)
## Practical 6: Full Stack Integration React + Node.js + MongoDB

---

### Course Information
- **Course**: Advanced Web Development Frameworks (ITUE301)
- **Practical Number**: Practical 6
- **Title**: Full Stack Integration React + Node + MongoDB
- **Course Outcomes (CO)**: CO1, CO2
- **Program Outcomes (PO)**: PO3, PO5

---

## 🎯 Objective
To wire the React frontend (`localhost:5173`) to the Node/Express/MongoDB backend (`localhost:5000`) into a fully functional, robust full-stack application with state synchronization, optimistic UI updates, delete confirmations, and toast alerts.

---

## 🏗️ Architecture & Diagram

```
+-------------------------------------------------------------------------+
|                      React Frontend (localhost:5173)                    |
|                                                                         |
|  - TaskManager UI (Form, Task Board, Stats, Live Health Indicator)     |
|  - Centralized API Client (src/services/api.js)                         |
|  - Optimistic UI Updates & Error Rollback                               |
|  - Confirmation Modal (ConfirmModal.jsx) & Toast Alerts (Toast.jsx)     |
+------------------------------------+------------------------------------+
                                     |
                          HTTP / CORS fetch calls
                                     |
                                     v
+-------------------------------------------------------------------------+
|                      Express Backend (localhost:5000)                   |
|                                                                         |
|  - CORS Middleware: app.use(cors())                                     |
|  - Request Logging & JSON Parser (express.json())                       |
|  - RESTful Endpoints:                                                   |
|      * GET    /api/health       -> Server & Database health status      |
|      * GET    /tasks            -> Retrieve all task documents          |
|      * GET    /tasks/:id        -> Retrieve single task by ObjectId     |
|      * POST   /tasks            -> Create task with Schema validation   |
|      * PUT    /tasks/:id        -> Update task fields & completed flag  |
|      * DELETE /tasks/:id        -> Delete task from database            |
|  - Mongoose Schema Validation & CastError Handler                       |
|  - Centralized Global Error Handler                                     |
+------------------------------------+------------------------------------+
                                     |
                                 Mongoose
                                     |
                                     v
+-------------------------------------------------------------------------+
|                       MongoDB Database (Port 27017)                     |
|                                                                         |
|  - Connection: mongodb://127.0.0.1:27017/taskManager                    |
|  - Collection: tasks                                                    |
|  - Document Schema:                                                     |
|      * _id: ObjectId (24-hex)                                           |
|      * title: String (Required, trimmed)                                |
|      * description: String (Trimmed)                                    |
|      * completed: Boolean (Default: false)                              |
|      * priority: String (Enum: 'low' | 'medium' | 'high')               |
|      * createdAt: Date (Default: Date.now)                              |
+-------------------------------------------------------------------------+
```

---

## ⚡ Execution Flow (End-to-End)
1. **Initial Mount**: React triggers `getTasks()` in `useEffect` $\rightarrow$ Express handles `GET /tasks` $\rightarrow$ Mongoose queries MongoDB `tasks.find()` $\rightarrow$ Tasks array rendered to UI.
2. **Task Creation**: User submits form $\rightarrow$ React applies **Optimistic UI update** (renders item immediately) $\rightarrow$ React sends `POST /tasks` $\rightarrow$ Mongoose validates and saves document $\rightarrow$ React updates optimistic item with confirmed `_id` $\rightarrow$ Toast alert displayed.
3. **Status Toggle**: User clicks checkbox $\rightarrow$ UI toggles state immediately $\rightarrow$ React sends `PUT /tasks/:id` with `{ completed: true/false }` $\rightarrow$ MongoDB document updated $\rightarrow$ If network fails, UI automatically rolls back.
4. **Task Deletion**: User clicks delete $\rightarrow$ `ConfirmModal` prompts user for confirmation $\rightarrow$ On confirmation, React sends `DELETE /tasks/:id` $\rightarrow$ Document deleted from MongoDB $\rightarrow$ Item removed from UI $\rightarrow$ Toast alert confirms deletion.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Community Server running locally on `localhost:27017`

### 1. Run Backend Server
```bash
cd pra-6/backend
npm install
npm start
```
*Backend starts on `http://localhost:5000`.*

### 2. Run Frontend Server
In a second terminal:
```bash
cd pra-6/frontend
npm install
npm run dev
```
*Frontend starts on `http://localhost:5173`.*

### 3. Run Automated Integration Test Suite
```bash
cd pra-6
node test_fullstack.js
```

---

## 📋 REST API Endpoints Summary

| Method | Endpoint | Description | Request Body | Response Status |
|---|---|---|---|---|
| `GET` | `/api/health` | Backend & MongoDB health | None | `200 OK` |
| `GET` | `/tasks` | Get all tasks (sorted newest first) | None | `200 OK` |
| `GET` | `/tasks/:id` | Get single task by ObjectId | None | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | Create new task document | `{ title*, description, priority, completed }` | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update existing task | `{ title, description, priority, completed }` | `200 OK` / `404 Not Found` |
| `DELETE` | `/tasks/:id` | Delete task document | None | `200 OK` / `404 Not Found` |

---

## 🔍 Key Analysis & Viva Questions

### 1. Why is CORS needed on the backend?
Browsers enforce the **Same-Origin Policy (SOP)**. Since the React app runs on `http://localhost:5173` and Express runs on `http://localhost:5000`, they are different origins (different ports). The `cors` middleware adds the `Access-Control-Allow-Origin: *` header to Express HTTP responses, permitting the browser to complete API calls.

### 2. Why update local UI state from backend response instead of assuming success?
Assuming success silently can cause UI-database desynchronization. For instance, if backend validation fails (e.g. invalid title length), the database won't save the task. Updating state based on the verified backend response (or using optimistic UI with error rollback) guarantees that the user only sees persisted data.

### 3. What is the risk of not handling errors on write operations?
If write errors (POST, PUT, DELETE) are unhandled, the user receives no feedback when an action fails. They may assume a task was created or deleted when it was not, leading to data loss and poor user experience.

---

## 🛠️ Troubleshooting Guide

| Symptom | Likely Cause | Solution |
|---|---|---|
| **CORS error in browser console** | `cors` middleware not enabled before routes | Add `const cors = require('cors'); app.use(cors());` in `server.js` |
| **`fetch failed` / `ECONNREFUSED`** | Express backend server is not running | Start backend in a separate terminal using `node server.js` |
| **MongoDB connection error** | MongoDB service (`mongod`) is stopped | Start MongoDB service or launch MongoDB Compass |
| **Task disappears after browser refresh** | State was kept in React memory instead of fetching on mount | Ensure `useEffect` calls `getTasks()` and populates state from MongoDB |
| **Validation failed (HTTP 400)** | Missing `title` or invalid `priority` enum | Ensure `title` is non-empty and priority is `low`, `medium`, or `high` |
