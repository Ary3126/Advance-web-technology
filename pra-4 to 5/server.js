require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Task = require('./models/Task');
const {
  validateContentType,
  validateTaskPayload,
  validateObjectId
} = require('./middleware/validate');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManager';

// CORS Middleware (Cross-Origin Resource Sharing)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Request Logging Middleware (Practical 4)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// JSON Body Parser Middleware
app.use(express.json());

// Root Endpoint - Module Overview
app.get('/', (req, res) => {
  res.status(200).json({
    practical: 'Practical 4: Express REST Architecture & Practical 5: MongoDB Mongoose CRUD',
    course: 'ITUE301 - Advanced Web Development Frameworks',
    developer: 'Ary Patel',
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      health: 'GET /api/health',
      getAllTasks: 'GET /tasks',
      getSingleTask: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id'
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isConnected ? 'online' : 'degraded',
    database: isConnected ? 'connected' : 'disconnected',
    databaseName: mongoose.connection.name || 'taskManager',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// [READ ALL] GET /tasks - Fetch all tasks from MongoDB
app.get('/tasks', async (req, res, next) => {
  try {
    const { priority, completed, search } = req.query;
    const query = {};

    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === 'true';
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// [READ ONE] GET /tasks/:id - Fetch single task by ObjectId
app.get('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID '${req.params.id}' was not found.`
      });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// [CREATE] POST /tasks - Create a new task in MongoDB
app.post('/tasks', validateContentType, validateTaskPayload, async (req, res, next) => {
  try {
    const { title, description, priority, completed } = req.body;

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      completed: Boolean(completed)
    });

    res.status(201).location(`/tasks/${newTask._id}`).json(newTask);
  } catch (error) {
    next(error);
  }
});

// [UPDATE] PUT /tasks/:id - Modify task document
app.put('/tasks/:id', validateContentType, validateObjectId, validateTaskPayload, async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.body.title && { title: req.body.title.trim() }),
        ...(req.body.description !== undefined && { description: req.body.description.trim() })
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID '${req.params.id}' was not found.`
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// [DELETE] DELETE /tasks/:id - Remove task from MongoDB
app.delete('/tasks/:id', validateObjectId, async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Task with ID '${req.params.id}' was not found.`
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task: deletedTask
    });
  } catch (error) {
    next(error);
  }
});

// 404 Undefined Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware (Practical 4)
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Schema validation failed',
      details
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Cast Error',
      message: `Invalid identifier format for ${err.path}`
    });
  }

  res.status(err.status || 500).json({
    error: 'Server Error',
    message: err.message || 'Internal Server Error'
  });
});

// Database Connection & Server Bootstrapper
const startServer = async () => {
  try {
    console.log(`[Practical 4 & 5] Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB] Connected successfully to "${mongoose.connection.name}"`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
  }

  const server = app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`Practical 4 & 5 API Server running on port ${PORT}`);
    console.log(`- Health Check: http://localhost:${PORT}/api/health`);
    console.log(`- Tasks API   : http://localhost:${PORT}/tasks`);
    console.log(`================================================================`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
