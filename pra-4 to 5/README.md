# Practical 4 & 5: Express REST API Architecture & MongoDB Mongoose CRUD Integration

**Course:** ITUE301 - Advanced Web Development Frameworks  
**Author:** Ary Patel  
**Technology Stack:** Node.js (v24), Express 5, MongoDB 7, Mongoose 8  

---

## 📌 Practical Overview

This project unites **Practical 4** and **Practical 5** into a clean, modular RESTful backend:

1. **Practical 4: Express REST Architecture & Middleware**
   - Express 5 application setup with modular routing.
   - Global CORS support and JSON request body parsing.
   - Request logger middleware logging timestamps and HTTP verbs.
   - Custom payload validation middleware (`validateContentType`, `validateTaskPayload`, `validateObjectId`).
   - Centralized error-handling middleware intercepting Mongoose `ValidationError` and `CastError`.

2. **Practical 5: MongoDB & Mongoose CRUD Operations**
   - Mongoose connection setup with fallback support and graceful state detection.
   - Strongly-typed Schemas (`Task` and `User`) with timestamps, enums, and required constraints.
   - Complete CRUD endpoints:
     - **Create:** `POST /tasks` (returns `201 Created` with `Location` header)
     - **Read All:** `GET /tasks` (supports filtering by `priority`, `completed`, and regex `search`)
     - **Read One:** `GET /tasks/:id` (returns `200 OK` or `404 Not Found`)
     - **Update:** `PUT /tasks/:id` (returns `200 OK` with updated document)
     - **Delete:** `DELETE /tasks/:id` (returns `200 OK` with deleted entity)
   - Diagnostic health check endpoint: `GET /api/health`.

---

## 📂 Project Structure

```text
pra-4 to 5/
├── .env.example              # Environment variables template
├── package.json              # Dependencies and execution scripts
├── server.js                 # Express 5 server and route controllers
├── test_api.js               # 10-step automated verification suite
├── middleware/
│   └── validate.js           # Header, payload, and ObjectId validation middleware
├── models/
│   ├── Task.js               # Mongoose Task Schema (title, description, priority, completed)
│   └── User.js               # Mongoose User Schema (name, email, role, timestamps)
└── README.md                 # Detailed documentation and viva guide
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskManager
```

### 3. Start the Server
- **Production mode:**
  ```bash
  npm start
  ```
- **Live-reload development mode:**
  ```bash
  npm run dev
  ```

### 4. Run Automated Tests
```bash
npm test
```
The test suite executes 10 end-to-end assertions verifying health status, HTTP 415 rejection, payload schema validation, ObjectId casting, and full CRUD lifecycle.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API Information and endpoint catalog | `200 OK` |
| `GET` | `/api/health` | Service uptime and MongoDB connection state | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks (filters: `priority`, `completed`, `search`) | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single task by MongoDB ObjectId | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | Create a new task (requires JSON body) | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update an existing task | `200 OK` / `400 Bad Request` |
| `DELETE` | `/tasks/:id` | Delete a task document by ObjectId | `200 OK` / `404 Not Found` |

### Sample JSON Request Body (`POST /tasks`)
```json
{
  "title": "Build Master Web Architecture",
  "description": "Integrate React, Express, MongoDB, and CI/CD pipelines",
  "priority": "high",
  "completed": false
}
```

---

## 🎓 Viva Questions & Key Concepts

1. **What is the difference between a Mongoose Schema and a Model?**
   - A **Schema** defines the structure, data types, validators, and default values of documents in a collection.
   - A **Model** is a compiled wrapper constructed from the schema that provides the direct programming interface to execute database queries (`find`, `create`, `findByIdAndUpdate`, `deleteOne`).

2. **Why use centralized error-handling middleware in Express?**
   - Centralized error handlers keep route controllers clean. By calling `next(error)`, unhandled exceptions automatically route to a single function where errors like `ValidationError`, `CastError`, and `500 Server Error` are formatted into uniform JSON responses.

3. **What is the significance of HTTP Status Code 201 vs 200?**
   - `200 OK` indicates general success for read or update operations.
   - `201 Created` specifically signifies that a new resource was successfully instantiated on the server, often returning the newly generated identifier and a `Location` header.
