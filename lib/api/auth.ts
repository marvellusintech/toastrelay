import { apiClient, ApiError } from "@/lib/api";
import {
  ChangePasswordDto,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  SetPasswordPayload,
  SocialAuthPayload,
  UpdateProfilePayload,
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

export async function updateProfileApi(payload: UpdateProfilePayload) {
  const response = await apiClient.patch<User>(`/auth/profile`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function setPasswordApi(payload: SetPasswordPayload) {
  const response = await apiClient.post<AuthSession>(`/auth/set-password`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function changePasswordApi(payload: ChangePasswordDto) {
  const response = await apiClient.post<AuthSession>(`/auth/change-password`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function forgotPasswordApi(payload: ForgotPasswordPayload) {
  const response = await apiClient.post<null>(`/auth/forgot-password`, {
    data: payload,
    withCredentials: false,
  });
  return response;
}

export async function resetPasswordApi(payload: ResetPasswordPayload) {
  const response = await apiClient.post<AuthSession>(`/auth/reset-password`, {
    data: payload,
    withCredentials: false,
  });
  return response;
}
