const express = require('express');
const router = express.Router();

// Demo data store for Richardson Maturity Model evaluations
let hateoasTasks = [
  {
    id: '1',
    title: 'Setup Development Environment',
    description: 'Install Node.js, Express, Vite, and MongoDB',
    completed: true,
    priority: 'high',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'Study Richardson Maturity Model',
    description: 'Analyze Levels 0 to 3 for REST API architecture',
    completed: true,
    priority: 'high',
    createdAt: '2026-08-21T11:30:00.000Z'
  },
  {
    id: '3',
    title: 'Implement Level 2 REST Verbs and Status Codes',
    description: 'Apply GET, POST, PUT, DELETE with 200, 201, 400, 404',
    completed: false,
    priority: 'medium',
    createdAt: '2026-08-22T14:15:00.000Z'
  },
  {
    id: '4',
    title: 'Add HATEOAS Hypermedia Links (Level 3)',
    description: 'Embed _links for self, update, delete, and collection',
    completed: false,
    priority: 'low',
    createdAt: '2026-08-23T09:00:00.000Z'
  }
];

const getNextId = () => String(Date.now());

// Helper function to decorate a task with HATEOAS hypermedia links
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

// ============================================================================
// LEVEL 0: THE SWAMP OF POX (Single Endpoint RPC Tunneling)
// ============================================================================
router.post('/v0/taskManager', (req, res) => {
  const { action, payload } = req.body;

  if (action === 'getAllTasks') {
    return res.status(200).json({ status: 'success', data: hateoasTasks });
  }

  if (action === 'getTaskById') {
    const task = hateoasTasks.find(t => t.id === (payload && payload.id));
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
    const newTask = {
      id: getNextId(),
      title: payload.title,
      description: payload.description || '',
      completed: false,
      priority: payload.priority || 'medium',
      createdAt: new Date().toISOString()
    };
    hateoasTasks.push(newTask);
    return res.status(200).json({ status: 'success', data: newTask });
  }

  if (action === 'deleteTask') {
    const index = hateoasTasks.findIndex(t => t.id === (payload && payload.id));
    if (index === -1) {
      return res.status(200).json({ status: 'error', message: 'Task not found' });
    }
    const deleted = hateoasTasks.splice(index, 1)[0];
    return res.status(200).json({ status: 'success', data: deleted });
  }

  res.status(200).json({ status: 'error', message: `Unknown RPC action: ${action}` });
});

// ============================================================================
// LEVEL 1: INDIVIDUAL RESOURCE URIs (Multiple URIs, but improper HTTP verbs)
// ============================================================================
router.get('/v1/tasks', (req, res) => {
  res.status(200).json(hateoasTasks);
});

router.get('/v1/tasks/:id', (req, res) => {
  const task = hateoasTasks.find(t => t.id === req.params.id);
  if (!task) return res.status(200).json({ error: 'Task not found' }); // Level 1 flaw: 200 for not found
  res.status(200).json(task);
});

router.post('/v1/tasks/create', (req, res) => {
  const { title, description, priority } = req.body;
  if (!title) return res.status(200).json({ error: 'Title required' });
  const newTask = {
    id: getNextId(),
    title,
    description: description || '',
    completed: false,
    priority: priority || 'medium',
    createdAt: new Date().toISOString()
  };
  hateoasTasks.push(newTask);
  res.status(200).json(newTask); // Flaw: returns 200 instead of 201
});

router.post('/v1/tasks/:id/delete', (req, res) => {
  const index = hateoasTasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(200).json({ error: 'Task not found' });
  const deleted = hateoasTasks.splice(index, 1)[0];
  res.status(200).json({ message: 'Deleted', task: deleted });
});

// ============================================================================
// LEVEL 2: HTTP VERBS & STATUS CODES (Standard RESTful Compliance)
// ============================================================================
router.get('/v2/tasks', (req, res) => {
  res.status(200).json(hateoasTasks);
});

router.get('/v2/tasks/:id', (req, res) => {
  const task = hateoasTasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: `Task not found with ID '${req.params.id}'` });
  }
  res.status(200).json(task);
});

router.post('/v2/tasks', (req, res) => {
  const { title, description, priority, completed } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: "Validation failed: 'title' is required." });
  }

  const allowedPriorities = ['low', 'medium', 'high'];
  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      error: `Validation failed: '${priority}' is not valid. Allowed: ${allowedPriorities.join(', ')}`
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

  hateoasTasks.push(newTask);
  res.status(201).location(`/api/v2/tasks/${newTask.id}`).json(newTask);
});

router.put('/v2/tasks/:id', (req, res) => {
  const taskIndex = hateoasTasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task not found with ID '${req.params.id}'` });
  }

  const { title, description, completed, priority } = req.body;
  const updatedTask = {
    ...hateoasTasks[taskIndex],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(completed !== undefined && { completed: Boolean(completed) }),
    ...(priority !== undefined && { priority })
  };

  hateoasTasks[taskIndex] = updatedTask;
  res.status(200).json(updatedTask);
});

router.delete('/v2/tasks/:id', (req, res) => {
  const taskIndex = hateoasTasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task not found with ID '${req.params.id}'` });
  }

  const deleted = hateoasTasks.splice(taskIndex, 1)[0];
  res.status(200).json({ message: 'Task deleted successfully', task: deleted });
});

// ============================================================================
// LEVEL 3: HYPERMEDIA CONTROLS (HATEOAS Aware REST)
// ============================================================================
router.get('/v3/tasks', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const hypermediaTasks = hateoasTasks.map(t => addHateoasLinks(t, req));

  res.status(200).json({
    totalCount: hypermediaTasks.length,
    _embedded: {
      tasks: hypermediaTasks
    },
    _links: {
      self: { href: `${host}/api/v3/tasks`, method: 'GET' },
      create: {
        href: `${host}/api/v3/tasks`,
        method: 'POST',
        schema: { title: 'string (required)', description: 'string (optional)', priority: 'low | medium | high' }
      }
    }
  });
});

router.get('/v3/tasks/:id', (req, res) => {
  const task = hateoasTasks.find(t => t.id === req.params.id);
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

module.exports = router;

