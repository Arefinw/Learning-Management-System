import api from './api';

export const getUsers = async () => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};
