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
  const response = await UnauthorizedService.post(`${URL}/verify`, data);
  return response.data;
};

export const resendCode = async (data) => {
  const response = await UnauthorizedService.post(`${URL}/resend-verification`, data);
  return response.data;
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
