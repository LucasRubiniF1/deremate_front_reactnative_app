import { create } from 'zustand';
import { deleteToken, getToken, saveToken } from '../utils/secureStore';
import { login, signup } from "../service/auth.service";
import { info } from "../service/user.service";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isUserCreated: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await login({ email, password });

      const { token } = response.data;

      await saveToken(token);

      const infoResponse = await info();
      set({ user: infoResponse, isAuthenticated: true, loading: false, error: false });

    } catch (error) {
      console.error('Login failed', error);
      set({ error: 'Login failed', loading: false });
    }
  },

  signUp: async (email, password, firstName, lastName) => {
    set({ loading: true, error: null, isUserCreated: false });

    try {
      const response = await signup({ email, password, firstName, lastName });

      if (response.statusCode === 201) {
        set({ loading: false, error: null, isUserCreated: true });
      } else {
        set({ loading: false, error: "Error inesperado al crear la cuenta.", isUserCreated: false });
      }
      
    } catch (error) {
      set({ error: 'Error al crear la cuenta', loading: false, isUserCreated: false });
    }
  },

  logout: async () => {
    await deleteToken();
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    const token = await getToken();
    if (!token) return;

    try {
      const user = await info();

      set({ user, isAuthenticated: true });
    } catch (error) {
      console.log('No se pudo restaurar sesión', error);
      await deleteToken();
    }
  },
}));

export default useAuthStore;
