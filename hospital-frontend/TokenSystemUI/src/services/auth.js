import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/admin/create-user', userData);
  return response.data;
};