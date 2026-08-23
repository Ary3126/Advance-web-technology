import { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  checkBackendHealth
} from '../services/api';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    database: 'checking'
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deletingTaskTitle, setDeletingTaskTitle] = useState('');

  const [toast, setToast] = useState(null);

  const showToast = (type, message, title = '') => {
    setToast({ type, message, title, id: Date.now() });
  };

  const checkHealth = useCallback(async () => {
    const health = await checkBackendHealth();
    setBackendHealth(health);
  }, []);

  const fetchTaskList = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        throw new Error('Unexpected data format from backend');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server at http://localhost:5000');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    fetchTaskList(true);
  }, [checkHealth, fetchTaskList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && formError) setFormError('');
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Task title is required');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      _id: tempId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const createdTask = await createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        completed: false
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === tempId ? createdTask : t))
      );

      setFormData({ title: '', description: '', priority: 'medium' });
      showToast('success', `Task "${createdTask.title}" saved to MongoDB!`, 'Created');
      checkHealth();
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      showToast('error', err.message || 'Failed to create task in MongoDB', 'Error');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const previousState = task.completed;
    const newCompleted = !previousState;

    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, completed: newCompleted } : t
      )
    );

    try {
      const updated = await updateTask(task._id, { completed: newCompleted });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updated : t))
      );
      showToast(
        'success',
        `Task marked as ${newCompleted ? 'completed' : 'pending'}`,
        'Updated'
      );
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: previousState } : t
        )
      );
      showToast('error', `Failed to update status: ${err.message}`, 'Update Error');
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium'
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.title.trim()) {
      showToast('error', 'Task title cannot be empty', 'Validation Error');
      return;
    }

    setEditSubmitting(true);
    try {
      const updated = await updateTask(editingTask._id, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        priority: editFormData.priority
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? updated : t))
      );

      showToast('success', `Task "${updated.title}" updated successfully!`, 'Saved');
      setEditingTask(null);
    } catch (err) {
      showToast('error', `Failed to update task: ${err.message}`, 'Error');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handlePromptDelete = (task) => {
    setDeletingTaskId(task._id);
    setDeletingTaskTitle(task.title);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    const targetId = deletingTaskId;
    const targetTitle = deletingTaskTitle;
    setDeletingTaskId(null);

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== targetId));

    try {
      await deleteTask(targetId);
      showToast('success', `Task "${targetTitle}" deleted from database.`, 'Deleted');
    } catch (err) {
      setTasks(previousTasks);
      showToast('error', `Failed to delete task: ${err.message}`, 'Delete Failed');
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !task.completed) ||
      (statusFilter === 'completed' && task.completed);

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="task-manager-page main-content">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <ConfirmModal
        isOpen={!!deletingTaskId}
        title="Delete Task Confirmation"
        message={`Are you sure you want to permanently delete "${deletingTaskTitle}"? This will remove the document from MongoDB.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTaskId(null)}
        confirmText="Yes, Delete Task"
        isDanger={true}
      />

      <section className="section-card page-header task-header-card">
        <div className="task-header-left">
          <h2>Full Stack Task Manager ⚡</h2>
          <p>
            Connected to <strong>Node/Express backend</strong> (port 5000) and{' '}
            <strong>MongoDB</strong> with full REST CRUD, validation, and real-time state synchronization.
          </p>
        </div>

        <div className="backend-status-badge-container">
          <div
            className={`status-pill ${backendHealth.status === 'online'
                ? 'status-online'
                : backendHealth.status === 'checking'
                  ? 'status-checking'
                  : 'status-offline'
              }`}
            title="Express + MongoDB Server Health"
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {backendHealth.status === 'online'
                ? `Backend Online (MongoDB: ${backendHealth.database})`
                : backendHealth.status === 'checking'
                  ? 'Connecting to API...'
                  : 'Backend Offline (Port 5000)'}
            </span>
          </div>

          <button
            type="button"
            className="refresh-sync-btn"
            onClick={() => {
              checkHealth();
              fetchTaskList(false);
              showToast('info', 'Refreshed task list and backend health.', 'Refreshed');
            }}
            title="Re-fetch from MongoDB"
          >
            🔄 Sync Data
          </button>
        </div>
      </section>

      <section className="task-stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📋</span>
          <div className="stat-info">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <span className="stat-icon">⏳</span>
          <div className="stat-info">
            <span className="stat-value">{pendingTasks}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-card stat-completed">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <span className="stat-value">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card stat-high-priority">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <span className="stat-value">{highPriorityTasks}</span>
            <span className="stat-label">High Priority Active</span>
          </div>
        </div>
      </section>

      <div className="task-board-layout">
        <section className="section-card task-form-card">
          <div className="card-title-row">
            <h3 style={{ fontSize: '1.3rem' }}>➕ Create New Task</h3>
            <span className="api-tag">POST /tasks</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Enter details to save a new task document directly to the MongoDB database.
          </p>

          <form onSubmit={handleCreateTask} className="task-input-form">
            <div className="form-group">
              <label htmlFor="task-title">
                Task Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                className={`task-input ${formError ? 'input-error' : ''}`}
                placeholder="e.g. Wire React to Express API"
                value={formData.title}
                onChange={handleInputChange}
                disabled={formSubmitting}
              />
              {formError && <span className="field-error-text">{formError}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="task-description">Description (Optional)</label>
              <textarea
                id="task-description"
                name="description"
                rows="3"
                className="task-input task-textarea"
                placeholder="Add technical context, requirements, or steps..."
                value={formData.description}
                onChange={handleInputChange}
                disabled={formSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <div className="priority-selector">
                {['low', 'medium', 'high'].map((p) => (
                  <label
                    key={p}
                    className={`priority-option priority-option-${p} ${formData.priority === p ? 'selected' : ''
                      }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={formData.priority === p}
                      onChange={handleInputChange}
                    />
                    <span className="priority-dot"></span>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn-create-task"
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving to MongoDB...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create Task (POST)
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-clear-form"
                onClick={() => {
                  setFormData({ title: '', description: '', priority: 'medium' });
                  setFormError('');
                }}
                disabled={formSubmitting}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section className="section-card task-list-card">
          <div className="task-list-header">
            <div>
              <h3 style={{ fontSize: '1.3rem' }}>📋 Task List ({filteredTasks.length})</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Persistent data loaded from MongoDB collection <code>tasks</code>
              </p>
            </div>

            <div className="filter-chips-row">
              <div className="chip-group">
                {['all', 'active', 'completed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="task-controls-bar">
            <div className="search-input-wrapper" style={{ flex: 1 }}>
              <svg
                className="search-icon-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks by title or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="priority-filter-dropdown-wrapper">
              <label htmlFor="pra6-priority-filter">Priority:</label>
              <select
                id="pra6-priority-filter"
                className="filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="spinner-container" style={{ padding: '3.5rem 1rem' }}>
              <div className="loading-spinner"></div>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Connecting to MongoDB and fetching tasks...
              </p>
            </div>
          ) : error ? (
            <div className="error-message-card">
              <div className="error-icon">⚠️</div>
              <h3 style={{ color: '#ef4444', marginTop: 0 }}>Cannot Connect to Express Backend</h3>
              <p style={{ margin: '0.5rem 0 1rem', fontSize: '0.92rem' }}>{error}</p>
              <div className="troubleshoot-hints">
                <strong>Troubleshooting Checklist:</strong>
                <ul>
                  <li>Confirm Express server is running on <code>http://localhost:5000</code></li>
                  <li>Confirm MongoDB service is active on <code>mongodb://127.0.0.1:27017</code></li>
                  <li>Ensure CORS is enabled in <code>server.js</code></li>
                </ul>
              </div>
              <button
                className="retry-btn"
                type="button"
                onClick={() => {
                  checkHealth();
                  fetchTaskList(true);
                }}
                style={{ marginTop: '1rem' }}
              >
                Retry Fetch
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-tasks-placeholder">
              <span style={{ fontSize: '2.5rem' }}>📭</span>
              <h4>No Tasks Found</h4>
              <p>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No tasks match your current filters. Try resetting search filters.'
                  : 'Your MongoDB task list is empty. Create your first task using the form on the left!'}
              </p>
              {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                <button
                  type="button"
                  className="filter-btn"
                  style={{ marginTop: '1rem' }}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="tasks-display-list">
              {filteredTasks.map((task) => {
                const isTemp = task._id.startsWith('temp-');
                return (
                  <div
                    key={task._id}
                    className={`task-item-card ${task.completed ? 'task-completed' : ''
                      } ${isTemp ? 'task-optimistic' : ''}`}
                  >
                    <div className="task-item-left">
                      <button
                        type="button"
                        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                        onClick={() => !isTemp && handleToggleComplete(task)}
                        disabled={isTemp}
                        title={task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                        aria-label="Toggle task status"
                      >
                        {task.completed && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>

                      <div className="task-text-content">
                        <div className="task-title-line">
                          <h4 className="task-title">{task.title}</h4>
                          <span className={`priority-badge badge-${task.priority || 'medium'}`}>
                            {task.priority || 'medium'}
                          </span>
                          {task.completed && (
                            <span className="status-tag-completed">Completed</span>
                          )}
                          {isTemp && (
                            <span className="status-tag-syncing">Syncing...</span>
                          )}
                        </div>

                        {task.description && (
                          <p className="task-desc">{task.description}</p>
                        )}

                        <div className="task-meta-row">
                          <span className="task-date">
                            📅{' '}
                            {task.createdAt
                              ? new Date(task.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                              : 'Just now'}
                          </span>
                          <span className="task-id-mono" title={`MongoDB ID: ${task._id}`}>
                            ID: {task._id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="task-item-actions">
                      <button
                        type="button"
                        className="task-action-btn btn-edit"
                        onClick={() => handleOpenEdit(task)}
                        disabled={isTemp}
                        title="Edit Task"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="task-action-btn btn-delete"
                        onClick={() => handlePromptDelete(task)}
                        disabled={isTemp}
                        title="Delete Task"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {editingTask && (
        <div className="modal-backdrop" onClick={() => setEditingTask(null)}>
          <div
            className="modal-container animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-icon-badge">✏️</div>
              <h3 className="modal-heading">Edit Task</h3>
            </div>

            <form onSubmit={handleSaveEdit} className="task-input-form" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label htmlFor="pra6-edit-title">Task Title</label>
                <input
                  id="pra6-edit-title"
                  type="text"
                  className="task-input"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pra6-edit-desc">Description</label>
                <textarea
                  id="pra6-edit-desc"
                  rows="3"
                  className="task-input task-textarea"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <div className="priority-selector">
                  {['low', 'medium', 'high'].map((p) => (
                    <label
                      key={p}
                      className={`priority-option priority-option-${p} ${editFormData.priority === p ? 'selected' : ''
                        }`}
                    >
                      <input
                        type="radio"
                        name="pra6EditPriority"
                        value={p}
                        checked={editFormData.priority === p}
                        onChange={(e) =>
                          setEditFormData((prev) => ({ ...prev, priority: e.target.value }))
                        }
                      />
                      <span className="priority-dot"></span>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-modal btn-cancel"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal btn-primary"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? 'Saving Changes...' : 'Save Updates (PUT)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManager;
