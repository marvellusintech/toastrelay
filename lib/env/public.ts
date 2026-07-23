function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export const publicEnv = {
  apiBaseUrl: stripTrailingSlash(process.env.API_BASE_URL ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL ?process.env.NEXT_PUBLIC_API_BASE_URL  : ""),
  appUrl: stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};
