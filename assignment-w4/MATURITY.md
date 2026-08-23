# ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)
## Week 4 Assignment: Richardson Maturity Model Evaluation

---

### Assignment Overview
- **Course**: Advanced Web Development Frameworks (ITUE301)
- **Module / Week**: Week 4
- **Topic**: Richardson Maturity Model: Evaluating Your REST API
- **CO / PO**: CO2 / PO3
- **Total Marks**: 10 Marks (Passing Threshold: 5 / 10)
- **Student Name**: Ary Patel

---

## 1. Executive Evaluation Table (Richardson Maturity Model Levels 0–3)

| Level | Criterion | Does Our API Satisfy This? | Evidence & Technical Justification |
|---|---|:---:|---|
| **Level 0**<br>*(The Swamp of POX)* | Uses HTTP solely as a transport protocol tunnel via a single URI (e.g. `POST /api`) using RPC-style action parameters, returning `200 OK` for everything. | **Surpassed** *(Satisfied & Exceeded)* | The initial prototype moved beyond single-URI tunneling. In `server.js`, we demonstrate Level 0 via `/api/v0/taskManager` (where actions like `getAllTasks` and `deleteTask` are tunneled in `req.body`), but our main API uses dedicated resource endpoints. |
| **Level 1**<br>*(Individual Resources)* | Exposes dedicated URIs for each individual business entity/resource (e.g., `/tasks` for collection and `/tasks/:id` for specific items). | **Yes** *(Fully Satisfied)* | Our API exposes structured resource paths: `GET /tasks` retrieves all tasks, and `/tasks/:id` addresses individual documents by unique identifier. Each resource has a distinct URI rather than a monolithic endpoint. |
| **Level 2**<br>*(HTTP Verbs & Status Codes)* | Utilizes standard HTTP verbs according to their semantic properties (Safe, Idempotent) and returns accurate HTTP response status codes (`200`, `201`, `400`, `404`, `500`). | **Yes** *(Fully Satisfied)* | <ul><li>`GET /tasks` (Safe, Idempotent) $\rightarrow$ `200 OK`</li><li>`POST /tasks` (Unsafe, Non-Idempotent) $\rightarrow$ `201 Created` with Location header</li><li>`PUT /tasks/:id` (Idempotent update) $\rightarrow$ `200 OK` or `404 Not Found`</li><li>`DELETE /tasks/:id` (Idempotent deletion) $\rightarrow$ `200 OK` / `204` or `404 Not Found`</li><li>Validation failure $\rightarrow$ `400 Bad Request`</li><li>Server errors $\rightarrow$ `500 Internal Server Error`</li></ul> |
| **Level 3**<br>*(Hypermedia Controls - HATEOAS)* | Embeds hypermedia controls (`_links`) within response payloads, enabling clients to dynamically discover possible state transitions and actions. | **Yes** *(Awareness & Implemented in `/api/v3/tasks`)* | Implemented in `server.js` at `/api/v3/tasks` and `/api/v3/tasks/:id`. Responses embed HAL-compliant `_links` (`self`, `update`, `delete`, `toggleComplete`, `collection`) so clients do not hardcode downstream action URIs. |

---

## 2. Endpoint-by-Endpoint REST Compliance Audit

| Endpoint | HTTP Verb | Purpose | Semantic Correctness | Status Code(s) Returned | Level 2 Compliant? |
|---|---|---|---|---|:---:|
| `/tasks` | `GET` | Retrieve list of all tasks | Safe, Read-Only, Idempotent | `200 OK` | ✅ Yes |
| `/tasks/:id` | `GET` | Retrieve a single task by ID | Safe, Read-Only, Idempotent | `200 OK` / `404 Not Found` / `400 Bad Request` | ✅ Yes |
| `/tasks` | `POST` | Create a new task document | Unsafe, Non-Idempotent (Creates new record) | `201 Created` (Success) / `400 Bad Request` (Validation error) | ✅ Yes |
| `/tasks/:id` | `PUT` | Replace/update an existing task | Idempotent (Multiple identical calls yield same state) | `200 OK` (Updated) / `404 Not Found` / `400 Bad Request` | ✅ Yes |
| `/tasks/:id` | `DELETE` | Remove a task document | Idempotent (Deleting same ID repeatedly yields same end state) | `200 OK` / `204 No Content` / `404 Not Found` | ✅ Yes |

---

## 3. Code Improvements & Corrections Made to Achieve Level 2

During the audit of the Practical 4 codebase against Level 2 criteria, the following specific improvements were confirmed and enforced:

1. **Replaced Generic 200 Responses on Creation with HTTP 201**:
   - *Previous Anti-Pattern*: `POST /tasks` returning `res.status(200).json(newTask)`.
   - *Level 2 Fix*: `res.status(201).location('/tasks/' + newTask.id).json(newTask)`.
