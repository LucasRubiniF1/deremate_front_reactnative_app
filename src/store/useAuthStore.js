import { create } from 'zustand';
import { deleteToken, getToken, saveToken } from '../utils/secureStore';
import { login, resendCode, signup, verify } from "../service/auth.service";
import { info } from "../service/user.service";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isUserCreated: false,
  loading: false,
  error: null,
  isEmailVerified: { email: null, verified: false},
  setEmailVerified: (data) => set({ isEmailVerified: data }),

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

      if (error?.response?.status === 401) {
        set({ error: 'EMAIL_NOT_VERIFIED', loading: false });
      } else {
        set({ error: 'Login failed', loading: false });
      }
    }
  },

  signUp: async (email, password, firstName, lastName) => {
    set({ loading: true, error: null, isUserCreated: false });

    try {
      await signup({ email, password, firstName, lastName });

      set({ loading: false, error: false, isUserCreated: true });

    } catch (error) {
      set({ error: 'Error al crear la cuenta', loading: false, isUserCreated: false });
    }
  },

  verifyEmail: async (token, email) => {
    set({ loading: true, error: null });

    try {
      await verify({ token, email });

      set({ loading: false, error: false, isEmailVerified: { email, verified: true } });
      
    } catch (error) {
      console.log(error);
      
      set({ error: 'INCORRECT_CODE', loading: false, isEmailVerified: { email, verified: false } });
    }
  },

  resendCode: async (email) => {
    set({ loading: true, error: null });

    try {
      await resendCode({ email });

      set({ loading: false, error: false });
      
    } catch (error) {
      console.log(error);
      
      set({ error: 'No fue posible reenviar el código', loading: false, isEmailVerified: { email, verified: false } });
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
