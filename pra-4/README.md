# Practical 4: Building a RESTful API with Node.js and Express

## 1. Aim & Objective
* **Aim:** To design and implement a robust RESTful API using Node.js and Express framework with complete CRUD operations, custom middlewares, and centralized global error handling.
* **Objective:**
  1. Set up an Express application server.
  2. Implement an in-memory storage array for managing task resources.
  3. Create custom global logging middleware to trace HTTP requests.
  4. Build CRUD API endpoints (`GET`, `POST`, `PUT`, `DELETE`).
  5. Implement supplementary middleware for `Content-Type` and `Task ID` validation.
  6. Implement a fallback `404` handler for undefined routes.
  7. Implement a centralized global error handler to safely intercept exceptions.

---

## 2. Technologies & Prerequisites
* **Runtime:** Node.js (v18+)
* **Framework:** Express.js (v4/v5)
* **Language:** JavaScript (ES6+)
* **API Testing Tool:** Postman / Thunder Client / cURL
* **Database:** In-memory JavaScript array (No external DB required)

---

## 3. Project Structure
```text
pra-4/
├── server.js          # Core Express server, routes & middleware
├── package.json       # Dependencies and npm scripts
├── test_api.js        # Automated API test suite
└── README.md          # Complete practical documentation & lab report
```

---

## 4. Setup & Installation Instructions

### Step 1: Initialize Project Directory & Dependencies
If starting from scratch in a terminal:
```bash
# 1. Initialize npm project
npm init -y

# 2. Install Express framework
npm install express
```

### Step 2: Start the Server
```bash
# Start server with Node
node server.js

# Or using npm script
npm start
```

The server will start listening on:
```text
http://localhost:5000
```

---

## 5. API Endpoints Specification

| HTTP Method | Endpoint | Description | Request Body (JSON) | Success Status | Error Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Root API documentation | None | `200 OK` | - |
| `GET` | `/tasks` | Retrieve all tasks | None | `200 OK` | `500 Internal Error` |
| `GET` | `/tasks/:id` | Retrieve a task by ID | None | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `POST` | `/tasks` | Create a new task | `{"title": "...", "description": "...", "completed": false}` | `201 Created` | `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update an existing task | `{"title": "...", "description": "...", "completed": true}` | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/tasks/:id` | Delete a task by ID | None | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `GET` | `/error-test` | Test global error handler | None | - | `500 Internal Error` |
| `*` | `/*` | Undefined routes fallback | Any | - | `404 Not Found` |

---

## 6. Detailed Middleware Architecture

1. **Global Request Logger:**
   - Intercepts all requests before route matching.
   - Logs `METHOD URL TIMESTAMP` to console:
     ```javascript
     app.use((req, res, next) => {
       const timestamp = new Date().toISOString();
       console.log(`${req.method} ${req.originalUrl} ${timestamp}`);
       next();
     });
     ```
2. **Body Parser (`express.json()`):**
   - Parses incoming request stream with `application/json` payload into `req.body`.
3. **Content-Type Validator:**
   - Checks that `POST` and `PUT` requests include `Content-Type: application/json`.
4. **Task ID Validator:**
   - Route-specific middleware verifying `req.params.id` is a valid positive integer.
5. **404 Route Handler:**
   - Catches unhandled routes and returns `{ "error": "Route not found" }`.
6. **Centralized Error Handler:**
   - Has 4 parameters `(err, req, res, next)` placed at the very end of the pipeline.
   - Catches errors forwarded by `next(err)` or unhandled exceptions.
   - Logs `err.stack` to server terminal for developer debugging while returning a safe client response `{ "error": "Something went wrong" }`.

---

## 7. Postman / Thunder Client Test Suite

### Test 1: GET All Tasks
* **Method:** `GET`
* **URL:** `http://localhost:5000/tasks`
* **Headers:** None
* **Expected Status:** `200 OK`
* **Sample Response:**
```json
[
  {
    "id": 1,
    "title": "Learn Express",
    "description": "Complete REST API practical",
    "completed": false
  },
  {
    "id": 2,
    "title": "Understand Middleware",
    "description": "Learn global and route-specific middleware in Express",
    "completed": true
  }
]
```

