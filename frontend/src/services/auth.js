import api from './api';

export const registerUser = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await api.post('/auth/login', userData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getMe = async () => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};
