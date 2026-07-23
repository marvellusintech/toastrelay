import { apiClient } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";


export type UploadFolder = "users" | "events" | "moments" | "threads";

export type PresignedUploadPayload = {
  contentType: string;
  fileName: string;
  folder: UploadFolder;
};

export type PresignedUpload = {
  uploadUrl: string;
  fileUrl: string;
  key: string;
};

export function getPresignedUploadUrlApi(payload: PresignedUploadPayload) {
  return apiClient<PresignedUpload, PresignedUploadPayload>("/uploads/presigned-url", {
    method: "POST",
    data: payload,
    withCredentials: true,
  });
}

export async function uploadFileToBucketApi(file: File, folder: UploadFolder) {
  const response = await getPresignedUploadUrlApi({
    contentType: file.type,
    fileName: file.name,
    folder,
  });

  const upload = response.data;
  if (!upload?.uploadUrl || !upload.fileUrl) {
    throw new Error("Upload handshake did not return upload details.");
  }

  const uploadResponse = await fetch(upload.uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file bytes to storage.");
  }

  return upload;
}

export type UploadResult = ApiResponse<PresignedUpload>;
