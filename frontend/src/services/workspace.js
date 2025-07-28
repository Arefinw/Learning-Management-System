import api from './api';

export const getWorkspaces = async () => {
  try {
    const res = await api.get('/workspaces');
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const createWorkspace = async (workspaceData) => {
  try {
    const res = await api.post('/workspaces', workspaceData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getWorkspaceById = async (id) => {
  try {
    const res = await api.get(`/workspaces/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const updateWorkspace = async (id, workspaceData) => {
  try {
    const res = await api.put(`/workspaces/${id}`, workspaceData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const deleteWorkspace = async (id) => {
  try {
    const res = await api.delete(`/workspaces/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const addWorkspaceMember = async (id, memberData) => {
  try {
    const res = await api.post(`/workspaces/${id}/members`, memberData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};
