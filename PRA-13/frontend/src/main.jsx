import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const { headers = {}, ...requestOptions } = options;
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...headers },
    ...requestOptions
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('taskToken'));
  const [mode, setMode] = useState('login');
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: '', description: '', priority: 'medium' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [health, setHealth] = useState({ db: 'checking', ai: 'checking' });
  
  // AI Feature States (Supplementary 1: Loading state, Suggestion source, Disclaimer)
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  // Check backend and AI health on load
  useEffect(() => {
    request('/api/health')
      .then((data) => {
        setHealth({
          db: data.database || 'connected',
          ai: data.aiService?.openaiConfigured ? 'OpenAI GPT-4o-mini' : (data.aiService?.geminiConfigured ? 'Gemini 1.5' : 'Graceful Fallback Engine')
        });
      })
      .catch(() => setHealth({ db: 'offline', ai: 'unavailable' }));
  }, []);

  // Load tasks on authenticated state
  useEffect(() => {
    if (!token) {
      // In guest/demo mode, load public tasks
      request('/tasks')
        .then((res) => setTasks(res.tasks || []))
        .catch(() => {});
      return;
    }

    request('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then((items) => setTasks(Array.isArray(items) ? items : []))
      .catch((error) => {
        setMessage(error.message);
        setMessageType('warning');
      });
  }, [token]);

  // Auth handler
  async function authenticate(event) {
    event.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const data = await request(endpoint, { method: 'POST', body: JSON.stringify(credentials) });
      if (mode === 'register') {
        setMode('login');
        setMessage('Registration successful! Please log in.');
        setMessageType('success');
      } else {
        localStorage.setItem('taskToken', data.token);
        setToken(data.token);
        setMessage('Logged in successfully.');
        setMessageType('success');
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('warning');
    }
  }

  // AI Description Generator (Steps 3, 4, 5 & Supplementary 1, 2, 3)
  async function handleGenerateDescription(simulateFailure = false) {
    if (!task.title.trim()) {
      setMessage('Please enter a task title first so the AI can generate a relevant description.');
      setMessageType('warning');
      return;
    }

    setIsAiLoading(true);
    setMessage('');

    try {
      const headers = {};
      if (simulateFailure) {
        headers['X-Simulate-AI-Failure'] = 'true';
      }

      const res = await request('/api/ai/generate-description', {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: task.title })
      });

      if (res.success && res.description) {
        // Step 5: Populate returned description in the editable textarea
        setTask((prev) => ({
          ...prev,
          description: res.description,
          priority: res.suggestedPriority || prev.priority
        }));

        setAiSource(res.source || (res.fallback ? 'Graceful Fallback' : 'AI Provider'));
        setIsFallback(Boolean(res.fallback));

        if (res.fallback) {
          setMessage(res.message || 'AI service unavailable. Generated local fallback suggestion.');
          setMessageType('warning');
        } else {
          setMessage(`✨ AI description generated via ${res.source}. You can edit it below.`);
          setMessageType('success');
        }
      }
    } catch (error) {
      if (error.status === 429) {
        setMessage('Rate limit exceeded: Max 5 AI requests per minute to prevent quota exhaustion.');
      } else {
        setMessage(`AI Error: ${error.message}. Please write a description manually.`);
      }
      setMessageType('warning');
    } finally {
      setIsAiLoading(false);
    }
  }

  // Create Task
  async function addTask(event) {
    event.preventDefault();
    try {
      if (token) {
        const created = await request('/api/tasks', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(task)
        });
        setTasks((current) => [created, ...current]);
      } else {
        // Local demo mode
        const localTask = {
          _id: Date.now().toString(),
          title: task.title,
          description: task.description,
          priority: task.priority,
          completed: false
        };
        setTasks((current) => [localTask, ...current]);
      }

      setTask({ title: '', description: '', priority: 'medium' });
      setAiSource(null);
      setIsFallback(false);
      setMessage('Task created successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message);
      setMessageType('warning');
    }
  }

  // Toggle Task Status
  async function toggleTask(item) {
    try {
      if (token && item._id) {
        const updated = await request(`/api/tasks/${item._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ completed: !item.completed })
        });
        setTasks((current) => current.map((entry) => entry._id === updated._id ? updated : entry));
      } else {
        setTasks((current) =>
          current.map((entry) => (entry._id === item._id ? { ...entry, completed: !entry.completed } : entry))
        );
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('warning');
    }
  }

  function logout() {
    localStorage.removeItem('taskToken');
    setToken(null);
    setTasks([]);
    setMessage('Logged out.');
    setMessageType('info');
  }

  return (
    <main className="shell">
      <header>
        <div>
          <p className="eyebrow">PRACTICAL 13 · RESPONSIBLE AI INTEGRATION</p>
          <h1>AI-Powered Task Manager</h1>
          <p className="subtitle">
            Secure Backend AI Proxy · Graceful Degradation · Human-in-the-Loop Review
          </p>
        </div>
        <div className="status-group">
          <span className={`status-pill ${health.db === 'connected' ? 'online' : ''}`}>
            Database: {health.db}
          </span>
          <span className="status-pill ai-active">
            🤖 AI Engine: {health.ai}
          </span>
        </div>
      </header>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="workspace">
        {/* Left Column: Task Creation with AI Assistant */}
        <section className="card">
          <div className="section-heading">
            <h2>Create New Task</h2>
            {token ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <span className="subtitle" style={{ fontSize: '13px' }}>Demo Mode</span>
            )}
          </div>

          <form onSubmit={addTask}>
            {/* Task Title */}
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input
                placeholder="e.g., Implement OAuth2 Google Login in auth service"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />
            </div>

            {/* AI Assistant Action Bar */}
            <div className="ai-action-bar">
              <button
                type="button"
                className="btn-ai"
                onClick={() => handleGenerateDescription(false)}
                disabled={isAiLoading || !task.title.trim()}
                title="Call server-side AI to draft a task description"
              >
                {isAiLoading ? '🤖 Generating AI suggestion...' : '✨ Generate AI Description'}
              </button>

              {/* Step 6 Test Failure Path Button */}
              <button
                type="button"
                className="btn-simulate"
                onClick={() => handleGenerateDescription(true)}
                disabled={isAiLoading || !task.title.trim()}
                title="Test Step 6: Simulate AI failure to verify Graceful Degradation"
              >
                Simulate AI Failure
              </button>
            </div>

            {/* Source indicator if AI generated */}
            {aiSource && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span className="subtitle">Suggestion source:</span>
                <span className={`ai-source-pill ${isFallback ? 'fallback' : ''}`}>
                  {aiSource}
                </span>
              </div>
            )}

            {/* Editable Description Textarea (Step 5) */}
            <div className="form-group">
              <label className="form-label">Task Description (Editable Suggestion)</label>
              <textarea
                placeholder="Write a description or click 'Generate AI Description' above..."
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                required
              />
            </div>

            {/* Supplementary 3: Responsible AI Disclaimer */}
            <div className="ai-disclaimer">
              <span>⚠️</span>
              <div>
                <strong>Responsible AI Review:</strong> Suggestions are machine-generated drafts. Always review and edit before saving. Never submit sensitive data (credentials, PII, API tokens).
              </div>
            </div>

            {/* Suggested Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <button className="primary" type="submit" disabled={isAiLoading}>
              Add Task
            </button>
          </form>
        </section>

        {/* Right Column: Existing Tasks List */}
        <section className="card">
          <div className="section-heading">
            <h2>Your Tasks</h2>
            <span className="subtitle">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </div>

          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Enter a title on the left and generate a description!</p>
          ) : (
            tasks.map((item) => (
              <article className={item.completed ? 'task done' : 'task'} key={item._id || item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className={`tag ${item.priority || 'medium'}`}>
                    {item.priority || 'medium'}
                  </span>
                </div>
                <button onClick={() => toggleTask(item)}>
                  {item.completed ? 'Reopen' : 'Complete'}
                </button>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
