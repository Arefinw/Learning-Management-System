/**
 * @fileoverview This file defines the Redux slice for authentication.
 * @description It handles user registration, login, and logout, managing authentication state.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user.user : null,
  token: user ? user.token : null,
  isAuthenticated: user ? true : false,
  isLoading: false,
  error: null,
};

/**
 * @description Registers a new user.
 * @param {object} user - The user data (name, email, password).
 * @param {object} thunkAPI - The Redux Thunk API object.
 * @returns {Promise<object>} - The response data from the registration API call.
 */
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      const response = await authService.register(user);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * @description Logs in an existing user.
 * @param {object} user - The user credentials (email, password).
 * @param {object} thunkAPI - The Redux Thunk API object.
 * @returns {Promise<object>} - The response data from the login API call.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (user, thunkAPI) => {
    try {
      const response = await authService.login(user);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * @description Logs out the current user.
 * @returns {Promise<void>}
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * @description Resets the authentication state.
     * @param {object} state - The current state of the auth slice.
     */
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
