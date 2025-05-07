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
