process.env.DOTENV_CONFIG_QUIET = 'true';
const request = require('supertest');
const app = require('../server');

describe('Task Management API - CI/CD Automated Test Suite', () => {
  // Test 1 (Lab Manual Requirement): GET /tasks returns 200
  test('GET /tasks returns 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  // Test 2 (Supplementary Endpoint): GET /api/health returns 200
  test('GET /api/health returns 200 and healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  // Test 3: Root endpoint returns 200 with practical details
  test('GET / returns 200 with practical details', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('practical');
    expect(res.body.practical).toContain('Practical 12');
  });

  // Test 4: Nonexistent endpoint returns 404
  test('GET /api/nonexistent returns 404 status code', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
