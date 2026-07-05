import { API_ENDPOINT, AUTH_COOKIE_NAME } from "@/lib/constants";
import type { ApiResponse, HttpMethod } from "@/lib/types";

type RequestBody = BodyInit | Record<string, unknown> | unknown[] | null;

type ApiClientOptions<TData, TParams> = {
  method?: HttpMethod;
  data?: TData;
  params?: TParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
  withCredentials?: boolean;
  accessToken?: string | null;
  suppressGlobalError?: boolean;
  onUnauthorized?: () => void;
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
    } = {},
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
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );

  if (params && typeof params === "object") {
    Object.entries(params as Record<string, unknown>).forEach(
      ([key, value]) => {
        if (value === undefined || value === null) return;
        if (typeof value === "string" && value.trim() === "") return;
        nextUrl.searchParams.set(key, String(value));
      },
    );
  }

  return nextUrl.toString();
}

function buildRequestBody(data: RequestBody | undefined) {
  if (data === undefined || data === null) return undefined;
  if (
    (typeof FormData !== "undefined" && data instanceof FormData) ||
    (typeof Blob !== "undefined" && data instanceof Blob) ||
    (typeof URLSearchParams !== "undefined" && data instanceof URLSearchParams) ||
    (typeof ArrayBuffer !== "undefined" && data instanceof ArrayBuffer)
  ) {
    return data;
  }

  return JSON.stringify(data);
}

function shouldSetJsonContentType(data: RequestBody | undefined) {
  if (data === undefined || data === null) return false;
  if (typeof FormData !== "undefined" && data instanceof FormData) return false;
  if (typeof Blob !== "undefined" && data instanceof Blob) return false;
  if (typeof URLSearchParams !== "undefined" && data instanceof URLSearchParams) return false;
  if (typeof ArrayBuffer !== "undefined" && data instanceof ArrayBuffer) return false;
  return true;
}

// --- TypeScript types for the functional methods ---
type ApiClientFunction = <
  TResponse,
  TData = RequestBody,
  TParams = Record<string, unknown>,
>(
  url: string,
  options?: ApiClientOptions<TData, TParams>
) => Promise<ApiResponse<TResponse>>;

interface ApiClientInterface extends ApiClientFunction {
  get: <TResponse, TParams = Record<string, unknown>>(
    url: string,
    options?: Omit<ApiClientOptions<never, TParams>, "method" | "data">
  ) => Promise<ApiResponse<TResponse>>;

  post: <TResponse, TData = RequestBody, TParams = Record<string, unknown>>(
    url: string,
    options?: Omit<ApiClientOptions<TData, TParams>, "method">
  ) => Promise<ApiResponse<TResponse>>;

  put: <TResponse, TData = RequestBody, TParams = Record<string, unknown>>(
    url: string,
    options?: Omit<ApiClientOptions<TData, TParams>, "method">
  ) => Promise<ApiResponse<TResponse>>;

  delete: <TResponse, TParams = Record<string, unknown>>(
    url: string,
    options?: Omit<ApiClientOptions<never, TParams>, "method" | "data">
  ) => Promise<ApiResponse<TResponse>>;

  patch: <TResponse, TData = RequestBody, TParams = Record<string, unknown>>(
    url: string,
    options?: Omit<ApiClientOptions<TData, TParams>, "method">
  ) => Promise<ApiResponse<TResponse>>;
}

// Core API client execution
const client = (async function <
  TResponse,
  TData = RequestBody,
  TParams = Record<string, unknown>,
>(
  url: string,
  options: ApiClientOptions<TData, TParams> = {},
): Promise<ApiResponse<TResponse>> {
  const method = options.method ?? "GET";
  const token =
    options.accessToken ??
    (options.withCredentials ? readCookie(AUTH_COOKIE_NAME) : null);
  const headers = new Headers(options.headers);
  const body = buildRequestBody(options.data as RequestBody | undefined);

  if (
    shouldSetJsonContentType(options.data as RequestBody | undefined) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(buildUrl(url, options.params), {
      method,
      headers,
      body,
      signal: options.signal,
    });

    const payload = (await response
      .json()
      .catch(() => null)) as ApiResponse<TResponse> | null;

    if (!response.ok) {
      if (response.status === 401) {
        if (options.onUnauthorized) {
          options.onUnauthorized();
        } else if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
      }

      throw new ApiError(
        payload?.message ?? `Request failed with ${response.status}`,
        {
          statusCode: response.status,
          payload: payload as ApiResponse<unknown> | undefined,
          suppressGlobalError: options.suppressGlobalError,
        },
      );
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

    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed",
      {
        suppressGlobalError: options.suppressGlobalError,
      },
    );
  }
} as unknown) as ApiClientInterface;

// Attach HTTP method shortcuts
client.get = (url, options) => 
  client(url, { ...options, method: "GET" });

client.post = (url, options) => 
  client(url, { ...options, method: "POST" });

client.put = (url, options) => 
  client(url, { ...options, method: "PUT" });

client.delete = (url, options) => 
  client(url, { ...options, method: "DELETE" });

client.patch = (url, options) => 
  client(url, { ...options, method: "PATCH" });

export { client as apiClient };