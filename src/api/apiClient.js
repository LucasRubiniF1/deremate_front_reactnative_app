import axios from 'axios';
import {getToken} from "../utils/secureStore";
import useAuthStore from "../store/useAuthStore";
import {replace} from "../navigator/RootNavigation";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

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

AuthorizedService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      // Connection error
    } else if ([401, 403].includes(error?.response?.status)) {
      // Force logout
      useAuthStore.getState().logout().then(r => {
        replace.push('(auth)/sign-in')
      });
    } else if ([400, 500].includes(error?.response?.status)) {
      if ([500].includes(error?.response?.status)) {
        // Internal server error
      }

      throw error?.response?.data;
    }
  }
);
