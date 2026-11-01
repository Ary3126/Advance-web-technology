/**
 * Practical 4 & 5 Automated API Verification Suite
 * Tests REST Endpoints, Mongoose CRUD operations, and Custom Middleware Validation.
 */

const assert = require('node:assert');
const http = require('node:http');
const mongoose = require('mongoose');
const app = require('./server');

const TEST_PORT = 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManagerTest';

let server;
let baseUrl;

const runTests = async () => {
  console.log('================================================================');
  console.log(' Practical 4 & 5 REST & Mongoose Verification Suite');
  console.log('================================================================');

  // Connect test database
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
  } catch (err) {
    console.warn(`[Warning] MongoDB not reachable on ${MONGO_URI}: ${err.message}`);
  }

  // Start test server on ephemeral port
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      baseUrl = `http://127.0.0.1:${TEST_PORT}`;
      console.log(`[Test Server] Running on ${baseUrl}\n`);
      resolve();
    });
  });

  let createdTaskId = null;

  try {
    // 1. Health Check
    console.log('TEST 1: GET /api/health should return status 200');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthData = await healthRes.json();
    assert.ok(healthData.status, 'Response should contain status property');
    console.log('  PASS: Health endpoint responded successfully');

    // 2. Reject missing/wrong Content-Type on POST
    console.log('TEST 2: POST /tasks without application/json should return 415');
    const invalidHeaderRes = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'invalid'
    });
    assert.strictEqual(invalidHeaderRes.status, 415);
    console.log('  PASS: Content-Type middleware correctly rejected non-JSON header');

    // 3. Reject invalid payload (missing title)
    console.log('TEST 3: POST /tasks with missing title should return 400');
    const invalidBodyRes = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'No title' })
    });
    assert.strictEqual(invalidBodyRes.status, 400);
    const invalidBodyData = await invalidBodyRes.json();
    assert.ok(invalidBodyData.error, 'Should return error object');
    console.log('  PASS: Payload validation rejected task with missing title');

    // 4. Reject invalid ObjectId format
    console.log('TEST 4: GET /tasks/invalid-id should return 400 Bad Request');
    const badIdRes = await fetch(`${baseUrl}/tasks/invalid-mongo-id-12345`);
    assert.strictEqual(badIdRes.status, 400);
    console.log('  PASS: validateObjectId middleware caught malformed MongoDB ID');

    // 5. Create Task (POST /tasks)
    console.log('TEST 5: POST /tasks with valid payload should return 201 Created');
    const createRes = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Complete Practical 4 & 5 Verification',
        description: 'Demonstrating Express 5 + MongoDB Mongoose CRUD with validation',
        priority: 'high',
        completed: false
      })
    });
    assert.strictEqual(createRes.status, 201);
    const createdTask = await createRes.json();
    assert.ok(createdTask._id, 'Created task must have an _id');
    assert.strictEqual(createdTask.title, 'Complete Practical 4 & 5 Verification');
    assert.strictEqual(createdTask.priority, 'high');
    createdTaskId = createdTask._id;
    console.log(`  PASS: Task created with ID ${createdTaskId}`);

    // 6. Get All Tasks (GET /tasks)
    console.log('TEST 6: GET /tasks should return array containing created task');
    const listRes = await fetch(`${baseUrl}/tasks`);
    assert.strictEqual(listRes.status, 200);
    const tasks = await listRes.json();
    assert.ok(Array.isArray(tasks), 'Expected array of tasks');
    const found = tasks.find((t) => t._id === createdTaskId);
    assert.ok(found, 'Created task must be in the list');
    console.log(`  PASS: Retrieved list with ${tasks.length} task(s)`);

    // 7. Get Single Task (GET /tasks/:id)
    console.log('TEST 7: GET /tasks/:id should return single task');
    const getRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`);
    assert.strictEqual(getRes.status, 200);
    const singleTask = await getRes.json();
    assert.strictEqual(singleTask._id, createdTaskId);
    console.log('  PASS: Successfully retrieved task by ObjectId');

    // 8. Update Task (PUT /tasks/:id)
    console.log('TEST 8: PUT /tasks/:id should update status to completed');
    const updateRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: true,
        priority: 'low'
      })
    });
    assert.strictEqual(updateRes.status, 200);
    const updatedTask = await updateRes.json();
    assert.strictEqual(updatedTask.completed, true);
    assert.strictEqual(updatedTask.priority, 'low');
    console.log('  PASS: Task updated successfully');

    // 9. Delete Task (DELETE /tasks/:id)
    console.log('TEST 9: DELETE /tasks/:id should delete task');
    const deleteRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(deleteRes.status, 200);
    console.log('  PASS: Task deleted successfully');

    // 10. Verify Deletion (GET /tasks/:id -> 404)
    console.log('TEST 10: GET /tasks/:id on deleted task should return 404');
    const afterDeleteRes = await fetch(`${baseUrl}/tasks/${createdTaskId}`);
    assert.strictEqual(afterDeleteRes.status, 404);
    console.log('  PASS: Deleted task properly returns 404 Not Found');

    console.log('\n================================================================');
    console.log(' ALL 10 TESTS PASSED SUCCESSFULLY! (Practical 4 & 5 Verified)');
    console.log('================================================================');
  } catch (err) {
    console.error('\n Test Failure:', err.message);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

runTests();
