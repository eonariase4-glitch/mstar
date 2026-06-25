import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export const searchRightmove = (params) => api.post('/scrape/rightmove', params).then((response) => response.data);

export const fetchComparables = (postcode) =>
  api.get(`/comparables/${encodeURIComponent(postcode)}`).then((response) => response.data);

export const fetchDeals = () => api.get('/deals').then((response) => response.data);

export const createDeal = (deal) => api.post('/deals', deal).then((response) => response.data);
