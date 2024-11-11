import { api } from './api.service';
import { BASE_URL } from '../utils/constants';

// Helper function to set the base URL (can be adjusted based on user roles if needed)
export const SetBaseUrl = (): string => {
  let base_url = BASE_URL;

  return base_url;
};


// POST request with base URL
export const POST = async (url: string, data: any = null, config: any = null) => {
  const response = await api.post(SetBaseUrl() + url, data, config);
  return response.data;
};


// GET request with optional parameters
export const GET = async (url: string, params: any = null) => {
  const response = await api.get(SetBaseUrl() + url, { params });
  return response.data;
};

// PUT request with data and ID
export const PUT = async (url: string, id: string | number, data: any = null, config: any = null) => {
  const response = await api.put(SetBaseUrl() + url + "/" + id, data, config);
  return response.data;
};

// PATCH request
export const PATCH = async (url: string, data: any = null, config: any = null) => {
  const response = await api.patch(SetBaseUrl() + url, data, config);
  return response.data;
};

// DELETE request
export const DELETE = async (url: string, id: string | number) => {
  const response = await api.delete(SetBaseUrl() + url + "/" + id);
  return response.data;
};
