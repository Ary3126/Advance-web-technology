// Automated verification script for Practical 4 Task Management API
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

async function runTests() {
  console.log('--- STARTING PRACTICAL 4 API VERIFICATION TESTS ---\n');

  try {
    // 1. GET all tasks
    console.log('Test 1: GET /tasks');
    const res1 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks',
      method: 'GET'
    });
    console.log(`Status: ${res1.statusCode} (Expected: 200)`);
    console.log('Response:', JSON.stringify(res1.body, null, 2), '\n');

    // 2. POST a new task
    console.log('Test 2: POST /tasks (Valid JSON)');
    const res2 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: "Learn Node.js",
      description: "Practice Express",
      completed: false
    });
    console.log(`Status: ${res2.statusCode} (Expected: 201)`);
    console.log('Response:', JSON.stringify(res2.body, null, 2), '\n');

    // 3. GET specific task
    console.log('Test 3: GET /tasks/3');
    const res3 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks/3',
      method: 'GET'
    });
    console.log(`Status: ${res3.statusCode} (Expected: 200)`);
    console.log('Response:', JSON.stringify(res3.body, null, 2), '\n');

    // 4. PUT /tasks/:id
    console.log('Test 4: PUT /tasks/3 (Update task)');
    const res4 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks/3',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: "Learn Node.js & Express Deeply",
      completed: true
    });
    console.log(`Status: ${res4.statusCode} (Expected: 200)`);
    console.log('Response:', JSON.stringify(res4.body, null, 2), '\n');

    // 5. DELETE /tasks/:id
    console.log('Test 5: DELETE /tasks/3');
    const res5 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks/3',
      method: 'DELETE'
    });
    console.log(`Status: ${res5.statusCode} (Expected: 200)`);
    console.log('Response:', JSON.stringify(res5.body, null, 2), '\n');

    // 6. Request non-existing task
    console.log('Test 6: GET /tasks/999 (Non-existing)');
    const res6 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks/999',
      method: 'GET'
    });
    console.log(`Status: ${res6.statusCode} (Expected: 404)`);
    console.log('Response:', JSON.stringify(res6.body, null, 2), '\n');

    // 7. Request invalid task ID
    console.log('Test 7: GET /tasks/abc (Invalid ID format)');
    const res7 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks/abc',
      method: 'GET'
    });
    console.log(`Status: ${res7.statusCode} (Expected: 400)`);
    console.log('Response:', JSON.stringify(res7.body, null, 2), '\n');

    // 8. Request undefined route
    console.log('Test 8: GET /abc (Undefined route)');
    const res8 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/abc',
      method: 'GET'
    });
    console.log(`Status: ${res8.statusCode} (Expected: 404)`);
    console.log('Response:', JSON.stringify(res8.body, null, 2), '\n');

    // 9. Test missing Content-Type
    console.log('Test 9: POST /tasks (Missing Content-Type header)');
    const res9 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/tasks',
      method: 'POST'
    }, JSON.stringify({ title: "No Header Task" }));
    console.log(`Status: ${res9.statusCode} (Expected: 400)`);
    console.log('Response:', JSON.stringify(res9.body, null, 2), '\n');

    // 10. Test global error handler
    console.log('Test 10: GET /error-test (Simulated Server Error)');
    const res10 = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/error-test',
      method: 'GET'
    });
    console.log(`Status: ${res10.statusCode} (Expected: 500)`);
    console.log('Response:', JSON.stringify(res10.body, null, 2), '\n');

    console.log('--- ALL 10 TESTS EXECUTED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
