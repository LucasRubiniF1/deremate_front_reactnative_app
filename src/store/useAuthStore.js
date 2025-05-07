import { create } from 'zustand';
import { saveToken, getToken, deleteToken } from '../utils/secureStore';
import {login} from "../service/auth.service";
import {info} from "../service/user.service";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await login({ email, password });

      const { token } = response.data;

      await saveToken(token);

      const infoResponse = await info();
      set({ user: infoResponse.data, isAuthenticated: true, loading: false });

    } catch (error) {
      console.error('Login failed', error);
      set({ error: 'Login failed', loading: false });
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
      const response = await info();
      const user = response.data;

      set({ user, isAuthenticated: true });
    } catch (error) {
      console.log('No se pudo restaurar sesión', error);
      await deleteToken();
    }
  },
}));

export default useAuthStore;
