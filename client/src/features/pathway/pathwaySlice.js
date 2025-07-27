/**
 * @fileoverview This file defines the Redux slice for pathway management.
 * @description It handles fetching and managing pathway data, including pathways within a project and individual pathway details.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pathwayService from './pathwayService';

const initialState = {
  currentPathway: null,
  pathways: [],
  status: 'idle',
  error: null,
};

/**
 * @description Fetches all pathways for a given project.
 * @param {string} projectId - The ID of the project.
 * @param {object} thunkAPI - The Redux Thunk API object.
 * @returns {Promise<Array<object>>} - An array of pathway objects.
 */
export const fetchPathwaysByProject = createAsyncThunk(
  'pathway/fetchPathwaysByProject',
  async (projectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await pathwayService.getPathwaysByProject(projectId, token);
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
 * @description Fetches a single pathway by its ID.
 * @param {string} pathwayId - The ID of the pathway.
 * @param {object} thunkAPI - The Redux Thunk API object.
 * @returns {Promise<object>} - The pathway object.
 */
export const fetchPathwayById = createAsyncThunk(
  'pathway/fetchPathwayById',
  async (pathwayId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await pathwayService.getPathwayById(pathwayId, token);
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

const pathwaySlice = createSlice({
  name: 'pathway',
  initialState,
  reducers: {
    /**
     * @description Resets the pathway slice state to its initial state.
     * @param {object} state - The current state of the pathway slice.
     */
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPathwaysByProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPathwaysByProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pathways = action.payload;
      })
      .addCase(fetchPathwaysByProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPathwayById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPathwayById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPathway = action.payload;
      })
      .addCase(fetchPathwayById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { reset } = pathwaySlice.actions;
export default pathwaySlice.reducer;
