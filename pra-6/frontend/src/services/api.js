/**
 * Centralized API Client Service for Practical 6 Frontend
 * Base URL configured to Express Server on port 5000
 */

const BASE_URL = 'http://localhost:5000';

const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

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

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
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

export async function getTasks() {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
  return handleResponse(response);
}

export async function getTaskById(id) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' }
  });
  return handleResponse(response);
}

export async function createTask(taskData) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(taskData)
  });
  return handleResponse(response);
}

export async function updateTask(id, updateData) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(updateData)
  });
  return handleResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' }
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
