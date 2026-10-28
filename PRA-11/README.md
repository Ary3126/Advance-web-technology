# Practical 11: Containerization with Docker Compose

This folder packages the authenticated Practical 10 task application into
three services:

- `frontend`: React/Vite UI served on <http://localhost:5173> (Node 20 image)
- `backend`: Node/Express API on <http://localhost:5000>
- `mongodb`: MongoDB with persistent named volume `mongodb-data`

All services share the `app-network` bridge network. The backend connects to
MongoDB using the Compose service name (`mongodb`), not `localhost`.

## Run the full stack

From this folder:

```powershell
docker compose up --build
```

For local development without Docker, create `backend\.env` from
`backend\.env.example`, keep the local MongoDB URI, and start the API with:

```powershell
cd backend
Copy-Item .env.example .env
npm run dev
```

Open <http://localhost:5173>, register an account, and create a task. The API
health endpoint is available at <http://localhost:5000/api/health>.

To stop the stack:

```powershell
docker compose down
```

The MongoDB data remains in the named volume. Add `-v` to `docker compose down`
only when intentionally removing that persisted data.

## Verify

```powershell
docker compose ps
docker compose logs backend
```

`EXPOSE` documents the port inside an image; the `ports` entries in
`docker-compose.yml` publish those container ports to the host.`
`node_modules` and `.env` files are excluded from every build context.
