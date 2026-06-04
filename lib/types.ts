export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  meta: Meta | null;
  rate_limit: RateLimit | null;
  error?: boolean;
  requested_entity: `${HttpMethod} ${string}`;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}
