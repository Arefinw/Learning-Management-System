/**
 * @fileoverview This file configures the Redux store for the application.
 * @description It combines various slices (auth, project, pathway) into a single store.
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/project/projectSlice';
import pathwayReducer from '../features/pathway/pathwaySlice';

/**
 * @description Configures and creates the Redux store.
 * @returns {object} The configured Redux store.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    pathway: pathwayReducer,
  },
});
