import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const user = localStorage.getItem('blogUser');
  if (user) {
    const { token } = JSON.parse(user);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Posts
export const getPosts = (params) => API.get('/posts', { params });
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const getMyStats = () => API.get('/posts/stats/summary');
