import { AUTH_COOKIE_NAME } from "@/lib/constants";


export function hasAuthToken(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
  return !!match && match[1] !== "";
}

export function saveAuthToken(
  token: string, 
  expiresOn?: string | Date | number
): void {
  if (typeof document === "undefined") return;

  let expires: string;

  if (expiresOn) {
    let dateObj: Date;
    if (expiresOn instanceof Date) {
      dateObj = expiresOn;
    } else if (typeof expiresOn === "number") {
      dateObj = new Date(expiresOn < 1e12 ? expiresOn * 1000 : expiresOn);
    } else {
      dateObj = new Date(expiresOn);
    }

    if (!isNaN(dateObj.getTime())) {
      expires = dateObj.toUTCString();
    } else {
      expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    }
  } else {
    // Fallback: 7 days default if no expiration date is provided
    expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  }

  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}

export function removeAuthToken(): void {
  if (typeof document === "undefined") return;

  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;
}