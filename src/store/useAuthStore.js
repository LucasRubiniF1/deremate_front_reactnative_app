import { create } from 'zustand';
import { saveToken, getToken, deleteToken } from '../utils/secureStore';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (userData, token) => {
    await saveToken(token);
    set({ user: userData, isAuthenticated: true });
  },

  logout: async () => {
    await deleteToken();
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    const token = await getToken();
    if (token) {
      // TODO: hacer una llamada al backend para recuperar la información y validar el token
      set({ user: { name: 'Matias' }, isAuthenticated: true });
    }
  },
}));

export default useAuthStore;
