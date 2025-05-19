import {UnauthorizedService} from "../api/apiClient";

const URL = "/v1/auth";

export const login = async (data) => {
  const response = await UnauthorizedService.post(`${URL}/login`, data)
  return response.data
}

export const signup = async (data) => {
  const response = await UnauthorizedService.post(`${URL}/signup`, data)
  return response.data
}

export const verify = async ({ token, email }) => {
  console.log('[Auth Service] Verifying email:', { email, token });
  try {
    const response = await UnauthorizedService.post(
      `${URL}/verify`,
      { token, email }
    );
    console.log('[Auth Service] Verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Auth Service] Verification error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const resendCode = async ({ email }) => {
  console.log('[Auth Service] Resending verification code to:', email);
  try {
    const response = await UnauthorizedService.post(
      `${URL}/resend-verification`,
      { email }
    );
    console.log('[Auth Service] Resend code response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Auth Service] Resend code error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const forgotPassword = async (email) => {
  const response = await UnauthorizedService.post(`${URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async ({ email, token, password }) => {
  const response = await UnauthorizedService.post(`${URL}/reset-password`, {
    email,
    token,
    password
  });
  return response.data;
};
