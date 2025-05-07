import axios from 'axios';
import {getToken} from "../utils/secureStore";

const BASE_URL = 'http://localhost:8080/api';

export const UnauthorizedService = axios.create({
  baseURL: BASE_URL,
});

export const AuthorizedService = axios.create({
  baseURL: BASE_URL,
});

AuthorizedService.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

