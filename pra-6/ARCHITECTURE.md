# Practical 6: Full Stack System Architecture & Flow Specifications

---

## 1. System Architecture Overview

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|                       React 19 SPA (Vite Dev Server)                            |
|                            http://localhost:5173                                |
|                                                                                 |
|  +-------------------+  +---------------------+  +---------------------------+  |
|  | TaskManager.jsx   |  | ConfirmModal.jsx    |  | Toast.jsx (Alerts)        |  |
|  | Form + Board + UI |  | Delete Interceptor  |  | Auto-dismiss Feedback     |  |
|  +---------+---------+  +----------+----------+  +-------------+-------------+  |
|            |                       |                           |                |
|            +-----------------------+---------------------------+                |
|                                    |                                            |
|                        src/services/api.js                                      |
|                 (Centralized HTTP Client Service)                               |
+------------------------------------+--------------------------------------------+
                                     |
                          HTTP / CORS Request
                    Headers: Content-Type: application/json
                                     |
                                     v
+---------------------------------------------------------------------------------+
|                                 SERVER TIER                                     |
|                        Express.js REST API Server                               |
|                            http://localhost:5000                                |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  | Middleware Pipeline:                                                      |  |
|  | 1. cors() -> Injects Access-Control-Allow-Origin: *                      |  |
|  | 2. requestLogger() -> Logs timestamp, HTTP method & URL                   |  |
|  | 3. express.json() -> Parses JSON body into req.body                       |  |
|  | 4. validateContentType -> Guards mutation requests                        |  |
|  | 5. validateObjectId -> Verifies 24-character hex ID                       |  |
|  +-------------------------------------+-------------------------------------+  |
|                                        |                                        |
|  +-------------------------------------+-------------------------------------+  |
|  | REST Controllers & Routes:                                                |  |
|  | - GET    /api/health   -> Backend & DB Status                             |  |
|  | - GET    /tasks        -> Task.find().sort({ createdAt: -1 })             |  |
|  | - GET    /tasks/:id    -> Task.findById(id)                               |  |
|  | - POST   /tasks        -> Task.create(body)                               |  |
|  | - PUT    /tasks/:id    -> Task.findByIdAndUpdate(id, body, { new: true }) |  |
|  | - DELETE /tasks/:id    -> Task.findByIdAndDelete(id)                      |  |
|  +-------------------------------------+-------------------------------------+  |
|                                        |                                        |
|  +-------------------------------------+-------------------------------------+  |
|  | Centralized Error Handler (4 params: err, req, res, next)                 |  |
|  | - Formats Mongoose ValidationErrors & CastErrors into structured JSON    |  |
|  +---------------------------------------------------------------------------+  |
+------------------------------------+--------------------------------------------+
                                     |
                              Mongoose ODM
                                     |
                                     v
+---------------------------------------------------------------------------------+
|                                DATABASE TIER                                    |
|                            MongoDB Database Engine                              |
|                         mongodb://127.0.0.1:27017                               |
|                                                                                 |
|   Database: taskManager                                                         |
|   Collection: tasks                                                             |
+---------------------------------------------------------------------------------+
```

---

## 2. Sequence Diagram: Full CRUD Lifecycle

```
User (Browser)          React (5173)             Express (5000)          MongoDB (27017)
     |                       |                          |                       |
     |--- 1. Open App ------>|                          |                       |
     |                       |--- 2. GET /tasks ------->|                       |
     |                       |                          |--- 3. Task.find() --->|
     |                       |                          |<-- 4. Return Docs ----|
     |                       |<-- 5. Status 200 JSON ---|                       |
     |<-- 6. Render List ----|                          |                       |
     |                       |                          |                       |
     |--- 7. Submit Form --->|                          |                       |
     |<-- 8. Optimistic UI --| (Render temp card)       |                       |
     |                       |--- 9. POST /tasks ------>|                       |
     |                       |    { title, priority }   |--- 10. Task.create()->|
     |                       |                          |<-- 11. Saved Doc -----|
     |                       |<-- 12. 201 Created ------|                       |
     |<-- 13. Update UI & ---| (Replace temp card with  |                       |
     |    Show Toast Alert   |  server document)        |                       |
     |                       |                          |                       |
     |--- 14. Click Delete ->|                          |                       |
     |<-- 15. Confirm Dialog-| (Prompt modal)           |                       |
     |--- 16. Click Confirm->|                          |                       |
     |                       |--- 17. DELETE /tasks/:id>|                       |
     |                       |                          |--- 18. Delete Doc --->|
     |                       |                          |<-- 19. Confirmation --|
     |                       |<-- 20. 200 OK JSON ------|                       |
     |<-- 21. Remove Card & -|                          |                       |
     |    Show Delete Toast  |                          |                       |
```
