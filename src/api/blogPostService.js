import axios from 'axios';

// The URL of your Spring Boot backend
const API_BASE_URL = 'https://blog-management-backend-g4pa.onrender.com/api';
// const API_BASE_URL = 'http://localhost:8080/api';

// Create a configured instance of Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Axios Interceptor to add the JWT token to every secure request
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// --- Blog Post Endpoints ---
export const getAllPosts = async () => {
  const res = await apiClient.get('/posts');
  return res.data;
};

export const getPostById = async (id) => {
  const res = await apiClient.get(`/posts/${id}`);
  return res.data;
};

export const getPostsByAuthor = async (authorId) => {
  const res = await apiClient.get(`/posts/author/${authorId}`);
  return res.data;
};

export const createPost = async (post) => {
  const res = await apiClient.post('/posts', post);
  return res.data;
};

export const updatePost = async (id, post) => {
  const res = await apiClient.put(`/posts/${id}`, post);
  return res.data;
};

export const deletePost = async (id) => {
  const res = await apiClient.delete(`/posts/${id}`);
  return res.data;
};

// --- Authentication Endpoints ---
export const login = async (credentials) => {
  const res = await apiClient.post('/auth/login', credentials);
  return res.data;
};

export const register = async (userData) => {
  const res = await apiClient.post('/auth/register', userData);
  return res.data;
};

// --- Comment Endpoints ---
export const getCommentsByPostId = async (postId) => {
  // Now calls the real backend endpoint
  const res = await apiClient.get(`/posts/${postId}/comments`);
  return res.data;
};

export const createComment = async (postId, commentData) => {
  // Now calls the real backend endpoint
  const res = await apiClient.post(`/posts/${postId}/comments`, commentData);
  return res.data;
};

// --- Admin Endpoints ---
export const getAllUsers = async () => {
    const res = await apiClient.get('/admin/users');
    return res.data;
};

export const deleteUser = async (userId) => {
    const res = await apiClient.delete(`/admin/users/${userId}`);
    return res.data;
};

export const updateUserRole = async (userId, role) => {
    const res = await apiClient.put(`/admin/users/${userId}/role?role=${role}`);
    return res.data;
};