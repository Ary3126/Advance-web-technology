require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models and modules
require('./listeners'); // registers task and auth event listeners
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const maturityRoutes = require('./routes/maturityRoutes');
const cacheRoutes = require('./routes/cacheRoutes');
const eventRoutes = require('./routes/eventRoutes');
const practicalRoutes = require('./routes/practicalRoutes');
const aiRoutes = require('./routes/aiRoutes');
const cache = require('./cache');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/unifiedAwtHub';

// CORS configuration for local React dev server and containerized frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['X-Cache', 'Location']
}));

// Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// JSON Body Parser with error handling
app.use(express.json());

// Root Index Endpoint - System Overview
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Unified Advanced Web Development Frameworks (ITUE301) Master Platform',
    developer: 'Ary Patel',
    version: '2.1.0',
    status: 'online',
    practical: 'Practical 12: CI/CD Pipeline & Practical 13: AI API Integration',
    ci: 'active',
    aiEnabled: true,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    practicalsCovered: 'Practicals 1 to 13 + Week 4 Assignment (All in One Big Project)',
    endpoints: {
      health: 'GET /api/health',
      practicals: 'GET /api/practicals',
      ai: {
        status: 'GET /api/ai/status',
        generateDescription: 'POST /api/ai/generate-description'
      },
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      tasks: {
        list: 'GET /api/tasks (with in-memory cache)',
        create: 'POST /api/tasks (triggers async EventEmitter notification)',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id'
      },
      richardsonMaturityModel: {
        level0_SwampOfPox: 'POST /api/v0/taskManager',
        level1_ResourceURIs: 'GET/POST /api/v1/tasks',
        level2_RestVerbs: 'GET/POST/PUT/DELETE /api/v2/tasks',
        level3_Hateoas: 'GET /api/v3/tasks (Dynamic hypermedia _links)'
      },
      cacheStats: 'GET /api/cache/stats',
      eventLogs: 'GET /api/events/logs',
      eventStream: 'GET /api/events/stream (SSE)'
    }
  });
});

// Health check endpoint (Practical 6, 11, 12, 13)
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isDbConnected ? 'online' : 'degraded',
    database: isDbConnected ? 'connected' : 'disconnected',
    databaseName: mongoose.connection.name || 'unifiedAwtHub',
    cache: {
      status: 'active',
      activeKeys: cache.getStats().activeKeysCount
    },
    aiService: {
      status: 'online',
      fallbackReady: true,
      rateLimit: '5 requests/min'
    },
    ciPipeline: {
      status: 'configured',
      workflow: '.github/workflows/ci.yml'
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Mount modular route pipelines
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes); // Backward compatibility for Practical 6, 12 & test suites
app.use('/api', maturityRoutes); // Level 0, 1, 2, 3 Richardson maturity endpoints
app.use('/api/cache', cacheRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/practicals', practicalRoutes);

// 404 Route Handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: `Cannot ${req.method} ${req.originalUrl}`,
    message: 'The requested resource was not found on this server.'
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unified Server Error]:', err);

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((field) => field.message);
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Validation failed',
      details
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Invalid resource identifier format for ${err.path}`,
      message: `Invalid value for ${err.path}`
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Server bootstrapper with resilient database connection
const startServer = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected successfully to database: "${mongoose.connection.name}"`);
  } catch (err) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB (${err.message}).`);
    console.warn('[MongoDB Warning] API running in resilient fallback mode.');
  }

  const server = app.listen(PORT, () => {
    console.log('========================================================================');
    console.log(`🚀 Unified AWT Master Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📚 Richardson HATEOAS: http://localhost:${PORT}/api/v3/tasks`);
    console.log(`⚡ Cache Monitor: http://localhost:${PORT}/api/cache/stats`);
    console.log('========================================================================');
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;

