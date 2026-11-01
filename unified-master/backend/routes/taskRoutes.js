const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { optionalAuth } = require('../middleware/auth');
const cache = require('../cache');
const taskEvents = require('../events');
const {
  validateContentType,
  validateTask,
  validateObjectId
} = require('../middleware/validate');

const router = express.Router();

// [READ ALL] GET /api/tasks & GET /tasks
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'public';
    const { search, priority, category, completed } = req.query;

    // Cache check only for plain unparameterized lists
    const isFiltered = Boolean(search || priority || category || completed !== undefined);
    const cacheKey = cache.allTasksKey(userId);

    if (!isFiltered) {
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        res.set('X-Cache', 'HIT');
        return res.status(200).json(cached);
      }
    }

    const query = {};
    if (req.user) {
      query.user = req.user.id;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (completed !== undefined && completed !== 'all') {
      query.completed = completed === 'true';
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    if (!isFiltered) {
      cache.set(cacheKey, tasks);
    }

    res.set('X-Cache', 'MISS');
    if (req.query.ci === 'true' || req.headers['x-ci'] === 'true') {
      return res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully (CI/CD Pipeline)',
        count: tasks.length,
        tasks
      });
    }
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// [READ ONE] GET /api/tasks/:id
router.get('/:id', optionalAuth, validateObjectId, async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : 'public';
    const cacheKey = cache.taskKey(userId, req.params.id);

    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cached);
    }

    const query = { _id: req.params.id };
    if (req.user) {
      query.user = req.user.id;
    }

    const task = await Task.findOne(query);
    if (!task) {
      return res.status(404).json({ message: `Task not found with ID '${req.params.id}'` });
    }

    cache.set(cacheKey, task);
    res.set('X-Cache', 'MISS');
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// [CREATE] POST /api/tasks & POST /tasks
router.post('/', optionalAuth, validateContentType, validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority, category } = req.body;
    const userId = req.user ? req.user.id : null;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      category: category || 'General',
      user: userId
    });

    // Invalidate caches
    cache.invalidateTasks(userId || 'public');
    taskEvents.emit('cache-invalidated', { action: 'create', userId: userId || 'public' });

    // Send HTTP 201 Response Immediately (Standard Level 2 REST)
    res.status(201)
       .location(`/api/tasks/${task._id}`)
       .json(task);

    // Asynchronous decoupled background processing via EventEmitter (Practical 10)
    taskEvents.emit('task-created', task);
  } catch (error) {
    next(error);
  }
});

// [UPDATE] PUT /api/tasks/:id
router.put('/:id', optionalAuth, validateContentType, validateObjectId, validateTask, async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const query = { _id: req.params.id };
    if (userId) {
      query.user = userId;
    }

    const task = await Task.findOne(query);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or permission denied.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        title: req.body.title !== undefined ? req.body.title.trim() : task.title,
        description: req.body.description !== undefined ? req.body.description.trim() : task.description,
        completed: req.body.completed !== undefined ? Boolean(req.body.completed) : task.completed,
        priority: req.body.priority || task.priority,
        category: req.body.category || task.category
      },
      { new: true, runValidators: true }
    );

    // Invalidate cache
    cache.invalidateTasks(userId || 'public', req.params.id);
    taskEvents.emit('cache-invalidated', { action: 'update', taskId: req.params.id });

    res.status(200).json(updatedTask);

    // Emit event
    taskEvents.emit('task-updated', updatedTask);
  } catch (error) {
    next(error);
  }
});

// [DELETE] DELETE /api/tasks/:id
router.delete('/:id', optionalAuth, validateObjectId, async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const query = { _id: req.params.id };
    if (userId) {
      query.user = userId;
    }

    const task = await Task.findOneAndDelete(query);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or permission denied.' });
    }

    // Invalidate cache
    cache.invalidateTasks(userId || 'public', req.params.id);
    taskEvents.emit('cache-invalidated', { action: 'delete', taskId: req.params.id });

    res.status(200).json({
      message: 'Task successfully deleted.',
      task
    });

    // Emit event
    taskEvents.emit('task-deleted', task);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

