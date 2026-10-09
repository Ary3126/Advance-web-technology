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
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('taskToken'));
  const [mode, setMode] = useState('login');
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ title: '', description: '', priority: 'medium' });
  const [message, setMessage] = useState('');
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    request('/api/health')
      .then((data) => setHealth(data.database))
      .catch(() => setHealth('offline'));
  }, []);

  useEffect(() => {
    if (!token) return;
    request('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then(setTasks)
      .catch((error) => setMessage(error.message));
  }, [token]);

  async function authenticate(event) {
    event.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const data = await request(endpoint, { method: 'POST', body: JSON.stringify(credentials) });
      if (mode === 'register') {
        setMode('login');
        setMessage('Registration successful. Please log in.');
      } else {
        localStorage.setItem('taskToken', data.token);
        setToken(data.token);
        setMessage('Logged in successfully.');
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function addTask(event) {
    event.preventDefault();
    try {
      const created = await request('/api/tasks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(task)
      });
      setTasks((current) => [created, ...current]);
      setTask({ title: '', description: '', priority: 'medium' });
      setMessage('Task created. The backend event listener is processing its notification.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function toggleTask(item) {
    try {
      const updated = await request(`/api/tasks/${item._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: !item.completed })
      });
      setTasks((current) => current.map((entry) => entry._id === updated._id ? updated : entry));
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem('taskToken');
    setToken(null);
    setTasks([]);
  }

  return (
    <main className="shell">
      <header>
        <div>
          <p className="eyebrow">PRACTICAL 11 · DOCKER COMPOSE</p>
          <h1>Task Management Stack</h1>
          <p className="subtitle">React frontend · Node/Express backend · MongoDB</p>
        </div>
        <span className={`status ${health === 'connected' ? 'online' : ''}`}>MongoDB: {health}</span>
      </header>

      {message && <p className="message">{message}</p>}

      {!token ? (
        <section className="card auth-card">
          <div className="tabs">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
          </div>
          <form onSubmit={authenticate}>
            {mode === 'register' && <input placeholder="Name" value={credentials.name} onChange={(e) => setCredentials({ ...credentials, name: e.target.value })} required />}
            <input type="email" placeholder="Email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required />
            <input type="password" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
            <button className="primary">{mode === 'login' ? 'Login' : 'Create account'}</button>
          </form>
        </section>
      ) : (
        <section className="workspace">
          <div className="card">
            <div className="section-heading"><h2>New task</h2><button onClick={logout}>Logout</button></div>
            <form onSubmit={addTask}>
              <input placeholder="Task title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} required />
              <textarea placeholder="Description" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} required />
              <select value={task.priority} onChange={(e) => setTask({ ...task, priority: e.target.value })}><option>low</option><option>medium</option><option>high</option></select>
              <button className="primary">Add task</button>
            </form>
          </div>
          <div className="card"><h2>Your tasks</h2>{tasks.length === 0 ? <p className="empty">No tasks yet.</p> : tasks.map((item) => <article className={item.completed ? 'task done' : 'task'} key={item._id}><div><h3>{item.title}</h3><p>{item.description}</p></div><button onClick={() => toggleTask(item)}>{item.completed ? 'Reopen' : 'Complete'}</button></article>)}</div>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
