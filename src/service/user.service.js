import { AuthorizedService } from "../api/apiClient";

const URL = "/v1/user";

export const info = async () => {
  const response = await AuthorizedService.get(`${URL}/info`)
  return response.data
}
