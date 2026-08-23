# ADVANCED WEB DEVELOPMENT FRAMEWORKS (ITUE301)
## Course Practical Repository

This repository contains all laboratory practicals for **Advanced Web Development Frameworks (ITUE301)**, covering frontend React single-page architecture, backend Node.js & Express REST APIs, MongoDB database persistence with Mongoose, and complete Full-Stack integration.

---

## 📚 Practical Index & Overview

| Practical | Module & Title | Technology Stack | Location Directory |
|---|---|---|---|
| **Practical 1** | React Component Architecture & JSX | React 19, Vite, Vanilla CSS | [`pra-1 to 3/`](file:///c:/ary/AWT/pra-1%20to%203) |
| **Practical 2** | React State & Interactive UI Handling | React Hooks (`useState`), Forms | [`pra-1 to 3/`](file:///c:/ary/AWT/pra-1%20to%203) |
| **Practical 3** | Client-Side Routing & REST API Consumption | React Router v6, GitHub API | [`pra-1 to 3/`](file:///c:/ary/AWT/pra-1%20to%203) |
| **Practical 4** | Node.js & Express REST API Architecture | Express 5, Middleware, Error Handling | [`pra-4 to 5/`](file:///c:/ary/AWT/pra-4%20to%205) |
| **Practical 5** | MongoDB Database Integration with Mongoose | MongoDB, Mongoose Schema, CRUD | [`pra-4 to 5/`](file:///c:/ary/AWT/pra-4%20to%205) |
| **Practical 6** | **Full Stack Integration React + Node + MongoDB** | React, Express, MongoDB, CORS | [`pra-6/`](file:///c:/ary/AWT/pra-6) |

---

## ⚡ Practical 6: Full Stack Integration Highlights
- **Backend**: Express + Mongoose + CORS on `http://localhost:5000`
- **Frontend**: React + Centralized API Client on `http://localhost:5173`
- **Database**: MongoDB collection `tasks` on `mongodb://127.0.0.1:27017/taskManager`
- **Full CRUD Support**: Create, View, Update, Delete with database persistence
- **Supplementary Features**:
  - **Optimistic UI Updates** with automated rollback on server errors
  - **Confirmation Dialog Modal** before deleting tasks
  - **Toast Notification System** for real-time feedback
  - **Real-Time Backend Health Badge**
  - **Category, Status, & Search Filtering**

---

## 🚀 Running Practical 6 Locally

### Option A: Running Backend and Frontend in Separate Terminals
```bash
# Terminal 1: Backend
cd "pra-6/backend"
npm start

# Terminal 2: Frontend
cd "pra-6/frontend"
npm run dev
```

### Option B: Running Automated Full-Stack Test Suite
```bash
node pra-6/test_fullstack.js
```
