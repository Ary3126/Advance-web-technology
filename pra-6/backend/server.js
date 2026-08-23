/**
 * ============================================================================
 * Practical 6: Express.js + Mongoose Backend with CORS Support
 * ============================================================================
 * Features:
 *   - CORS configuration enabling cross-origin calls from React dev server (5173)
 *   - JSON request parsing & request logging middleware
 *   - RESTful CRUD API endpoints for Task management
 *   - Robust Mongoose Schema validation & CastError handling
 *   - Centralized global error handling & 404 handler
 * Server URL: http://localhost:5000
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManager';

// ==========================================
// 1. CORS & GLOBAL MIDDLEWARE
// ==========================================

/**
 * Enable Cross-Origin Resource Sharing (CORS)
 * Allows the React frontend at http://localhost:5173 to access this API
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

/**
 * Global Request Logger
 * Prints: [TIMESTAMP] METHOD URL
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * Built-in JSON Body Parser
 */
app.use(express.json());

// ==========================================
// 2. CUSTOM VALIDATION MIDDLEWARE
// ==========================================

/**
 * Content-Type Validator for mutation requests
 */
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(400).json({
        error: "Invalid Content-Type. Header 'Content-Type: application/json' is required"
      });
    }
  }
  next();
};

/**
 * MongoDB 24-Hex ObjectId Validator
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: `Invalid task ID '${id}'. Must be a valid 24-character hexadecimal MongoDB ObjectId.`
    });
  }
  next();
};

// ==========================================
// 3. RESTful API ROUTES
// ==========================================

/**
 * Root Route
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Practical 6: Task Management Full-Stack API",
    status: "online",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    endpoints: {
      health: "GET /api/health",
      getAllTasks: "GET /tasks",
      getTaskById: "GET /tasks/:id",
      createTask: "POST /tasks",
      updateTask: "PUT /tasks/:id",
      deleteTask: "DELETE /tasks/:id"
    }
  });
});

/**
 * [HEALTH CHECK] GET /api/health
 */
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isDbConnected ? 'online' : 'degraded',
    database: isDbConnected ? 'connected' : 'disconnected',
    databaseName: mongoose.connection.name || 'taskManager',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

/**
 * [READ ALL] GET /tasks
 * Retrieves all tasks sorted chronologically descending
 */
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

/**
 * [READ ONE] GET /tasks/:id
 */
app.get('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: `Task not found with ID: ${req.params.id}`
      });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

/**
 * [CREATE] POST /tasks
 */
app.post('/tasks', validateContentType, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const newTask = await Task.create({
      title,
      description,
      completed,
      priority
    });

    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

/**
 * [UPDATE] PUT /tasks/:id
 */
app.put('/tasks/:id', validateObjectId, validateContentType, async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, returnDocument: 'after' }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: `Task not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

/**
 * [DELETE] DELETE /tasks/:id
 */
app.delete('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        error: `Task not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 4. 404 & CENTRALIZED ERROR HANDLING
// ==========================================

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error("=========================================");
  console.error(`[ERROR HANDLER] ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err);
  console.error("=========================================");

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: "Validation failed",
      details
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Invalid ${err.path}: '${err.value}'`
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});

// ==========================================
// 5. SERVER STARTUP & EXPORT
// ==========================================

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB at:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully to:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
