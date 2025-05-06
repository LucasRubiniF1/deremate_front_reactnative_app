import OpenAPIClientAxios from 'openapi-client-axios';
import {getToken} from "../utils/secureStore";

const OPEN_API_URL = 'http://localhost:8080/v3/api-docs'; // EL PUERTO DEPENDE DEL ENV DE INTELLIJ REVISAR!!!

let apiClientInstance = null;

const initializeApiClient = async () => {
  const api = new OpenAPIClientAxios({ definition: OPEN_API_URL });

  try {
    const client = await api.init();

    client.axios.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    apiClientInstance = client;
    return client;

  } catch (error) {
    console.error(
      'Fallo al crear el cliente (puede ser por CORS o definición mal cargada)',
      error
    );
    apiClientInstance = null;
    throw error;
  }
};

export const getApiClient = async () => {
  if (!apiClientInstance) {
    return await initializeApiClient();
  }
  return apiClientInstance;
};
