# ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)
## Course Practical & Assignment Repository

This repository contains all laboratory practicals and assignments for **Advanced Web Development Frameworks (ITUE301)**, covering frontend React single-page architecture, backend Node.js & Express REST APIs, MongoDB database persistence with Mongoose, and complete Full-Stack integration.

---

## 📚 Practical & Assignment Index

| Module / Practical | Title | Technology Stack | Location Directory |
|---|---|---|---|
| **Practical 1** | React Component Architecture & JSX | React 19, Vite, Vanilla CSS | [`pra-1 to 3/`](file:///c:/ary/AWT/pra-1%20to%203) |
| **Practical 2** | React State & Interactive UI Handling | React Hooks (`useState`), Forms | [`pra-1 to 3/`](file:///c:/ary/AWT/pra-1%20to%203) |
| **Practical 3** | Client-Side Routing & REST API Consumption | React Router v6, GitHub API | [`pra-1 to 3/`](file:///c:/ary/AWT/pra-1%20to%203) |
| **Practical 4** | Node.js & Express REST API Architecture | Express 5, Middleware, Error Handling | [`pra-4 to 5/`](file:///c:/ary/AWT/pra-4%20to%205) |
| **Practical 5** | MongoDB Database Integration with Mongoose | MongoDB, Mongoose Schema, CRUD | [`pra-4 to 5/`](file:///c:/ary/AWT/pra-4%20to%205) |
| **Practical 6** | **Full Stack Integration React + Node + MongoDB** | React, Express, MongoDB, CORS | [`pra-6/`](file:///c:/ary/AWT/pra-6) |
| **Week 4 Assignment** | **Richardson Maturity Model Evaluation (Levels 0–3)** | Express, REST Verbs, HATEOAS | [`assignment-w4/`](file:///c:/ary/AWT/assignment-w4) |

---

## ⚡ Highlights

### Practical 6: Full Stack Integration
- **Backend**: Express + Mongoose + CORS on `http://localhost:5000`
- **Frontend**: React + Centralized API Client on `http://localhost:5173`
- **Database**: MongoDB collection `tasks` on `mongodb://127.0.0.1:27017/taskManager`
- **Features**: Optimistic UI, Delete Confirmation Modal, Toast alerts, Search & filters.

### Week 4 Assignment: Richardson Maturity Model
- **Evaluation Report**: [`assignment-w4/MATURITY.md`](file:///c:/ary/AWT/assignment-w4/MATURITY.md) assessing Levels 0 to 3.
- **Demonstration Server**: [`assignment-w4/server.js`](file:///c:/ary/AWT/assignment-w4/server.js) with Level 2 compliance and Level 3 HATEOAS hypermedia links.
- **Automated Test Suite**: [`assignment-w4/test_maturity.js`](file:///c:/ary/AWT/assignment-w4/test_maturity.js) passing **21/21** assertions.

---

## 🚀 Running Any Project Locally

```bash
# Practical 6 Full Stack
npm run dev:pra6-backend   # Express API (Port 5000)
npm run dev:pra6-frontend  # React SPA (Port 5173)

# Week 4 Assignment
node assignment-w4/test_maturity.js
npm run dev:assignment-w4  # Runs on Port 5001
```
