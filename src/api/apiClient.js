import OpenAPIClientAxios from 'openapi-client-axios';

const OPEN_API_URL = 'http://localhost:8080/v3/api-docs'; // EL PUERTO DEPENDE DEL ENV DE INTELLIJ REVISAR!!!

let api_client = null;


const initializeApiClient = async () => {
  const api = new OpenAPIClientAxios({ definition: OPEN_API_URL });
  try {
    const client = await api.init();

    client.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

  }
  catch (error) {
    console.error('Fallo al crear el cliente (preocuparse aunque seguramente sea CORS)', error);
    apiClientInstance = null;
    throw error;
  }
  apiClientInstance = client;
  return apiClientInstance;
}



export const getApiClient = async () => {
  if (!apiClientInstance) {
    return await initializeApiClient();
  }
  return Promise.resolve(apiClientInstance);
};