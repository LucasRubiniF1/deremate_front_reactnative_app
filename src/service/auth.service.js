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

export const verify = async (data) => {
  console.log('[Auth Service] Starting email verification process:', {
    endpoint: `${URL}/verify`,
    requestData: data
  });
  try {
    const response = await UnauthorizedService.post(
      `${URL}/verify`,
      data
    );
    console.log('[Auth Service] Email verification successful:', {
      status: response.status,
      data: response.data
    });
    return response.data;
  } catch (error) {
    console.error('[Auth Service] Email verification failed:', {
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      },
      requestData: data
    });
    throw error;
  }
};

export const resendCode = async (data) => {
  console.log('[Auth Service] Starting verification code resend process:', {
    endpoint: `${URL}/resend-verification`,
    requestData: data
  });
  try {
    const response = await UnauthorizedService.post(
      `${URL}/resend-verification`,
      data
    );
    console.log('[Auth Service] Verification code resend successful:', {
      status: response.status,
      data: response.data
    });
    return response.data;
  } catch (error) {
    console.error('[Auth Service] Verification code resend failed:', {
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      },
      requestData: data
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
