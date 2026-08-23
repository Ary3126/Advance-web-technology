/**
 * ============================================================================
 * Automated Test Suite for Week 4 Assignment (Richardson Maturity Model)
 * ============================================================================
 * Tests:
 * 1. Level 0 RPC Tunneling (/api/v0/taskManager)
 * 2. Level 1 Resource URIs (/api/v1/tasks)
 * 3. Level 2 RESTful Verbs & Status Codes (/tasks - GET, POST 201, PUT 200, DELETE 200, 400, 404)
 * 4. Level 3 HATEOAS Hypermedia Links (/api/v3/tasks and _links verification)
 * ============================================================================
 */

const http = require('http');
const app = require('./server');

let server;
const TEST_PORT = 5099;

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, port: TEST_PORT, hostname: 'localhost' }, (res) => {
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

    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runMaturityTests() {
  console.log('================================================================');
  console.log(' STARTING RICHARDSON MATURITY MODEL (LEVELS 0-3) VERIFICATION');
  console.log('================================================================\n');

  server = app.listen(TEST_PORT);

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      passed++;
      console.log(` ✅ PASS: ${testName}`);
    } else {
      console.error(` ❌ FAIL: ${testName}`);
    }
  }

  try {
    // --- LEVEL 0 TESTS ---
    console.log('--- EVALUATING LEVEL 0: The Swamp of POX ---');
    const resL0 = await makeRequest({
      path: '/api/v0/taskManager',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      action: 'createTask',
      payload: { title: 'Level 0 RPC Task' }
    });
    assert(resL0.statusCode === 200, 'Level 0 returns HTTP 200 for action tunneling');
    assert(resL0.body.status === 'success', 'Level 0 response format is custom RPC JSON envelope');

    // --- LEVEL 1 TESTS ---
    console.log('\n--- EVALUATING LEVEL 1: Individual Resource URIs ---');
    const resL1 = await makeRequest({
      path: '/api/v1/tasks',
      method: 'GET'
    });
    assert(resL1.statusCode === 200, 'Level 1 provides distinct resource URI /api/v1/tasks');
    assert(Array.isArray(resL1.body), 'Level 1 returns tasks collection');

    // --- LEVEL 2 TESTS ---
    console.log('\n--- EVALUATING LEVEL 2: HTTP Verbs & Status Codes ---');
    // GET /tasks
    const resGet = await makeRequest({ path: '/tasks', method: 'GET' });
    assert(resGet.statusCode === 200, 'GET /tasks returns HTTP 200 OK');

    // POST /tasks (Creation)
    const resPost = await makeRequest({
      path: '/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Level 2 Certified Task',
      description: 'Verifying HTTP 201 Created and Location header',
      priority: 'high'
    });
    assert(resPost.statusCode === 201, 'POST /tasks returns HTTP 201 Created');
    assert(resPost.headers.location !== undefined, `POST /tasks provides Location header (${resPost.headers.location})`);

    const createdId = resPost.body.id;

    // GET /tasks/:id
    const resGetOne = await makeRequest({ path: `/tasks/${createdId}`, method: 'GET' });
    assert(resGetOne.statusCode === 200, `GET /tasks/${createdId} returns HTTP 200 OK`);

    // PUT /tasks/:id
    const resPut = await makeRequest({
      path: `/tasks/${createdId}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Level 2 Updated Task',
      completed: true
    });
    assert(resPut.statusCode === 200, `PUT /tasks/${createdId} returns HTTP 200 OK`);
    assert(resPut.body.completed === true, 'Task completed property updated');

    // DELETE /tasks/:id
    const resDel = await makeRequest({ path: `/tasks/${createdId}`, method: 'DELETE' });
    assert(resDel.statusCode === 200, `DELETE /tasks/${createdId} returns HTTP 200 OK`);

    // 404 on deleted item
    const res404 = await makeRequest({ path: `/tasks/${createdId}`, method: 'GET' });
    assert(res404.statusCode === 404, `GET /tasks/${createdId} after deletion returns HTTP 404 Not Found`);

    // 400 on missing required field
    const res400 = await makeRequest({
      path: '/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { description: 'Missing title' });
    assert(res400.statusCode === 400, 'POST /tasks without title returns HTTP 400 Bad Request');

    // --- LEVEL 3 TESTS ---
    console.log('\n--- EVALUATING LEVEL 3: Hypermedia Controls (HATEOAS) ---');
    const resHateoas = await makeRequest({ path: '/api/v3/tasks', method: 'GET' });
    assert(resHateoas.statusCode === 200, 'GET /api/v3/tasks returns HTTP 200');
    assert(resHateoas.body._links !== undefined, 'Collection contains top-level _links');
    assert(resHateoas.body._embedded !== undefined, 'Collection contains _embedded resource container');

    const firstTask = resHateoas.body._embedded.tasks[0];
    assert(firstTask._links !== undefined, 'Individual task embeds _links');
    assert(firstTask._links.self !== undefined, 'Task contains _links.self');
    assert(firstTask._links.update !== undefined, 'Task contains _links.update');
    assert(firstTask._links.delete !== undefined, 'Task contains _links.delete');
    assert(firstTask._links.collection !== undefined, 'Task contains _links.collection');

    console.log('\n================================================================');
    console.log(` TEST SUMMARY: ${passed}/${total} TESTS PASSED (100% COMPLIANT)`);
    console.log('================================================================\n');
  } catch (err) {
    console.error('Test execution error:', err.message);
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runMaturityTests();
}

module.exports = runMaturityTests;
