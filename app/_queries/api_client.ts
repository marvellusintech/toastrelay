import { API_ENDPOINT, AUTH_COOKIE_NAME } from "@/lib/constants";
import type { ApiResponse, HttpMethod } from "@/lib/types";

type ApiClientOptions<TData, TParams> = {
  method?: HttpMethod;
  data?: TData;
  params?: TParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
  withCredentials?: boolean;
  suppressGlobalError?: boolean;
};

export class ApiError extends Error {
  statusCode: number;
  status: number;
  payload?: ApiResponse<unknown>;
  isCanceled: boolean;
  suppressGlobalError: boolean;

  constructor(
    message: string,
    options: {
      statusCode?: number;
      payload?: ApiResponse<unknown>;
      isCanceled?: boolean;
      suppressGlobalError?: boolean;
    } = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = options.statusCode ?? 0;
    this.status = this.statusCode;
    this.payload = options.payload;
    this.isCanceled = options.isCanceled ?? false;
    this.suppressGlobalError = options.suppressGlobalError ?? false;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function buildUrl<TParams>(url: string, params?: TParams) {
  const base = url.startsWith("http") ? url : `${API_ENDPOINT}${url}`;
  const nextUrl = new URL(
    base || url,
    typeof window === "undefined" ? "http://localhost" : window.location.origin
  );

  if (params && typeof params === "object") {
    Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === "string" && value.trim() === "") return;
      nextUrl.searchParams.set(key, String(value));
    });
  }

  return nextUrl.toString();
}

export async function apiClient<
  TResponse,
  TData = unknown,
  TParams = Record<string, unknown>,
>(
  url: string,
  options: ApiClientOptions<TData, TParams> = {}
): Promise<ApiResponse<TResponse>> {
  const method = options.method ?? "GET";
  const token = options.withCredentials ? readCookie(AUTH_COOKIE_NAME) : null;
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(buildUrl(url, options.params), {
      method,
      headers,
      body: options.data ? JSON.stringify(options.data) : undefined,
      signal: options.signal,
    });

    const payload = (await response.json().catch(() => null)) as ApiResponse<TResponse> | null;

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }

      throw new ApiError(payload?.message ?? `Request failed with ${response.status}`, {
        statusCode: response.status,
        payload: payload as ApiResponse<unknown> | undefined,
        suppressGlobalError: options.suppressGlobalError,
      });
    }

    return (
      payload ?? {
        message: "OK",
        data: undefined as TResponse,
        meta: null,
        rate_limit: null,
        requested_entity: `${method} ${url}`,
      }
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request canceled", {
        isCanceled: true,
        suppressGlobalError: true,
      });
    }

    throw new ApiError(error instanceof Error ? error.message : "Network request failed", {
      suppressGlobalError: options.suppressGlobalError,
    });
  }
}
