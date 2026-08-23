/**
 * ============================================================================
 * Week 4 Assignment: Richardson Maturity Model (Levels 0 to 3)
 * ============================================================================
 * Course: Advanced Web Development Frameworks (ITUE301)
 * Purpose: Demonstrates and evaluates all 4 levels of the Richardson Maturity Model:
 *   - Level 0: The Swamp of POX (Single URI RPC Tunneling)
 *   - Level 1: Individual Resource URIs (Multiple URIs, but improper HTTP verbs)
 *   - Level 2: Standard HTTP Verbs & Status Codes (Full RESTful CRUD compliance)
 *   - Level 3: Hypermedia Controls (HATEOAS with dynamic _links)
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001; // Runs on port 5001 for standalone assignment

app.use(cors());
app.use(express.json());

// In-memory data store for assignment demonstration
let tasks = [
  { id: '1', title: 'Setup Development Environment', description: 'Install Node.js, Express, and VS Code', completed: true, priority: 'high', createdAt: '2026-08-20T10:00:00.000Z' },
  { id: '2', title: 'Study Richardson Maturity Model', description: 'Analyze Levels 0 to 3 for REST API architecture', completed: true, priority: 'high', createdAt: '2026-08-21T11:30:00.000Z' },
  { id: '3', title: 'Implement Level 2 REST Verbs and Status Codes', description: 'Apply GET, POST, PUT, DELETE with 200, 201, 400, 404', completed: false, priority: 'medium', createdAt: '2026-08-22T14:15:00.000Z' },
  { id: '4', title: 'Add HATEOAS Hypermedia Links (Level 3)', description: 'Embed _links for self, update, delete, and collection', completed: false, priority: 'low', createdAt: '2026-08-23T09:00:00.000Z' }
];

// Helper to generate next unique ID
const getNextId = () => String(Date.now());

// ============================================================================
// LEVEL 0: THE SWAMP OF POX (Plain Old XML/JSON - Single Endpoint RPC)
// ============================================================================
/**
 * Single endpoint handling all actions via POST body tunneling.
 * Always returns HTTP 200 OK even when errors occur.
 */
app.post('/api/v0/taskManager', (req, res) => {
  const { action, payload } = req.body;

  if (action === 'getAllTasks') {
    return res.status(200).json({ status: 'success', data: tasks });
  }

  if (action === 'getTaskById') {
    const task = tasks.find(t => t.id === payload.id);
    if (!task) {
      // Level 0 anti-pattern: returns 200 OK with error payload
      return res.status(200).json({ status: 'error', message: 'Task not found' });
    }
    return res.status(200).json({ status: 'success', data: task });
  }

  if (action === 'createTask') {
    if (!payload || !payload.title) {
      return res.status(200).json({ status: 'error', message: 'Title is required' });
    }
    const newTask = { id: getNextId(), title: payload.title, description: payload.description || '', completed: false, priority: payload.priority || 'medium', createdAt: new Date().toISOString() };
    tasks.push(newTask);
    return res.status(200).json({ status: 'success', data: newTask });
  }

  if (action === 'deleteTask') {
    const index = tasks.findIndex(t => t.id === payload.id);
    if (index === -1) {
      return res.status(200).json({ status: 'error', message: 'Task not found' });
    }
    const deleted = tasks.splice(index, 1)[0];
    return res.status(200).json({ status: 'success', data: deleted });
  }

  res.status(200).json({ status: 'error', message: `Unknown action: ${action}` });
});

// ============================================================================
// LEVEL 1: INDIVIDUAL RESOURCE URIs (Multiple URIs, but inconsistent verbs)
// ============================================================================
/**
 * Uses separate URIs per resource (e.g. /tasks/1, /tasks/create, /tasks/1/delete),
 * but relies exclusively on POST/GET and ignores standard HTTP verb semantics.
 */
app.get('/api/v1/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/api/v1/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(200).json({ error: 'Task not found' }); // Incorrect 200 on missing resource
  res.status(200).json(task);
});

app.post('/api/v1/tasks/create', (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(200).json({ error: 'Title required' });
  const newTask = { id: getNextId(), title, description: description || '', completed: false, priority: priority || 'medium', createdAt: new Date().toISOString() };
  tasks.push(newTask);
  res.status(200).json(newTask); // Level 1 flaw: returns 200 instead of 201 Created
});

app.post('/api/v1/tasks/:id/delete', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(200).json({ error: 'Task not found' });
  const deleted = tasks.splice(index, 1)[0];
  res.status(200).json({ message: 'Deleted', task: deleted });
});

