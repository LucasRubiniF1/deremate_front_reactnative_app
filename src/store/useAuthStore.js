import {create} from 'zustand';
import {deleteToken, getToken, saveToken} from '../utils/secureStore';
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
      console.warn(infoResponse);
      set({ user: infoResponse, isAuthenticated: true, loading: false });

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
      const user = await info();

      set({ user, isAuthenticated: true });
    } catch (error) {
      console.log('No se pudo restaurar sesión', error);
      await deleteToken();
    }
  },
}));

export default useAuthStore;
