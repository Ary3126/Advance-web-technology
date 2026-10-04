# Practical 10: Asynchronous Processing with Event-Driven Architecture

This practical extends the authenticated task API with Node.js's native
`EventEmitter`. Task notifications are decoupled from the HTTP request:
MongoDB saves the task, the API sends the `201` response, and then emits a
`task-created` event. Its listener starts a simulated two-second notification
operation without delaying the response.

## Features

- Dedicated [`events.js`](./backend/events.js) module exporting a `TaskEvents`
  emitter.
- Dedicated [`listeners.js`](./backend/listeners.js) module registering
  `task-created`, `task-deleted`, and `error` listeners.
- `POST /api/tasks` logs the response timestamp and emits `task-created` after
  sending the response.
- The `task-created` listener logs the title, timestamp, assigned user, and a
  completion timestamp after a two-second delay.
- `DELETE /api/tasks/:id` emits `task-deleted` after a successful delete.
- Existing Practical 9 cache behavior is retained.

## Run

```powershell
cd PRA-10\backend
npm install
Copy-Item .env.example .env
# Set a private JWT_SECRET in .env
npm start
```

MongoDB must be running at the `MONGO_URI` configured in `.env`. The default
server URL is `http://localhost:5000`.

Register and log in through the existing auth endpoints, then create a task
with `POST /api/tasks` and an `Authorization: Bearer <token>` header.

## Timestamp demonstration

The console output should show the API line before the notification completion:

```text
[API] Response sent at 2026-10-03T04:20:00.100Z
[Notification] Started for task "Read events" at 2026-10-03T04:20:00.101Z
... client receives HTTP 201 immediately ...
[Notification] Task "Read events" created at 2026-10-03T04:20:00.101Z; assigned user: ...; completed at 2026-10-03T04:20:02.104Z
```

`EventEmitter.emit()` invokes listeners in the same process, but the listener
returns immediately because the slow work is scheduled with `setTimeout`.
Putting the two-second notification directly in the route would keep the
request pending and increase API response time.

EventEmitter is appropriate for this small, single-process teaching example.
It is not a durable queue: events are lost when the process stops, there is no
retry or back-pressure mechanism, and work is not shared across instances.
Production systems handling millions of events should use a durable broker and
separate workers.

## Tests

```powershell
cd PRA-10\backend
npm test
```

The tests verify that emitting an event does not wait for a slow listener and
that the delete event is delivered.
