/**
 * ============================================================================
 * Practical 6: Centralized API Service for React Frontend
 * ============================================================================
 * Connects the React UI with the Node.js/Express/MongoDB backend on port 5000.
 * Exports reusable helper functions for CRUD operations with robust error handling.
 * ============================================================================
 */

const BASE_URL = 'http://localhost:5000';

/**
 * Standard HTTP headers for JSON payloads
 */
const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

/**
 * Helper to process JSON response and reject on non-2xx status codes
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      (isJson && (data.error || (data.details && data.details.join(', ')))) ||
      (typeof data === 'string' && data) ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Health Check: Verifies Express server and MongoDB connection
 * @returns {Promise<{ status: string, database: string, uptimeSeconds: number }>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return await handleResponse(response);
  } catch (error) {
    return {
      status: 'offline',
      database: 'disconnected',
      error: error.message || 'Cannot reach Express server on port 5000'
    };
  }
}

/**
 * [READ ALL] GET /tasks
 * Retrieves all tasks sorted from MongoDB
 * @returns {Promise<Array>}
 */
export async function getTasks() {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * [READ ONE] GET /tasks/:id
 * Retrieves a single task by its MongoDB ObjectId
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getTaskById(id) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * [CREATE] POST /tasks
 * Creates a new task in MongoDB
 * @param {Object} taskData - { title, description, priority, completed }
 * @returns {Promise<Object>} Created task document
 */
export async function createTask(taskData) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(taskData)
  });
  return handleResponse(response);
}

/**
 * [UPDATE] PUT /tasks/:id
 * Updates an existing task document in MongoDB
 * @param {string} id - Task ObjectId
 * @param {Object} updateData - Modified task fields
 * @returns {Promise<Object>} Updated task document
 */
export async function updateTask(id, updateData) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

/**
 * [DELETE] DELETE /tasks/:id
 * Deletes a task from MongoDB by ID
 * @param {string} id - Task ObjectId
 * @returns {Promise<{ message: string, task: Object }>}
 */
export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

export default {
  BASE_URL,
  checkBackendHealth,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
