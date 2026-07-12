import { apiClient, ApiError } from "@/lib/api";
import {
  LoginPayload,
  RegisterPayload,
  SocialAuthPayload,
  VerifyEmailPayload,
} from "@/types/payload";
import { User } from "@/types/response";

export type AuthSession = {
  user: User;
  token: string;
  tokenExpiresOn: Date;
};

export function loginApi(payload: LoginPayload) {
  return apiClient<AuthSession, LoginPayload>("/auth/login", {
    method: "POST",
    data: payload,
    withCredentials: true,
  });
}

export async function createAccountApi(payload: RegisterPayload) {
  const response = await apiClient.post<AuthSession>(`/auth/register`, {
    data: payload,
  });
  return response;
}

export async function verifyEmailApi(payload: VerifyEmailPayload) {
  const response = await apiClient.post<AuthSession>(`/auth/email/verify`, {
    data: payload,
  });
  return response;
}

export async function socialAuthApi(payload: SocialAuthPayload) {
  const response = await apiClient.post<AuthSession>(`/auth/social`, {
    data: payload,
    withCredentials: false,
  });
  return response;
}
