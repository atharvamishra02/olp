const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : 'https://adaptable-renewal.up.railway.app';

const API_PATH = `${API_BASE}/api`;

// Simple API wrapper for fetch calls
const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_PATH}${endpoint}`);
    const data = await response.json();
    return { data, status: response.status };
  },
  
  post: async (endpoint, body, headers = {}) => {
    const response = await fetch(`${API_PATH}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return { data, status: response.status };
  },
  
  put: async (endpoint, body, headers = {}) => {
    const response = await fetch(`${API_PATH}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return { data, status: response.status };
  },
  
  delete: async (endpoint, headers = {}) => {
    const response = await fetch(`${API_PATH}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
    const data = await response.json();
    return { data, status: response.status };
  }
};

export default api;
export { API_BASE, API_PATH }; 