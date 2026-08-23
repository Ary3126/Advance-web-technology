# ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)
## Practical 6: Viva Voce Questions & Answers

---

### 1. What is the role of the `cors` package in Express?
**Answer**: By default, browsers prevent client JavaScript on one origin (`http://localhost:5173`) from reading responses from a different origin (`http://localhost:5000`) due to the Same-Origin Policy. The `cors` package adds HTTP response headers (such as `Access-Control-Allow-Origin: *`) to inform the browser that cross-origin communication is permitted.

---

### 2. What happens during an HTTP preflight request?
**Answer**: When making a request with custom headers or non-simple methods (`PUT`, `DELETE`, or `POST` with `application/json`), the browser automatically sends an `OPTIONS` request first. The server responds with permitted methods, headers, and origins. If approved, the browser sends the real request.

---

### 3. Why is it beneficial to centralize API requests into a dedicated `api.js` file?
**Answer**:
1. **Single Source of Truth**: The base URL (`http://localhost:5000`) is maintained in one place.
2. **Reusability & Clean Code**: Components don't repeat boilerplate `fetch` and JSON parsing code.
3. **Consistent Error Handling**: Response status verification and JSON error message extraction are centralized.

---

### 4. What is the difference between Optimistic UI and Pessimistic UI?
**Answer**:
- **Pessimistic UI**: The UI waits until the server confirms the change before showing the updated state (displays a spinner while waiting).
- **Optimistic UI**: The UI updates immediately upon user interaction, assuming the request will succeed. If the network request fails, it rolls back the state and alerts the user.

---

### 5. Why do we need a confirmation dialog before deleting a task?
**Answer**: Deleting a record from a database is a destructive, irreversible action. A confirmation modal prevents accidental clicks, improving usability and data protection.

---

### 6. How do you verify that data is truly persisted in MongoDB?
**Answer**:
1. Refreshing the browser: The `useEffect` hook triggers a `GET /tasks` fetch to load data from MongoDB.
2. Inspecting the database directly via `mongosh` or MongoDB Compass.
3. Running automated integration tests that query the API endpoints.

---

### 7. How does the global error handler in Express work?
**Answer**: Express recognizes error-handling middleware by its 4-parameter signature `(err, req, res, next)`. When an error is thrown or passed via `next(err)` inside any controller, Express skips remaining normal middleware and routes, delegating control directly to this handler to format and send a structured JSON error response.
