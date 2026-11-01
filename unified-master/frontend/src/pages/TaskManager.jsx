import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, generateAiDescription } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function TaskManager({ showToast, user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cacheStatus, setCacheStatus] = useState('MISS');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [completedFilter, setCompletedFilter] = useState('all');

  // Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General'
  });
  const [submitting, setSubmitting] = useState(false);

  // Practical 13: AI Assistant State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState(null);
  const [simulateAiFailure, setSimulateAiFailure] = useState(false);

  // Delete modal state
  const [deletingId, setDeletingId] = useState(null);

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTasks({
        search,
        priority: priorityFilter,
        category: categoryFilter,
        completed: completedFilter
      });
      setTasks(res.tasks);
      setCacheStatus(res.cacheStatus);
    } catch (err) {
      showToast('error', err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, priorityFilter, categoryFilter, completedFilter, showToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Practical 13: Handle AI Assist with Graceful Degradation
  const handleAiAssist = async () => {
    if (!newTask.title.trim()) {
      showToast('warning', 'Please enter a task title first so AI can draft a description!');
      return;
    }
    setAiLoading(true);
    try {
      const data = await generateAiDescription(newTask.title, simulateAiFailure);
      setNewTask((prev) => ({
        ...prev,
        description: data.description || prev.description,
        priority: data.suggestedPriority || prev.priority
      }));
      setAiSource({
        source: data.source,
        fallback: data.fallback,
        message: data.message
      });
      if (data.fallback) {
        showToast('info', 'Graceful Degradation: Smart fallback description applied!');
      } else {
        showToast('success', `AI description drafted via ${data.source}!`);
      }
    } catch (err) {
      showToast('error', err.message || 'AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Create
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      showToast('warning', 'Please enter a task title');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createTask(newTask);
      setTasks((prev) => [created, ...prev]);
      setNewTask({ title: '', description: '', priority: 'medium', category: 'General' });
      showToast('success', `Created task "${created.title}". Background event worker initiated!`);
    } catch (err) {
      showToast('error', err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Toggle Complete with Optimistic UI
  const handleToggle = async (task) => {
    const previousTasks = [...tasks];
    const newCompleted = !task.completed;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: newCompleted } : t))
    );

    try {
      await updateTask(task._id, { completed: newCompleted });
      showToast('info', `Task marked as ${newCompleted ? 'Completed' : 'Active'}`);
    } catch (err) {
      // Rollback on error
      setTasks(previousTasks);
      showToast('error', err.message || 'Failed to update task');
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTask(deletingId);
      setTasks((prev) => prev.filter((t) => t._id !== deletingId));
      showToast('success', 'Task deleted successfully. Cache invalidated.');
    } catch (err) {
      showToast('error', err.message || 'Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Full-Stack Task Manager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Practical 6, 7 & 9 · Authenticated Express/MongoDB CRUD with In-Memory Caching & Event Emitter
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${cacheStatus === 'HIT' ? 'badge-cache-hit' : 'badge-cache-miss'}`}>
            ⚡ X-Cache: {cacheStatus} {cacheStatus === 'HIT' ? '(from RAM in <1ms)' : '(from MongoDB)'}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={loadTasks}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Left Column: Create Task Form */}
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            ➕ Create New Task
          </h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Task Title *</label>
              <input
                className="form-control"
                placeholder="e.g. Implement Docker multi-stage builds"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>

            {/* Practical 13: AI Assistant Generator Strip */}
            <div style={{ marginBottom: '1rem', padding: '0.85rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa' }}>
                  🤖 Practical 13 · AI Copilot
                </span>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={simulateAiFailure}
                    onChange={(e) => setSimulateAiFailure(e.target.checked)}
                  />
                  <span>Simulate AI Outage (Graceful Degradation Test)</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAiAssist}
                  disabled={aiLoading || !newTask.title.trim()}
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', flex: 1 }}
                >
                  {aiLoading ? '⏳ AI drafting description...' : '✨ Generate AI Description'}
                </button>
              </div>

              {aiSource && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: aiSource.fallback ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                    {aiSource.fallback ? '⚡ Fallback Mode Active' : '✅ Cloud AI Generated'} ({aiSource.source})
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>Auto-selected priority</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Description</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  (100% User Editable)
                </span>
              </div>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Detailed instructions or specifications..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            {/* Practical 13: Responsible AI Disclaimer */}
            <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span>⚠️</span>
              <div>
                <strong>Responsible AI Notice:</strong> Suggestions are machine-generated drafts. Always review, edit, and verify before saving. Never submit sensitive PII or credentials.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Priority</label>
                <select
                  className="form-control"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Assignment">Assignment</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task & Emit Event'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Event-Driven Flow:</strong> Submitting this form sends a <code>POST /api/tasks</code> request. The Express backend responds with <code>201 Created</code> and asynchronously emits a <code>task-created</code> event. Check the <strong>Events</strong> tab to see the decoupled background notification!
          </div>
        </div>

        {/* Right Column: Search & Task List */}
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              📋 Tasks ({tasks.length})
            </h2>
            {user && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Viewing private tasks for: <strong>{user.name}</strong>
              </span>
            )}
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              className="form-control"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="General">General</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps">DevOps</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>

          {/* Task List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No tasks found.</p>
              <p style={{ fontSize: '0.85rem' }}>Create your first task on the left or change filters.</p>
            </div>
          ) : (
            <div style={{ maxHeight: '520px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {tasks.map((task) => (
                <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={`badge badge-${task.priority}`}>
                        {task.priority}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {task.category || 'General'}
                      </span>
                    </div>
                    <div className="task-title">{task.title}</div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Created: {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <button
                      className={`btn btn-sm ${task.completed ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggle(task)}
                    >
                      {task.completed ? '↩ Reopen' : '✓ Done'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeletingId(task._id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Practical 6 Requirement) */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Task Confirmation"
        message="Are you sure you want to permanently delete this task from MongoDB? This will also trigger cache invalidation and a task-deleted event."
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

