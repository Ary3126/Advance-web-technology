/**
 * Practical 12: Deliberately Broken Test Example
 * 
 * Lab Session Step 5:
 * "Deliberately break the test (change an expected value) and push again
 *  observe the red X / failed status."
 * 
 * To demonstrate a failed pipeline run in GitHub Actions:
 * 1. Open 'PRA-12/tests/tasks.test.js'
 * 2. Change the expected status code in Test 1 from:
 *      expect(res.statusCode).toBe(200);
 *    to:
 *      expect(res.statusCode).toBe(500); // Or toBe(201)
 * 3. Commit and push to main:
 *      git add PRA-12/tests/tasks.test.js
 *      git commit -m "ci: deliberately break test to verify CI failure"
 *      git push origin main
 * 4. Visit GitHub > Actions tab > Observe RED X failure badge!
 * 5. Revert back to:
 *      expect(res.statusCode).toBe(200);
 * 6. Commit and push:
 *      git add PRA-12/tests/tasks.test.js
 *      git commit -m "fix: correct test expectation to restore green pipeline"
 *      git push origin main
 * 7. Observe the pipeline turn GREEN with a passing checkmark!
 */

const request = require('supertest');
const app = require('../server');

describe('[DEMO ONLY] Deliberately Broken Test Case', () => {
  test('DELIBERATELY BROKEN: Expects status 500 but GET /tasks returns 200', async () => {
    const res = await request(app).get('/tasks');
    // Deliberate failure assertion:
    // Expected: 500
    // Received: 200
    expect(res.statusCode).toBe(500);
  });
});
