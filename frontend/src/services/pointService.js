import apiClient from './authService';

const BASE_URL = '/points';

const getPoints = () => {
  return apiClient.get(BASE_URL);
};

const addPoint = (pointData) => {
  return apiClient.post(BASE_URL, pointData);
};

export const pointService = {
  getPoints,
  addPoint,
};