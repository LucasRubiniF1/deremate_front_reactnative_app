import axios from 'axios';
import { getToken } from '../utils/secureStore';
import useAuthStore from '../store/useAuthStore';
import { replace } from '../navigator/RootNavigation';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
console.log('[API Client] Base URL:', BASE_URL);

export const UnauthorizedService = axios.create({
  baseURL: BASE_URL,
});

export const AuthorizedService = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor for UnauthorizedService
UnauthorizedService.interceptors.request.use(
  config => {
    console.log('[API Client] Making request to:', config.url);
    console.log('[API Client] Request config:', {
      method: config.method,
      baseURL: config.baseURL,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  error => {
    console.error('[API Client] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for UnauthorizedService
UnauthorizedService.interceptors.response.use(
  response => {
    console.log('[API Client] Response received:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('[API Client] Response error:', {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        data: error.config?.data,
      },
    });
    return Promise.reject(error);
  }
);

AuthorizedService.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

AuthorizedService.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (!error.response) {
      console.error('[API Client] Network error:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });
    } else if ([401, 403].includes(error?.response?.status)) {
      // Force logout
      useAuthStore
        .getState()
        .logout()
        .then(r => {
          replace('Auth', {
            screen: 'SignIn',
          });
        });
    } else if ([400, 500].includes(error?.response?.status)) {
      if ([500].includes(error?.response?.status)) {
        // Internal server error
      }

      throw error?.response?.data;
    }
  }
);
