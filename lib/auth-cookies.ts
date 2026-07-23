import { AUTH_COOKIE_NAME } from "@/lib/constants";


export function saveAuthToken(
  token: string, 
  expiresOn?: string | Date
): void {
  if (typeof document === "undefined") return;

  let expires: string;

  if (expiresOn) {
    // Convert string or Date into a valid UTC string for cookies
    const dateObj = typeof expiresOn === "string" ? new Date(expiresOn) : expiresOn;
    expires = dateObj.toUTCString();
  } else {
    // Fallback: 7 days default if no expiration date is provided
    expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
}
export function removeAuthToken(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
}