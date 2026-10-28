const path = require('path');
process.env.DOTENV_CONFIG_QUIET = 'true';
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
  quiet: true
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Task = require('./models/Task');
const authMiddleware = require('./middleware/auth');
const cache = require('./cache');
const taskEvents = require('./events');
require('./listeners');
const {
  validateContentType,
  validateRegister,
  validateLogin,
  validateTask,
  validateObjectId
} = require('./middleware/validate');

const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskManagerAuth';
const JWT_SECRET = process.env.JWT_SECRET || 'practical13_ai_secret_token_key';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Simulate-AI-Failure']
}));

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

app.use(express.json());

// Mount AI Feature Router
app.use('/api/ai', aiRoutes);

// Root endpoint: API Status & Documentation
app.get('/', (req, res) => {
  res.status(200).json({
    practical: 'Practical 13: AI API Integration into a Web Application',
    status: 'online',
    aiEnabled: true,
    aiProvidersSupported: ['OpenAI GPT-4o-mini', 'Google Gemini 1.5 Flash', 'Graceful Fallback Engine'],
    activeProvider: process.env.OPENAI_API_KEY ? 'OpenAI' : (process.env.GEMINI_API_KEY ? 'Gemini' : 'Graceful Fallback Engine'),
    endpoints: {
      aiGenerate: 'POST /api/ai/generate-description',
      health: 'GET /api/health',
      tasks: 'GET /tasks',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      getTasks: 'GET /api/tasks (requires JWT)'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    aiService: {
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
      fallbackReady: true
    },
    timestamp: new Date().toISOString()
  });
});

// GET /tasks: Task list endpoint
app.get('/tasks', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully',
    count: 3,
    tasks: [
      { id: '1', title: 'Integrate OpenAI / Gemini API', description: 'Secure server-side API integration with graceful degradation.', completed: true, priority: 'high' },
      { id: '2', title: 'Implement AI Rate Limiter', description: 'Restrict AI requests to max 5 per minute to avoid quota overrun.', completed: true, priority: 'medium' },
      { id: '3', title: 'Add Responsible AI Disclaimer', description: 'Show visible warning that generated text must be reviewed by humans.', completed: false, priority: 'low' }
    ]
  });
});

// Auth: Register
app.post('/api/auth/register', validateContentType, validateRegister, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
});

// Auth: Login
app.post('/api/auth/login', validateContentType, validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
});

// Auth: Profile
app.get('/api/auth/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Protected: Get all tasks (Cached)
app.get('/api/tasks', authMiddleware, async (req, res, next) => {
  try {
    const key = cache.allTasksKey(req.user.id);
    const cachedTasks = cache.get(key);
    if (cachedTasks !== undefined) {
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedTasks);
    }

    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    cache.set(key, tasks);
    res.set('X-Cache', 'MISS');
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// Protected: Create task
app.post('/api/tasks', authMiddleware, validateContentType, validateTask, async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      user: req.user.id
    });

    cache.invalidateTasks(req.user.id);
    res.status(201).json(task);
    taskEvents.emit('task-created', task);
    return;
  } catch (error) {
    next(error);
  }
});

// Protected: Update task
app.put('/api/tasks/:id', authMiddleware, validateContentType, validateObjectId, validateTask, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or access denied.' });

    const { title, description, completed, priority } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = Boolean(completed);
    if (priority !== undefined) task.priority = priority;

    await task.save();
    cache.invalidateTasks(req.user.id, task._id.toString());
    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// Protected: Delete task
app.delete('/api/tasks/:id', authMiddleware, validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or access denied.' });

    cache.invalidateTasks(req.user.id, task._id.toString());
    taskEvents.emit('task-deleted', task);
    return res.status(200).json({ message: 'Task deleted successfully.', task });
  } catch (error) {
    next(error);
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Server Error:', err);
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((field) => field.message);
    return res.status(400).json({ message: 'Validation failed', details });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');
    return app.listen(PORT, () => {
      console.log(`Practical 13 server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.warn('MongoDB connection notice:', error.message);
    return app.listen(PORT, () => {
      console.log(`Practical 13 server running (standalone) on http://localhost:${PORT}`);
    });
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
