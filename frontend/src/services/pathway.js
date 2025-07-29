import api from './api';

export const getPathways = async (projectId) => {
  const res = await api.get(`/pathways?project=${projectId}`);
  return res.data;
};

export const createPathway = async (pathwayData) => {
  const res = await api.post('/pathways', pathwayData);
  return res.data;
};

export const getPathwayById = async (id) => {
  const res = await api.get(`/pathways/${id}`);
  return res.data;
};

export const updatePathway = async (id, pathwayData) => {
  const res = await api.put(`/pathways/${id}`, pathwayData);
  return res.data;
};

export const deletePathway = async (id) => {
  const res = await api.delete(`/pathways/${id}`);
  return res.data;
};

export const addPathwayItem = async (id, itemData) => {
  const res = await api.post(`/pathways/${id}/items`, itemData);
  return res.data;
};
