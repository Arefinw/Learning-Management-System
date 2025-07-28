import api from './api';

export const getPathways = async (projectId) => {
  try {
    const res = await api.get(`/pathways?project=${projectId}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const createPathway = async (pathwayData) => {
  try {
    const res = await api.post('/pathways', pathwayData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getPathwayById = async (id) => {
  try {
    const res = await api.get(`/pathways/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const updatePathway = async (id, pathwayData) => {
  try {
    const res = await api.put(`/pathways/${id}`, pathwayData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const deletePathway = async (id) => {
  try {
    const res = await api.delete(`/pathways/${id}`);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const addPathwayItem = async (id, itemData) => {
  try {
    const res = await api.post(`/pathways/${id}/items`, itemData);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};
