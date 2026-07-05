import { apiClient } from "@/lib/api";
import { User } from "@/types/response";

export async function getUserApi() {
  const response = await apiClient.get<User>(`/user`, {
    withCredentials: true,
  });
  return response;
}
