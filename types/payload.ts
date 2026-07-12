import { SocialProvider } from "./enum";

export interface ThemeConfig {
  palette?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  updatedAt?: string;
}

export type SocialAuthPayload = {
  token: string;
  provider: SocialProvider;
  codeVerifier?: string;
};

export type RegisterPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type VerifyEmailPayload = {
  code: string;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

// events

export type CreateEventPayload = {
  name: string;
  isExternal: boolean;
};
export type UpdateEventPayload = Partial<{
  name: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  coverImage: string;
  extraMedia: string[];
  eventTypeId: string;
  templateId: string;
  theme: string;
  isCustomTheme: boolean;
  isPublic: boolean;
  isExternal: boolean;
  externalUrl: string;
}>;
