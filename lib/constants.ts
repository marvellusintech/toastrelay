import { publicEnv } from "@/lib/env/public";

export const APP_NAME = "ToastRelay";
export const AUTH_COOKIE_NAME = "toastrelay_token";
export const API_ENDPOINT = `${publicEnv.apiBaseUrl}/v1`;

export const EVENT_TYPES = [
  "wedding",
  "birthday",
  "anniversary",
  "social",
  "other",
] as const;

export const DASHBOARD_TABS = ["my-stages", "discover", "analytics", "circles"] as const;
export const EVENT_TABS = ["toasts", "guests", "moments", "pass", "thread"] as const;

export const MAX_EVENT_NAME_LENGTH = 100;
export const MAX_EVENT_DESCRIPTION_LENGTH = 500;
