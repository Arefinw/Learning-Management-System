import  api  from './api';

export const getWorkspaces = async () => {
  const res = await api.get('/workspaces');
  return res.data;
};

export const createWorkspace = async (workspaceData) => {
  const res = await api.post('/workspaces', workspaceData);
  return res.data;
};

export const getWorkspaceById = async (id) => {
  const res = await api.get(`/workspaces/${id}`);
  return res.data;
};

export const updateWorkspace = async (id, workspaceData) => {
  const res = await api.put(`/workspaces/${id}`, workspaceData);
  return res.data;
};

export const deleteWorkspace = async (id) => {
  const res = await api.delete(`/workspaces/${id}`);
  return res.data;
};

export const addWorkspaceMember = async (id, memberData) => {
  const res = await api.post(`/workspaces/${id}/members`, memberData);
  return res.data;
};
