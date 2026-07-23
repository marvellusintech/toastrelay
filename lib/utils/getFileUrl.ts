const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

import { API_ENDPOINT,  } from "@/lib/constants";

export function getFileUrl(key?: string | null): string {
  if (!key) return "";

 if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("blob:")) {
    return key;
  }

 const cleanBase = API_ENDPOINT.endsWith("/") ? API_ENDPOINT.slice(0, -1) : API_ENDPOINT;

const cleanKey = key.startsWith("/") ? key.slice(1) : key;

 return `${cleanBase}/uploads/media?key=${encodeURIComponent(cleanKey)}`;

}