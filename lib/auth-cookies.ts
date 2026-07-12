import { AUTH_COOKIE_NAME } from "@/lib/constants";


export function saveAuthToken(token: string, days = 7): void {
  if (typeof document === "undefined") return;

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
}

export function removeAuthToken(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
}