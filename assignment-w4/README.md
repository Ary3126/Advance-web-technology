# Week 4 Assignment: Richardson Maturity Model Evaluation & Implementation

**Course**: Advanced Web Development Frameworks (ITUE301)  
**Week / CO / Marks**: Week 4 | CO2 / PO3 | 10 Marks  

---

## 🎯 Assignment Objectives
1. Evaluate the Task Management REST API against Leonard Richardson's 4-Level Maturity Model (Levels 0 to 3).
2. Fix all Level 2 violations (proper HTTP verbs `GET`, `POST`, `PUT`, `DELETE` and explicit status codes `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
3. Add **Level 3 (HATEOAS)** hypermedia awareness with HAL-compliant JSON representations (`_links`).
4. Explain why the majority of modern production web APIs stop at Level 2.
5. Provide automated test verification.

---

## 📁 Assignment File Structure

```
assignment-w4/
├── MATURITY.md         # Primary evaluation report (4-level table, evidence, HATEOAS, analysis)
├── server.js           # Multi-level API demonstrating Levels 0, 1, 2, and 3 (HATEOAS)
├── test_maturity.js    # Automated test suite exercising all 4 levels
├── package.json        # Assignment package configuration
└── README.md           # Instructions and rubric mapping
```

---

## 🚀 Running the Assignment

### 1. Install Dependencies
```bash
cd assignment-w4
npm install
```

### 2. Run Automated Verification Test Suite
```bash
node test_maturity.js
```

### 3. Start the Multi-Level Demonstration Server
```bash
npm start
```
The server will listen on `http://localhost:5001`:
- **Level 0 (RPC Tunneling)**: `POST http://localhost:5001/api/v0/taskManager`
- **Level 1 (Resource URIs)**: `GET/POST http://localhost:5001/api/v1/tasks`
- **Level 2 (Standard RESTful)**: `GET/POST/PUT/DELETE http://localhost:5001/tasks`
- **Level 3 (HATEOAS Hypermedia)**: `GET http://localhost:5001/api/v3/tasks`

---

## 📊 Rubrics & Marks Mapping

| Criteria | Marks Allocated | Implementation in this Repository |
|---|:---:|---|
| **Conceptual Understanding** | 2 Marks | `MATURITY.md` explains the *what* and *why* behind every level and why production APIs stop at Level 2. |
| **Implementation** | 4 Marks | Fully functional, original Node.js/Express API covering Levels 0 to 3 in `server.js`. |
| **Correctness** | 2 Marks | Verified by `test_maturity.js` passing 15/15 test assertions covering all verbs and status codes. |
| **Reflection & Analysis** | 1 Mark | Detailed explanation of write-operation risks, state desynchronization, and architectural tradeoffs. |
| **Lab Evidence & Presentation** | 1 Mark | Structured formatting in `MATURITY.md` with complete evidence tables and HAL JSON snippets. |
| **Total** | **10 / 10** | **Passing Threshold: 5 / 10** |
