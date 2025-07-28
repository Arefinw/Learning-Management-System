import api from './api';

export const getProjects = async () => {
  try {
    const res = await api.get('/projects');
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const createProject = async (projectData) => {
  try {
    const res = await api.post('/projects', projectData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getProjectById = async (id) => {
  try {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const res = await api.put(`/projects/${id}`, projectData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const deleteProject = async (id) => {
  try {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getProjectTree = async (id) => {
  try {
    const res = await api.get(`/projects/${id}/tree`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};
