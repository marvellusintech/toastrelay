import { apiClient } from "@/lib/api";
import {
  AddCircleMembersPayload,
  CreateCirclePayload,
  LinkEventCirclePayload,
} from "@/types/payload";
import { Circle } from "@/types/response";

export async function createCircleApi(payload: CreateCirclePayload) {
  const response = await apiClient.post<Circle>(`/circles`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function getMyCirclesApi() {
  const response = await apiClient.get<Circle[]>(`/circles/my-circles`, {
    withCredentials: true,
  });
  return response;
}

export async function addCircleMembersApi(
  circleId: string,
  payload: AddCircleMembersPayload,
) {
  const response = await apiClient.post<{ count: number }>(
    `/circles/${circleId}/members`,
    {
      data: payload,
      withCredentials: true,
    },
  );
  return response;
}

export async function linkEventCircleApi(payload: LinkEventCirclePayload) {
  const response = await apiClient.post<Circle>(`/circles/link-event`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}