// ============================================================================
// LEVEL 2: HTTP VERBS & STATUS CODES (Standard RESTful Compliance)
// ============================================================================
/**
 * Fully satisfies Level 2 of the Richardson Maturity Model:
 *   - Proper HTTP Verbs: GET (Safe/Idempotent), POST (Create), PUT (Update), DELETE (Remove)
 *   - Accurate Status Codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found
 *   - Proper Resource Hierarchy: /tasks and /tasks/:id
 */

// [READ ALL] GET /tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// [READ ONE] GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({
      error: `Task not found with ID '${req.params.id}'`
    });
  }
  res.status(200).json(task);
});

// [CREATE] POST /tasks
app.post('/tasks', (req, res) => {
  const { title, description, priority, completed } = req.body;

  // Validation: Required title
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      error: "Validation failed: 'title' is required and must be a non-empty string."
    });
  }

  // Validation: Priority enum
  const allowedPriorities = ['low', 'medium', 'high'];
  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      error: `Validation failed: '${priority}' is not a valid priority. Allowed: ${allowedPriorities.join(', ')}`
    });
  }

  const newTask = {
    id: getNextId(),
    title: title.trim(),
    description: (description && description.trim()) || '',
    completed: completed === true,
    priority: priority || 'medium',
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  // Level 2 compliance: Returns 201 Created and Location header
  res.status(201)
     .location(`/tasks/${newTask.id}`)
     .json(newTask);
});

// [UPDATE] PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task not found with ID '${req.params.id}'`
    });
  }

  const { title, description, completed, priority } = req.body;

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      error: "Validation failed: Invalid priority value"
    });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(completed !== undefined && { completed: Boolean(completed) }),
    ...(priority !== undefined && { priority })
  };

  tasks[taskIndex] = updatedTask;
  res.status(200).json(updatedTask);
});

// [DELETE] DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({
      error: `Task not found with ID '${req.params.id}'`
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask
  });
});

// ============================================================================
// LEVEL 3: HYPERMEDIA CONTROLS (HATEOAS AWARENESS & IMPLEMENTATION)
// ============================================================================
/**
 * Helper function to decorate a task with HATEOAS hypermedia links
 */
function addHateoasLinks(task, req) {
  const host = `${req.protocol}://${req.get('host')}`;
  const baseUri = `${host}/api/v3/tasks`;

  return {
    ...task,
    _links: {
      self: {
        href: `${baseUri}/${task.id}`,
        method: 'GET',
        description: 'Fetch this task resource'
      },
      update: {
        href: `${baseUri}/${task.id}`,
        method: 'PUT',
        description: 'Update task properties'
      },
      delete: {
        href: `${baseUri}/${task.id}`,
        method: 'DELETE',
        description: 'Permanently delete this task'
      },
      toggleComplete: {
        href: `${baseUri}/${task.id}/toggle`,
        method: 'PATCH',
        description: task.completed ? 'Mark task as pending' : 'Mark task as completed'
      },
      collection: {
        href: `${baseUri}`,
        method: 'GET',
        description: 'Return to all tasks collection'
      }
    }
  };
}

// [HATEOAS ALL] GET /api/v3/tasks
app.get('/api/v3/tasks', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const hypermediaTasks = tasks.map(t => addHateoasLinks(t, req));

  res.status(200).json({
    totalCount: hypermediaTasks.length,
    _embedded: {
      tasks: hypermediaTasks
    },
    _links: {
      self: {
        href: `${host}/api/v3/tasks`,
        method: 'GET'
      },
      create: {
        href: `${host}/api/v3/tasks`,
        method: 'POST',
        schema: {
          title: 'string (required)',
          description: 'string (optional)',
          priority: 'low | medium | high'
        }
      }
    }
  });
});

// [HATEOAS ONE] GET /api/v3/tasks/:id
app.get('/api/v3/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({
      error: `Task '${req.params.id}' not found`,
      _links: {
        collection: {
          href: `${req.protocol}://${req.get('host')}/api/v3/tasks`,
          method: 'GET'
        }
      }
    });
  }

  res.status(200).json(addHateoasLinks(task, req));
});

// ============================================================================
// 404 & CENTRALIZED ERROR HANDLING
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('================================================================');
    console.log(` Richardson Maturity Model Evaluation Server running on port ${PORT}`);
    console.log(` - Level 0 (RPC Tunneling) : POST http://localhost:${PORT}/api/v0/taskManager`);
    console.log(` - Level 1 (Resource URIs) : GET/POST http://localhost:${PORT}/api/v1/tasks`);
    console.log(` - Level 2 (Standard REST) : GET/POST/PUT/DELETE http://localhost:${PORT}/tasks`);
    console.log(` - Level 3 (HATEOAS REST)  : GET http://localhost:${PORT}/api/v3/tasks`);
    console.log('================================================================');
  });
}

module.exports = app;
