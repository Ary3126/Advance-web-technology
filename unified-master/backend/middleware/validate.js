const mongoose = require('mongoose');

const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(400).json({
        message: 'Content-Type must be application/json'
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: 'Please provide a valid email format.' });
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

  if (!password || !password.trim()) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title, priority, description, category } = req.body;

  if (req.method === 'POST') {
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }
  }

  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({ message: 'Task title cannot be empty.' });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ message: "Priority must be 'low', 'medium', or 'high'." });
  }

  if (category && !['General', 'Frontend', 'Backend', 'DevOps', 'Assignment'].includes(category)) {
    return res.status(400).json({ message: 'Invalid task category.' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'Description must be a string.' });
  }

  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  // If it's a numeric ID (like in HATEOAS level 0-3 mock) or valid ObjectId
  if (!id) {
    return res.status(400).json({ message: 'Missing resource ID.' });
  }

  if (!mongoose.Types.ObjectId.isValid(id) && !/^\d+$/.test(id)) {
    return res.status(400).json({ message: `Invalid resource ID format: ${id}` });
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

