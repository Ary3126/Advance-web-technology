/**
 * ============================================================================
 * Practical 6: Automated End-to-End Full-Stack Verification Test Suite
 * ============================================================================
 * Tests:
 * 1. Health Check Endpoint (GET /api/health)
 * 2. CORS Preflight & Response Headers (Access-Control-Allow-Origin)
 * 3. GET /tasks (Fetch task list from MongoDB)
 * 4. POST /tasks (Create new task with validation)
 * 5. GET /tasks/:id (Fetch single task by ObjectId)
 * 6. PUT /tasks/:id (Update task status and title)
 * 7. DELETE /tasks/:id (Delete task by ObjectId)
 * 8. Validation Error Check (Missing title returns 400)
 * 9. CastError Check (Invalid ObjectId returns 400)
 * 10. 404 Route Check (Undefined route returns 404)
 * ============================================================================
 */

const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runFullStackTests() {
  console.log('================================================================');
  console.log(' STARTING PRACTICAL 6 FULL-STACK INTEGRATION TEST SUITE');
  console.log(' Testing Express (localhost:5000) + MongoDB Database');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(` ✅ PASS: ${message}`);
    } else {
      console.error(` ❌ FAIL: ${message}`);
    }
  }

  try {
    // 1. Health Check & DB Status
    console.log('--- TEST 1: Health Check Endpoint ---');
    const res1 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    assert(res1.statusCode === 200, `GET /api/health returned HTTP ${res1.statusCode}`);
    assert(res1.body.status === 'online', `Backend status is '${res1.body.status}'`);
    assert(res1.body.database === 'connected', `MongoDB database connection status is '${res1.body.database}'`);

    // 2. CORS Preflight & Response Headers
    console.log('\n--- TEST 2: CORS Middleware Verification ---');
    const res2 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks',
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST'
      }
    });
    assert(
      res2.headers['access-control-allow-origin'] === '*' ||
      res2.headers['access-control-allow-origin'] === 'http://localhost:5173',
      `CORS Access-Control-Allow-Origin header is present (${res2.headers['access-control-allow-origin']})`
    );

    // 3. GET /tasks (Initial Fetch)
    console.log('\n--- TEST 3: Read All Tasks (GET /tasks) ---');
    const res3 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks',
      method: 'GET'
    });
    assert(res3.statusCode === 200, `GET /tasks returned HTTP ${res3.statusCode}`);
    assert(Array.isArray(res3.body), 'GET /tasks returned an array of task documents');

    // 4. POST /tasks (Create Task)
    console.log('\n--- TEST 4: Create Task (POST /tasks) ---');
    const taskPayload = {
      title: "Integration Test: Wire React to MongoDB",
      description: "Automated test checking full-stack CRUD execution",
      priority: "high",
      completed: false
    };
    const res4 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, taskPayload);

    assert(res4.statusCode === 201, `POST /tasks returned HTTP ${res4.statusCode} (Created)`);
    assert(res4.body._id !== undefined, `Created task has valid MongoDB _id: ${res4.body._id}`);
    assert(res4.body.title === taskPayload.title, `Task title persisted correctly: "${res4.body.title}"`);
    assert(res4.body.priority === 'high', `Task priority persisted correctly: "${res4.body.priority}"`);

    const createdId = res4.body._id;

    // 5. GET /tasks/:id (Read Single Task)
    console.log('\n--- TEST 5: Read Single Task (GET /tasks/:id) ---');
    const res5 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/tasks/${createdId}`,
      method: 'GET'
    });
    assert(res5.statusCode === 200, `GET /tasks/${createdId} returned HTTP ${res5.statusCode}`);
    assert(res5.body._id === createdId, 'Fetched task matches requested ObjectId');

    // 6. PUT /tasks/:id (Update Task)
    console.log('\n--- TEST 6: Update Task (PUT /tasks/:id) ---');
    const res6 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/tasks/${createdId}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: "Integration Test: Completed Wiring React to MongoDB",
      completed: true,
      priority: "medium"
    });
    assert(res6.statusCode === 200, `PUT /tasks/${createdId} returned HTTP ${res6.statusCode}`);
    assert(res6.body.completed === true, 'Task completed status updated to true');
    assert(res6.body.priority === 'medium', 'Task priority updated to medium');

    // 7. DELETE /tasks/:id (Delete Task)
    console.log('\n--- TEST 7: Delete Task (DELETE /tasks/:id) ---');
    const res7 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/tasks/${createdId}`,
      method: 'DELETE'
    });
    assert(res7.statusCode === 200, `DELETE /tasks/${createdId} returned HTTP ${res7.statusCode}`);
    assert(res7.body.task._id === createdId, 'Deleted task matches target ObjectId');

    // Confirm deletion with GET
    const res7Check = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/tasks/${createdId}`,
      method: 'GET'
    });
    assert(res7Check.statusCode === 404, `GET /tasks/${createdId} after deletion returns HTTP 404 (Not Found)`);

    // 8. Error Handling: Missing Required Title (400)
    console.log('\n--- TEST 8: Validation Error Handling ---');
    const res8 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      description: "Task without a title"
    });
    assert(res8.statusCode === 400, `POST /tasks without title returned HTTP ${res8.statusCode} (Bad Request)`);

    // 9. Error Handling: Malformed ObjectId (400)
    console.log('\n--- TEST 9: Malformed ObjectId CastError Handling ---');
    const res9 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks/not-a-valid-hex-id',
      method: 'GET'
    });
    assert(res9.statusCode === 400, `GET /tasks/not-a-valid-hex-id returned HTTP ${res9.statusCode}`);

    // 10. Error Handling: Undefined Route (404)
    console.log('\n--- TEST 10: Undefined Route 404 Handling ---');
    const res10 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/non-existing-endpoint',
      method: 'GET'
    });
    assert(res10.statusCode === 404, `GET /non-existing-endpoint returned HTTP ${res10.statusCode}`);

    console.log('\n================================================================');
    console.log(` TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log('================================================================');

    if (passedTests === totalTests) {
      console.log(' 🎉 ALL FULL-STACK INTEGRATION TESTS PASSED PERFECTLY!\n');
    } else {
      console.log(' ⚠️ Some tests failed. Please review error logs above.\n');
    }
  } catch (error) {
    console.error('Test execution failed with error:', error.message);
  }
}

if (require.main === module) {
  runFullStackTests();
}

module.exports = runFullStackTests;