---

### Test 2: POST Create New Task
* **Method:** `POST`
* **URL:** `http://localhost:5000/tasks`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
```json
{
  "title": "Learn Node.js",
  "description": "Practice Express",
  "completed": false
}
```
* **Expected Status:** `201 Created`
* **Sample Response:**
```json
{
  "id": 3,
  "title": "Learn Node.js",
  "description": "Practice Express",
  "completed": false
}
```

---

### Test 3: GET Task by ID
* **Method:** `GET`
* **URL:** `http://localhost:5000/tasks/3`
* **Headers:** None
* **Expected Status:** `200 OK`
* **Sample Response:**
```json
{
  "id": 3,
  "title": "Learn Node.js",
  "description": "Practice Express",
  "completed": false
}
```

---

### Test 4: PUT Update Task
* **Method:** `PUT`
* **URL:** `http://localhost:5000/tasks/3`
* **Headers:** `Content-Type: application/json`
* **Body (raw JSON):**
```json
{
  "title": "Learn Node.js & Express Deeply",
  "completed": true
}
```
* **Expected Status:** `200 OK`
* **Sample Response:**
```json
{
  "id": 3,
  "title": "Learn Node.js & Express Deeply",
  "description": "Practice Express",
  "completed": true
}
```

---

### Test 5: DELETE Task
* **Method:** `DELETE`
* **URL:** `http://localhost:5000/tasks/3`
* **Headers:** None
* **Expected Status:** `200 OK`
* **Sample Response:**
```json
{
  "message": "Task deleted successfully",
  "task": {
    "id": 3,
    "title": "Learn Node.js & Express Deeply",
    "description": "Practice Express",
    "completed": true
  }
}
```

---

### Test 6: GET Non-Existing Task
* **Method:** `GET`
* **URL:** `http://localhost:5000/tasks/999`
* **Headers:** None
* **Expected Status:** `404 Not Found`
* **Sample Response:**
```json
{
  "error": "Task with ID 999 not found"
}
```

---

### Test 7: GET Invalid Task ID (Non-Numeric)
* **Method:** `GET`
* **URL:** `http://localhost:5000/tasks/abc`
* **Headers:** None
* **Expected Status:** `400 Bad Request`
* **Sample Response:**
```json
{
  "error": "Invalid task ID 'abc'. Task ID must be a positive integer."
}
```

---

### Test 8: GET Undefined Route
* **Method:** `GET`
* **URL:** `http://localhost:5000/abc`
* **Headers:** None
* **Expected Status:** `404 Not Found`
* **Sample Response:**
```json
{
  "error": "Route not found"
}
```

---

### Test 9: Missing Content-Type Header on POST
* **Method:** `POST`
* **URL:** `http://localhost:5000/tasks`
* **Headers:** *(Do not set Content-Type header)*
* **Body:** `{"title": "Test without header"}`
* **Expected Status:** `400 Bad Request`
* **Sample Response:**
```json
{
  "error": "Invalid Content-Type. Header 'Content-Type: application/json' is required"
}
```

---

### Test 10: Global Error Handler Trigger
* **Method:** `GET`
* **URL:** `http://localhost:5000/error-test`
* **Headers:** None
* **Expected Status:** `500 Internal Server Error`
* **Server Console:** Logs full stack trace of error
* **Client Response:**
```json
{
  "error": "Something went wrong"
}
```

---

## 8. Automated Testing
Run the automated test script:
```bash
node test_api.js
```

---

## 9. Conclusion
In this practical, a full CRUD RESTful Task Management API was successfully built using Node.js and Express. Custom global logging middleware, route-specific parameter and header validations, safe 404 route handling, and centralized 4-parameter error handling were implemented and thoroughly verified across all normal and edge-case scenarios.
