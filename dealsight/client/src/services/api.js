import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

export const searchRightmove = (params) => api.post('/scrape/rightmove', params).then((response) => response.data);

export const fetchComparables = (postcode) =>
  api.get(`/comparables/${encodeURIComponent(postcode)}`).then((response) => response.data);

export const fetchDeals = () => api.get('/deals').then((response) => response.data);

export const createDeal = (deal) => api.post('/deals', deal).then((response) => response.data);
