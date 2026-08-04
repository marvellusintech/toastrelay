import { apiClient } from "@/lib/api";
import { QucikData, RevenueTrend, User } from "@/types/response";

export async function getUserApi(accessToken?: string | null) {
  const response = await apiClient.get<User>(`/auth/user`, {
    withCredentials: true,
    accessToken,
  });
  return response;
}

export async function getAnalyticsSummaryApi(accessToken?: string | null) {
  const response = await apiClient.get<QucikData>(`/analytics/summary`, {
    withCredentials: true,
    accessToken,
  });
  return response;
}

export async function getAnalyticsRevenueTrendApi(accessToken?: string | null) {
  const response = await apiClient.get<RevenueTrend[]>(
    `/analytics/revenue-trend`,
    {
      withCredentials: true,
      accessToken,
    },
  );
  return response;
}
