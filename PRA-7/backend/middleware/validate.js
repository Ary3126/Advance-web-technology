const mongoose = require('mongoose');

const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(400).json({
        message: "Content-Type must be application/json"
      });
    }
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title, priority, description } = req.body;

  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({ message: 'Title cannot be empty.' });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ message: 'Priority must be low, medium, or high.' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'Description must be a string.' });
  }

  if (req.method === 'POST' && (!title || !title.trim())) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: `Invalid task ID: ${id}` });
  }

  next();
};

module.exports = {
  validateContentType,
  validateRegister,
  validateLogin,
  validateTask,
  validateObjectId
};
