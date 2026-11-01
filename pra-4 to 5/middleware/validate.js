const mongoose = require('mongoose');

const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json'
      });
    }
  }
  next();
};

const validateTaskPayload = (req, res, next) => {
  const { title, priority, description } = req.body;

  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Task title is required and cannot be empty.'
      });
    }
  }

  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Task title cannot be empty.'
    });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: "Priority must be 'low', 'medium', or 'high'."
    });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Description must be a valid string.'
    });
  }

  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Cast Error',
      message: `Invalid task ID format: '${id}'`
    });
  }
  next();
};

module.exports = {
  validateContentType,
  validateTaskPayload,
  validateObjectId
};
