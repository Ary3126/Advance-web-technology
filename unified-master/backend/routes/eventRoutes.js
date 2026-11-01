const express = require('express');
const taskEvents = require('../events');

const router = express.Router();

// GET /api/events/logs (Practical 10)
router.get('/logs', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 100);
  res.status(200).json({
    total: taskEvents.history.length,
    events: taskEvents.getRecentLogs(limit)
  });
});

// GET /api/events/stream (Server-Sent Events for real-time frontend streaming)
router.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  // Send initial connected ping
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  const onTaskCreated = (task) => {
    res.write(`data: ${JSON.stringify({ type: 'task-created', task, timestamp: new Date().toISOString() })}\n\n`);
  };

  const onTaskDeleted = (task) => {
    res.write(`data: ${JSON.stringify({ type: 'task-deleted', task, timestamp: new Date().toISOString() })}\n\n`);
  };

  const onTaskUpdated = (task) => {
    res.write(`data: ${JSON.stringify({ type: 'task-updated', task, timestamp: new Date().toISOString() })}\n\n`);
  };

  taskEvents.on('task-created', onTaskCreated);
  taskEvents.on('task-deleted', onTaskDeleted);
  taskEvents.on('task-updated', onTaskUpdated);

  req.on('close', () => {
    taskEvents.off('task-created', onTaskCreated);
    taskEvents.off('task-deleted', onTaskDeleted);
    taskEvents.off('task-updated', onTaskUpdated);
  });
});

// POST /api/events/simulate (Manual demo trigger)
router.post('/simulate', (req, res) => {
  const { title = 'Simulated Task Demo', priority = 'high' } = req.body;
  const mockTask = {
    _id: `sim-${Date.now()}`,
    title,
    priority,
    user: 'admin-simulator'
  };

  taskEvents.emit('task-created', mockTask);
  res.status(202).json({
    message: 'Asynchronous event dispatched to background worker.',
    task: mockTask,
    processingDelayMs: 2000
  });
});

module.exports = router;