2. **Explicit Delineation between 400 Bad Request and 404 Not Found**:
   - *Previous Anti-Pattern*: Returning `404 Not Found` when validation failed (e.g. missing `title`).
   - *Level 2 Fix*: Returned `400 Bad Request` for schema/validation errors, reserving `404 Not Found` strictly for non-existent resource IDs.
3. **Eliminated RPC-style Action URIs**:
   - *Previous Anti-Pattern*: `POST /tasks/delete` or `POST /tasks/update`.
   - *Level 2 Fix*: Used standard HTTP verbs against resource URIs (`DELETE /tasks/:id`, `PUT /tasks/:id`).

---

## 4. Level 3: HATEOAS (Hypermedia As The Engine Of Application State) Awareness

In Level 3, the API serves as a state machine where the server guides the client through valid next actions via hypermedia links embedded directly in the JSON response.

### 4.1. Single Task Resource Representation (HAL Format)
```json
{
  "id": "6a8a74bc9ad47674fd130b3d",
  "title": "Complete Practical 6 Full Stack Integration",
  "description": "Connect React 19 to Express and MongoDB",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-08-23T09:40:00.000Z",
  "_links": {
    "self": {
      "href": "/api/v3/tasks/6a8a74bc9ad47674fd130b3d",
      "method": "GET",
      "description": "Fetch current state of this task"
    },
    "update": {
      "href": "/api/v3/tasks/6a8a74bc9ad47674fd130b3d",
      "method": "PUT",
      "description": "Update task fields"
    },
    "delete": {
      "href": "/api/v3/tasks/6a8a74bc9ad47674fd130b3d",
      "method": "DELETE",
      "description": "Permanently delete this task"
    },
    "toggleComplete": {
      "href": "/api/v3/tasks/6a8a74bc9ad47674fd130b3d/toggle",
      "method": "PATCH",
      "description": "Mark task as completed"
    },
    "collection": {
      "href": "/api/v3/tasks",
      "method": "GET",
      "description": "Return to the task list collection"
    }
  }
}
```

### 4.2. Task Collection Representation (Level 3)
```json
{
  "totalCount": 4,
  "_embedded": {
    "tasks": [
      {
        "id": "1",
        "title": "Setup Development Environment",
        "completed": true,
        "_links": {
          "self": { "href": "/api/v3/tasks/1", "method": "GET" },
          "delete": { "href": "/api/v3/tasks/1", "method": "DELETE" }
        }
      }
    ]
  },
  "_links": {
    "self": {
      "href": "/api/v3/tasks",
      "method": "GET"
    },
    "create": {
      "href": "/api/v3/tasks",
      "method": "POST",
      "schema": {
        "title": "string (required)",
        "priority": "low | medium | high"
      }
    }
  }
}
```

---

## 5. Architectural Analysis: Why Most Production APIs Stop at Level 2

While Level 3 (HATEOAS) represents the theoretical pinnacle of REST as envisioned by Roy Fielding, the vast majority of modern production APIs (including GitHub, Stripe, Twitter/X, and AWS) deliberately choose to stop at **Level 2**. The technical and organizational reasons for this include:

1. **Frontend Architecture & Client-Side Routing**:
   Modern single-page applications (built with React, Vue, or Angular) manage their own internal routing tables and UI state machines. Frontends typically construct URLs using typed API client SDKs (or OpenAPI/TypeScript contracts) rather than parsing hypermedia links dynamically on each page render.

2. **Payload Size & Network Overhead**:
   Embedding `_links` metadata inside every single item of large collections (e.g., thousands of paginated records) significantly inflates JSON payload size by 30% to 60%, consuming unnecessary bandwidth and CPU time for serialization.

3. **Tooling & Standardization Ecosystem**:
   Developer tooling (Postman, Swagger/OpenAPI, GraphQL, gRPC, and Axios) is heavily optimized around static endpoint paths and schema contracts rather than dynamic link traversal.

4. **Diminishing Returns on Maintenance**:
   Level 2 already provides 90% of the practical benefits of REST: predictable HTTP caching headers (`ETag`, `Cache-Control`), semantic status codes, uniform CRUD operations, and resource-oriented architecture. The added complexity of maintaining dynamic hypermedia state graphs rarely justifies the engineering cost for internal and microservice APIs.

---

## 6. Conclusion
The evaluated Task Management API satisfies **Level 2 (HTTP Verbs & Status Codes)** of the Richardson Maturity Model, and includes complete reference implementations of **Level 3 (HATEOAS)** hypermedia controls to demonstrate full architectural mastery.
