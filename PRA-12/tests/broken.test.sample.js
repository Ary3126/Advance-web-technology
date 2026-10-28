/**
 * Practical 12: Broken Test Demonstration (Now Fixed)
 * 
 * Lab Session Step 5 & 6:
 * - Step 5 deliberately broke this assertion with:
 *     expect(res.statusCode).toBe(500); // Caused failure: Expected 500, Received 200
 * - Step 6 fixed the assertion back to:
 *     expect(res.statusCode).toBe(200); // Restores passing green status
 */

process.env.DOTENV_CONFIG_QUIET = 'true';
const request = require('supertest');
const app = require('../server');

describe('Demonstration Test Case (Step 6: Fixed)', () => {
  test('FIXED: GET /tasks returns status 200', async () => {
    const res = await request(app).get('/tasks');
    // Fixed: Expecting 200 which matches the actual server response
    expect(res.statusCode).toBe(200);
  });
});
