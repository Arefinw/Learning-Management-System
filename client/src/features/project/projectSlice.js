/**
 * @fileoverview This file defines the Redux slice for project management.
 * @description It handles fetching and managing project data, including projects within a workspace and individual project details.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from './projectService';

const initialState = {
  projects: [],
  currentProject: null,
  pathwaysInProject: [],
  status: 'idle',
  error: null,
};

/**
 * @description Fetches all projects for a given workspace.
 * @param {string} workspaceId - The ID of the workspace.
 * @param {object} thunkAPI - The Redux Thunk API object.
 * @returns {Promise<Array<object>>} - An array of project objects.
 */
export const fetchProjectsByWorkspace = createAsyncThunk(
  'project/fetchProjectsByWorkspace',
  async (workspaceId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.getProjectsByWorkspace(workspaceId, token);
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
 * @description Fetches a single project by its ID.
 * @param {string} projectId - The ID of the project.
 * @param {object} thunkAPI - The Redux Thunk API object.
 * @returns {Promise<object>} - The project object.
 */
export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (projectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await projectService.getProjectById(projectId, token);
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

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    /**
     * @description Sets the current project in the state.
     * @param {object} state - The current state of the project slice.
     * @param {object} action - The action object containing the project payload.
     */
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    /**
     * @description Resets the project slice state to its initial state.
     * @param {object} state - The current state of the project slice.
     */
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsByWorkspace.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectsByWorkspace.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjectsByWorkspace.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCurrentProject, reset } = projectSlice.actions;
export default projectSlice.reducer;
