/**
 * ============================================================================
 * Practical 4: Building a RESTful API with Node.js and Express
 * ============================================================================
 * Description: Task Management REST API with complete CRUD operations,
 *              custom logging middleware, route-specific validations,
 *              404 route handling, and centralized global error handling.
 * Server URL : http://localhost:5000
 * ============================================================================
 */

const express = require('express');
const app = express();
const PORT = 5000;

// ==========================================
// 1. IN-MEMORY DATA STORE
// ==========================================
// Stores task objects temporarily in server memory
let tasks = [
  {
    id: 1,
    title: "Learn Express",
    description: "Complete REST API practical",
    completed: false
  },
  {
    id: 2,
    title: "Understand Middleware",
    description: "Learn global and route-specific middleware in Express",
    completed: true
  }
];

// Helper counter to generate unique, auto-incrementing task IDs
let nextTaskId = 3;

// ==========================================
// 2. GLOBAL MIDDLEWARE
// ==========================================

/**
 * Global Logging Middleware
 * Intercepts every incoming HTTP request and logs:
 * HTTP_METHOD URL TIMESTAMP
 * Example: GET /tasks 2026-08-14T10:30:20.000Z
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.originalUrl} ${timestamp}`);
  next(); // Pass control to the next middleware in the pipeline
});

/**
 * Built-in JSON Body Parser Middleware
 * Parses incoming requests with JSON payloads and populates req.body
 */
app.use(express.json());

// ==========================================
// 3. SUPPLEMENTARY CUSTOM MIDDLEWARE
// ==========================================

/**
 * Content-Type Validation Middleware
 * Ensures POST and PUT requests include 'Content-Type: application/json' header
 */
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
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
 * Route-Specific Task ID Validation Middleware
 * Validates that the ':id' parameter is a positive integer before hitting controller logic
 */
const validateTaskId = (req, res, next) => {
  const idParam = req.params.id;
  const parsedId = Number(idParam);

  // Check if it's an integer and strictly positive
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({
      error: `Invalid task ID '${idParam}'. Task ID must be a positive integer.`
    });
  }

  // Attach sanitized numeric ID to request object for downstream use
  req.taskId = parsedId;
  next();
};

// ==========================================
// 4. RESTful API ROUTES (CRUD OPERATIONS)
// ==========================================

/**
 * Root Route
 * Provides general API status and available endpoints
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome to the Task Management REST API (Practical 4)",
    version: "1.0.0",
    endpoints: {
      getAllTasks: "GET /tasks",
      getTaskById: "GET /tasks/:id",
      createTask: "POST /tasks",
      updateTask: "PUT /tasks/:id",
      deleteTask: "DELETE /tasks/:id",
      errorTest: "GET /error-test"
    }
  });
});

/**
 * [READ ALL] GET /tasks
 * Returns the complete list of tasks
 * Status: 200 OK
 */
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

/**
 * [READ ONE] GET /tasks/:id
 * Returns a specific task by its numeric ID
 * Uses: validateTaskId middleware
 * Status: 200 OK (Found) | 404 Not Found
 */
app.get('/tasks/:id', validateTaskId, (req, res) => {
  const task = tasks.find(t => t.id === req.taskId);
  if (!task) {
    return res.status(404).json({
      error: `Task with ID ${req.taskId} not found`
    });
  }
  res.status(200).json(task);
});

/**
 * [CREATE] POST /tasks
 * Creates a new task and appends it to the in-memory array
 * Uses: validateContentType middleware
 * Status: 201 Created | 400 Bad Request
 */
app.post('/tasks', validateContentType, (req, res) => {
  const { title, description, completed } = req.body;

  // Validate required fields
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: "Validation failed: 'title' is required and must be a non-empty string"
    });
  }

  const newTask = {
    id: nextTaskId++,
    title: title.trim(),
    description: description && typeof description === 'string' ? description.trim() : "",
    completed: typeof completed === 'boolean' ? completed : false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * [UPDATE] PUT /tasks/:id
 * Updates an existing task with new data
 * Uses: validateTaskId, validateContentType middleware
 * Status: 200 OK | 400 Bad Request | 404 Not Found
 */
app.put('/tasks/:id', validateTaskId, validateContentType, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task with ID ${req.taskId} not found`
    });
  }

  const { title, description, completed } = req.body;

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        error: "Validation failed: 'title' must be a non-empty string"
      });
    }
    tasks[taskIndex].title = title.trim();
  }

  // Update description if provided
  if (description !== undefined) {
    tasks[taskIndex].description = typeof description === 'string' ? description.trim() : "";
  }

  // Update completed status if provided
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        error: "Validation failed: 'completed' must be a boolean (true or false)"
      });
    }
    tasks[taskIndex].completed = completed;
  }

  res.status(200).json(tasks[taskIndex]);
});

/**
 * [DELETE] DELETE /tasks/:id
 * Deletes an existing task by its numeric ID
 * Uses: validateTaskId middleware
 * Status: 200 OK | 404 Not Found
 */
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task with ID ${req.taskId} not found`
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask
  });
});

// ==========================================
// 5. DEMONSTRATION ROUTE FOR ERROR HANDLING
// ==========================================

/**
 * GET /error-test
 * Deliberately triggers a server error to demonstrate passing errors
 * to the centralized global error handler via next(err).
 */
app.get('/error-test', (req, res, next) => {
  try {
    // Simulating an unexpected internal server failure
    throw new Error("Simulated internal database/server failure for testing global error handler");
  } catch (err) {
    // Forward error to Express global error handler
    next(err);
  }
});

// ==========================================
// 6. 404 HANDLER FOR UNDEFINED ROUTES
// ==========================================

/**
 * Undefined Route Handler
 * Catches any request that does not match any predefined route.
 * Placed immediately after all routes and before the global error handler.
 */
app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ==========================================
// 7. CENTRALIZED GLOBAL ERROR HANDLER
// ==========================================

/**
 * Global Error Handling Middleware
 * Must have 4 parameters: (err, req, res, next)
 * Catches any synchronous or asynchronous errors forwarded with next(err).
 * Logs the full stack trace to the server terminal for debugging,
 * but returns a safe, clean JSON response to the client.
 */
app.use((err, req, res, next) => {
  // Log error stack to server console for developer debugging
  console.error("=========================================");
  console.error("[GLOBAL ERROR HANDLER CAUGHT AN ERROR]");
  console.error(`Method: ${req.method} | URL: ${req.originalUrl}`);
  console.error(err.stack);
  console.error("=========================================");

  // Send safe, structured JSON response to client (do NOT leak raw stack trace)
  res.status(err.status || 500).json({
    error: "Something went wrong"
  });
});

// ==========================================
// 8. START THE EXPRESS SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("=================================================");
  console.log(` Practical 4: Task Management REST API Server    `);
  console.log(` Server Status: Running                          `);
  console.log(` Port         : ${PORT}                          `);
  console.log(` Local URL    : http://localhost:${PORT}         `);
  console.log(` Ready to accept requests from Postman / Client  `);
  console.log("=================================================");
});
