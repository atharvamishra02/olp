import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://online-learning-platform-five-neon.vercel.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 