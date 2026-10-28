process.env.DOTENV_CONFIG_QUIET = 'true';
const request = require('supertest');
const app = require('../server');

describe('Practical 13: AI API Integration & Graceful Degradation Test Suite', () => {
  // Test 1: Title Validation
  test('POST /api/ai/generate-description returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Task title is required');
  });

  // Test 2: AI Description Generation (or smart fallback)
  test('POST /api/ai/generate-description returns 200 with description and priority', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Implement user login authentication' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('description');
    expect(typeof res.body.description).toBe('string');
    expect(res.body.description.length).toBeGreaterThan(10);
    expect(res.body).toHaveProperty('suggestedPriority');
  });

  // Test 3: Graceful Degradation on Failure (Core Practical Requirement)
  test('POST /api/ai/generate-description gracefully handles failures and returns fallback: true', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .set('x-simulate-ai-failure', 'true')
      .send({ title: 'Fix production crash in payment webhook' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('fallback', true);
    expect(res.body).toHaveProperty('description');
    expect(res.body.description).toContain('Fix production crash');
    expect(res.body.suggestedPriority).toBe('high');
  });

  // Test 4: Health Check Endpoint reports AI service status
  test('GET /api/health returns 200 and AI service status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('aiService');
    expect(res.body.aiService.fallbackReady).toBe(true);
  });

  // Test 5: Root endpoint lists AI endpoints
  test('GET / returns 200 and practical metadata', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.practical).toContain('Practical 13');
    expect(res.body.aiEnabled).toBe(true);
  });
});
