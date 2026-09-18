# Practical 7: Authentication and Middleware Pipeline

This folder contains a working Express + MongoDB backend for JWT authentication and protected task routes.

## Folder structure

- `backend/` — Node.js REST API
- `backend/server.js` — main server entry point
- `backend/models/` — Mongoose schemas
- `backend/middleware/` — auth and validation layers

## Commands

```bash
cd PRA-7/backend
npm install
cp .env.example .env
npm start
```

## Default endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

> Add `Authorization: Bearer <token>` header to access protected routes.
