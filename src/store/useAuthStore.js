import { create } from 'zustand';
import { deleteToken, getToken, saveToken } from '../utils/secureStore';
import {
  login,
  resendCode,
  signup,
  verify,
  forgotPassword,
  resetPassword,
} from '../service/auth.service';
import { info } from '../service/user.service';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isUserCreated: false,
  loading: false,
  error: null,
  isEmailVerified: { email: null, password: null, verified: false },
  setEmailVerified: data => set({ isEmailVerified: data }),

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

      console.warn(error?.response.data);
      if (error?.response?.data?.message === 'The email has not been verified.') {
        set({ error: null, loading: false });
        return 'EMAIL_NOT_VERIFIED';
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
    console.log('[AuthStore] Starting email verification:', { email, token });
    set({ loading: true, error: null });

    try {
      await verify({ token, email });
      console.log('[AuthStore] Email verification successful');

      const { password } = get().isEmailVerified;

      set({ loading: false, error: false, isEmailVerified: { email, verified: true } });

      await get().login(email, password);
    } catch (error) {
      console.error('[AuthStore] Email verification failed:', error);

      let errorMessage = 'INCORRECT_CODE';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      const { password } = get().isEmailVerified;

      set({
        error: errorMessage,
        loading: false,
        isEmailVerified: { email, password, verified: false },
      });
    }
  },

  resendCode: async email => {
    console.log('[AuthStore] Starting resend code for:', email);
    set({ loading: true, error: null });

    try {
      await resendCode({ email });
      console.log('[AuthStore] Resend code successful');

      set({ loading: false, error: false });
    } catch (error) {
      console.error('[AuthStore] Resend code failed:', error);

      let errorMessage = 'No fue posible reenviar el código';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      set({
        error: errorMessage,
        loading: false,
        isEmailVerified: { email, verified: false },
      });
    }
  },

  resetPasswordRequest: async email => {
    console.log('[AuthStore] Starting password reset request for email:', email);
    set({ loading: true, error: null });

    try {
      console.log('[AuthStore] Calling forgotPassword service...');
      const response = await forgotPassword(email);
      console.log('[AuthStore] forgotPassword response:', response);

      set({ loading: false, error: false });
      console.log('[AuthStore] Password reset request successful');
      return true;
    } catch (error) {
      console.error('[AuthStore] Password reset request failed:', error);
      console.error('[AuthStore] Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });

      const errorMessage =
        error?.response?.data?.message || 'Error al solicitar el cambio de contraseña';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  resetPassword: async (email, token, password) => {
    console.log('[AuthStore] Starting password reset for email:', email);
    set({ loading: true, error: null });

    try {
      console.log('[AuthStore] Calling resetPassword service...');
      const response = await resetPassword({ email, token, password });
      console.log('[AuthStore] resetPassword response:', response);

      set({ loading: false, error: false });
      console.log('[AuthStore] Password reset successful');
      return true;
    } catch (error) {
      console.error('[AuthStore] Password reset failed:', error);
      console.error('[AuthStore] Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });

      const errorMessage = error?.response?.data?.message || 'Error al restablecer la contraseña';
      set({ error: errorMessage, loading: false });
      return false;
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
