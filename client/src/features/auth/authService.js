import axios from 'axios';

const API_URL = '/api/users/';

/**
 * @description Registers a user and sets the user data in local storage.
 * @param {object} userData - The user data (name, email, password).
 * @returns {object} - The user data and token.
 */
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

/**
 * @description Logs in a user and sets the user data in local storage.
 * @param {object} userData - The user data (email, password).
 * @returns {object} - The user data and token.
 */
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

/**
 * @description Logs out the current user by removing user data from local storage.
 * @returns {void}
 */
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
