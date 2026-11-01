/**
 * ============================================================================
 * UNIFIED CENTRALIZED API CLIENT (Practicals 3, 4, 5, 6, 7, 9, 10, Week 4)
 * ============================================================================
 * Provides strongly-typed, centralized REST communication with the backend.
 * Handles JWT token injection, response parsing, X-Cache inspection,
 * HATEOAS traversal, and resilient error recovery.
 * ============================================================================
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Returns auth headers with Bearer token if present
 */
function getHeaders(extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...extraHeaders
  };

  const token = localStorage.getItem('awt_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Robust HTTP Response parser with detailed error information
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok) {
    const errorMsg =
      (isJson && (data.message || data.error || (data.details && data.details.join(', ')))) ||
      (typeof data === 'string' && data) ||
      `HTTP Error ${response.status}: ${response.statusText}`;

    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  // Attach X-Cache header to response data if available (Practical 9)
  const xCache = response.headers.get('x-cache');
  if (xCache && typeof data === 'object' && data !== null) {
    data._xCache = xCache;
  }

  return data;
}

// ----------------------------------------------------------------------------
// 1. HEALTH PROBE (Practical 6, 11)
// ----------------------------------------------------------------------------
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await handleResponse(res);
  } catch (err) {
    return {
      status: 'offline',
      database: 'disconnected',
      cache: { status: 'offline', activeKeys: 0 },
      error: err.message || 'Cannot connect to backend on port 5000'
    };
  }
}

// ----------------------------------------------------------------------------
// 2. AUTHENTICATION & PROFILE (Practical 7)
// ----------------------------------------------------------------------------
export async function registerUser(credentials) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(res);
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(res);
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(res);
}

export function logoutUser() {
  localStorage.removeItem('awt_auth_token');
  localStorage.removeItem('awt_user_profile');
}

// ----------------------------------------------------------------------------
// 3. TASK MANAGEMENT CRUD (Practicals 4, 5, 6, 9, 10)
// ----------------------------------------------------------------------------
export async function getTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.completed && filters.completed !== 'all') params.append('completed', filters.completed);

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/api/tasks${queryStr}`, {
    method: 'GET',
    headers: getHeaders()
  });

  const data = await handleResponse(res);
  return {
    tasks: Array.isArray(data) ? data : [],
    cacheStatus: res.headers.get('x-cache') || 'UNKNOWN'
  };
}

export async function getTaskById(id) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(res);
}

export async function createTask(taskData) {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(taskData)
  });
  return handleResponse(res);
}

export async function updateTask(id, updateData) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updateData)
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------------------
// 4. IN-MEMORY CACHE MONITOR (Practical 9)
// ----------------------------------------------------------------------------
export async function getCacheStats() {
  const res = await fetch(`${API_BASE}/api/cache/stats`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

export async function clearCache() {
  const res = await fetch(`${API_BASE}/api/cache/clear`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------------------
// 5. ASYNCHRONOUS EVENTS & NOTIFICATIONS (Practical 10)
// ----------------------------------------------------------------------------
export async function getEventLogs(limit = 30) {
  const res = await fetch(`${API_BASE}/api/events/logs?limit=${limit}`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

export async function simulateEvent(payload) {
  const res = await fetch(`${API_BASE}/api/events/simulate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// ----------------------------------------------------------------------------
// 6. RICHARDSON MATURITY MODEL DEMONSTRATION (Week 4 Assignment)
// ----------------------------------------------------------------------------
export async function executeMaturityRequest(level, action, payload = {}) {
  let url = `${API_BASE}/api`;
  let method = 'GET';
  let body = null;

  switch (level) {
    case 'v0': // Level 0: POX Single RPC endpoint
      url = `${API_BASE}/api/v0/taskManager`;
      method = 'POST';
      body = JSON.stringify({ action, payload });
      break;

    case 'v1': // Level 1: Distinct URIs without standard verbs
      if (action === 'getAllTasks') url = `${API_BASE}/api/v1/tasks`;
      else if (action === 'getTaskById') url = `${API_BASE}/api/v1/tasks/${payload.id}`;
      else if (action === 'createTask') {
        url = `${API_BASE}/api/v1/tasks/create`;
        method = 'POST';
        body = JSON.stringify(payload);
      } else if (action === 'deleteTask') {
        url = `${API_BASE}/api/v1/tasks/${payload.id}/delete`;
        method = 'POST';
      }
      break;

    case 'v2': // Level 2: Standard HTTP Verbs & Status Codes
      if (action === 'getAllTasks') {
        url = `${API_BASE}/api/v2/tasks`;
        method = 'GET';
      } else if (action === 'getTaskById') {
        url = `${API_BASE}/api/v2/tasks/${payload.id}`;
        method = 'GET';
      } else if (action === 'createTask') {
        url = `${API_BASE}/api/v2/tasks`;
        method = 'POST';
        body = JSON.stringify(payload);
      } else if (action === 'updateTask') {
        url = `${API_BASE}/api/v2/tasks/${payload.id}`;
        method = 'PUT';
        body = JSON.stringify(payload);
      } else if (action === 'deleteTask') {
        url = `${API_BASE}/api/v2/tasks/${payload.id}`;
        method = 'DELETE';
      }
      break;

    case 'v3': // Level 3: HATEOAS Hypermedia
      if (action === 'customUri' && payload.customUri) {
        url = payload.customUri;
        method = payload.method || 'GET';
      } else if (action === 'getTaskById') {
        url = `${API_BASE}/api/v3/tasks/${payload.id}`;
        method = 'GET';
      } else {
        url = `${API_BASE}/api/v3/tasks`;
        method = 'GET';
      }
      break;

    default:
      throw new Error(`Unsupported maturity level: ${level}`);
  }

  const startTime = performance.now();
  const rawResponse = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body
  });
  const duration = Math.round(performance.now() - startTime);

  const contentType = rawResponse.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const responseData = isJson ? await rawResponse.json().catch(() => ({})) : await rawResponse.text();

  // Extract all response headers for evaluation
  const headersObj = {};
  rawResponse.headers.forEach((val, key) => { headersObj[key] = val; });

  return {
    request: { method, url, body: body ? JSON.parse(body) : null },
    response: {
      status: rawResponse.status,
      statusText: rawResponse.statusText,
      headers: headersObj,
      data: responseData,
      durationMs: duration
    }
  };
}

// ----------------------------------------------------------------------------
// 7. PRACTICAL ROADMAP METADATA
// ----------------------------------------------------------------------------
export async function getPracticals() {
  const res = await fetch(`${API_BASE}/api/practicals`);
  return handleResponse(res);
}

// ----------------------------------------------------------------------------
// 8. AI ASSISTANT & GRACEFUL DEGRADATION (Practical 13)
// ----------------------------------------------------------------------------
export async function generateAiDescription(title, simulateFailure = false) {
  const extraHeaders = simulateFailure ? { 'X-Simulate-AI-Failure': 'true' } : {};
  const res = await fetch(`${API_BASE}/api/ai/generate-description`, {
    method: 'POST',
    headers: getHeaders(extraHeaders),
    body: JSON.stringify({ title })
  });
  return handleResponse(res);
}

export async function getAiStatus() {
  const res = await fetch(`${API_BASE}/api/ai/status`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

export default {
  API_BASE,
  checkBackendHealth,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getCacheStats,
  clearCache,
  getEventLogs,
  simulateEvent,
  executeMaturityRequest,
  getPracticals,
  generateAiDescription,
  getAiStatus
};

