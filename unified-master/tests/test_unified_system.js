/**
 * ============================================================================
 * UNIFIED AWT MASTER PLATFORM - AUTOMATED SYSTEM VERIFICATION SUITE
 * ============================================================================
 * Tests all integrated practicals (1 through 11 + Week 4 Richardson Model):
 * - Server Health & MongoDB Connection
 * - JWT Registration, Login, and Protected Me Route (Practical 7)
 * - Task Management CRUD (Practicals 4, 5, 6)
 * - In-Memory Caching with X-Cache HIT/MISS (Practical 9)
 * - Event-Driven Asynchronous Processing (Practical 10)
 * - Richardson Maturity Model Levels 0, 1, 2, 3 HATEOAS (Week 4 Assignment)
 * - Practical Navigator Metadata Listing
 * ============================================================================
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('../backend/node_modules/mongoose');
const { startServer } = require('../backend/server');

const BASE_URL = 'http://localhost:5000';
let serverInstance;
let authToken = '';
let testUserId = '';
let createdTaskId = '';
const uniqueEmail = `ary_test_${Date.now()}@example.com`;

before(async () => {
  serverInstance = await startServer();
});

after(async () => {
  // Allow any pending setTimeout (2s async simulation) to complete
  await new Promise(r => setTimeout(r, 2200));
  if (serverInstance && serverInstance.close) {
    serverInstance.close();
  }
  await mongoose.connection.close();
});

describe('1. System Health & Platform Metadata', () => {
  test('GET /api/health should return online status and connected database', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.database, 'connected');
    assert.strictEqual(body.cache.status, 'active');
  });

  test('GET /api/practicals should return metadata for all 11 practicals', async () => {
    const res = await fetch(`${BASE_URL}/api/practicals`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.ok(body.length >= 11);
  });
});

describe('2. Practical 7: Authentication Pipeline (JWT & bcrypt)', () => {
  test('POST /api/auth/register should create a new user and return JWT token', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ary Patel',
        email: uniqueEmail,
        password: 'Password123!',
        role: 'student'
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.token, 'Should return a JWT token');
    assert.strictEqual(data.user.email, uniqueEmail.toLowerCase());
    authToken = data.token;
    testUserId = data.user.id;
  });

  test('POST /api/auth/login should authenticate user and issue token', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'Password123!'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.token);
    authToken = data.token;
  });

  test('GET /api/auth/me should return current user profile with valid JWT', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.email, uniqueEmail.toLowerCase());
  });

  test('GET /api/auth/me should reject request without token (401)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    assert.strictEqual(res.status, 401);
  });
});

describe('3. Practicals 4, 5, 6, 9, 10: Tasks, Caching & Events', () => {
  test('POST /api/tasks should create a task, invalidate cache, and emit event', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Master Project Milestone',
        description: 'Complete full stack containerization',
        priority: 'high',
        category: 'DevOps'
      })
    });

    assert.strictEqual(res.status, 201);
    const task = await res.json();
    assert.strictEqual(task.title, 'Master Project Milestone');
    assert.strictEqual(task.priority, 'high');
    createdTaskId = task._id;
  });

  test('GET /api/tasks first fetch should be X-Cache: MISS', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('x-cache'), 'MISS');
  });

  test('GET /api/tasks second fetch should be X-Cache: HIT (Practical 9 Caching)', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('x-cache'), 'HIT');
  });

  test('GET /api/cache/stats should report hits and active keys', async () => {
    const res = await fetch(`${BASE_URL}/api/cache/stats`);
    assert.strictEqual(res.status, 200);
    const stats = await res.json();
    assert.ok(stats.hits > 0);
    assert.ok(stats.activeKeysCount > 0);
  });

  test('GET /api/events/logs should include recent background event logs (Practical 10)', async () => {
    const res = await fetch(`${BASE_URL}/api/events/logs`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.events));
    assert.ok(data.events.some(e => e.type === 'task-created'));
  });

  test('PUT /api/tasks/:id should update task and invalidate cache', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        completed: true,
        priority: 'medium'
      })
    });

    assert.strictEqual(res.status, 200);
    const updated = await res.json();
    assert.strictEqual(updated.completed, true);
    assert.strictEqual(updated.priority, 'medium');
  });

  test('DELETE /api/tasks/:id should delete task and emit task-deleted', async () => {
    const res = await fetch(`${BASE_URL}/api/tasks/${createdTaskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
  });
});

describe('4. Week 4 Assignment: Richardson Maturity Model (Levels 0–3)', () => {
  test('Level 0: POST /api/v0/taskManager RPC action should return 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/api/v0/taskManager`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getAllTasks' })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'success');
  });

  test('Level 1: GET /api/v1/tasks should return resource list', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tasks`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
  });

  test('Level 2: POST /api/v2/tasks should return 201 Created and Location header', async () => {
    const res = await fetch(`${BASE_URL}/api/v2/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Level 2 Compliance Task',
        priority: 'high'
      })
    });
    assert.strictEqual(res.status, 201);
    assert.ok(res.headers.get('location'));
  });

  test('Level 3: GET /api/v3/tasks should return HATEOAS hypermedia _links', async () => {
    const res = await fetch(`${BASE_URL}/api/v3/tasks`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body._links);
    assert.ok(body._links.self);
    assert.ok(body._embedded);
    assert.ok(body._embedded.tasks[0]._links);
    assert.ok(body._embedded.tasks[0]._links.self);
    assert.ok(body._embedded.tasks[0]._links.update);
  });
});

describe('5. Practical 12: CI/CD Pipeline & Automated Regression', () => {
  test('GET /tasks?ci=true should return wrapped tasks payload for CI validation', async () => {
    const res = await fetch(`${BASE_URL}/tasks?ci=true`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.tasks));
  });

  test('GET /api/health should report CI pipeline configuration', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.ciPipeline);
    assert.strictEqual(data.ciPipeline.status, 'configured');
  });

  test('GET / should report Practical 12 metadata and active CI', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.practical.includes('Practical 12'));
    assert.strictEqual(data.ci, 'active');
  });
});

describe('6. Practical 13: AI API Integration & Graceful Degradation', () => {
  test('POST /api/ai/generate-description should return 400 when title is missing', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes('Task title is required'));
  });

  test('POST /api/ai/generate-description should return 200 with actionable description', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Implement JWT refresh token rotation' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(typeof data.description === 'string');
    assert.ok(data.description.length > 10);
    assert.ok(['low', 'medium', 'high'].includes(data.suggestedPriority));
  });

  test('POST /api/ai/generate-description with simulated failure should gracefully fall back', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/generate-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-simulate-ai-failure': 'true'
      },
      body: JSON.stringify({ title: 'Fix critical database deadlock bug' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.fallback, true);
    assert.strictEqual(data.source, 'graceful-fallback-simulated');
    assert.strictEqual(data.suggestedPriority, 'high');
  });

  test('GET /api/ai/status should report fallback readiness and rate limit policy', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/status`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.fallbackReady, true);
    assert.ok(data.providers);
  });
});
