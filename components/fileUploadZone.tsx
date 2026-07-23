"use client";

import * as React from "react";
import { uploadFileToBucketApi, type UploadFolder } from "@/lib/api/fileUpload";
import { cn } from "@/lib/utils";

export interface UploadResult {
  key: string;
  fileUrl: string;
  uploadUrl: string;
}

interface FileUploadZoneProps {
  folder?: UploadFolder;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  className?: string;
  maxPhotoSizeMb?: number; // e.g. 5
  maxVideoSizeMb?: number; // e.g. 10
  currentFileCount?: number;
  maxFilesLimit?: number; // e.g. 10
  onUploadSuccess: (results: UploadResult[]) => void;
  onUploadError?: (error: string) => void;
  /** Pass custom UI slot. Exposes upload status */
  children: (props: { isUploading: boolean }) => React.ReactNode;
}

export function FileUploadZone({
  folder = "events",
  multiple = false,
  accept = "image/*,video/*",
  disabled = false,
  className,
  maxPhotoSizeMb = 5,
  maxVideoSizeMb = 10,
  currentFileCount = 0,
  maxFilesLimit,
  onUploadSuccess,
  onUploadError,
  children,
}: FileUploadZoneProps) {
  const [isUploading, setIsUploading] = React.useState(false);

  const validateAndFilterFiles = (files: File[]): File[] => {
    // 1. Check max item limit if specified
    let allowedFiles = files;
    if (maxFilesLimit !== undefined) {
      const remainingSlots = Math.max(0, maxFilesLimit - currentFileCount);
      if (remainingSlots === 0) {
        onUploadError?.(`Maximum limit of ${maxFilesLimit} uploads reached.`);
        return [];
      }
      if (files.length > remainingSlots) {
        onUploadError?.(
          `You can only add ${remainingSlots} more item(s). Exceeded limit.`,
        );
        allowedFiles = files.slice(0, remainingSlots);
      }
    }

    // 2. Size validation for each file
    const validFiles: File[] = [];
    for (const file of allowedFiles) {
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo
        ? maxVideoSizeMb * 1024 * 1024
        : maxPhotoSizeMb * 1024 * 1024;

      if (file.size > maxSize) {
        const limitLabel = isVideo
          ? `${maxVideoSizeMb}MB for videos`
          : `${maxPhotoSizeMb}MB for photos`;
        onUploadError?.(
          `File "${file.name}" exceeds the maximum allowed size of ${limitLabel}.`,
        );
        continue;
      }
      validFiles.push(file);
    }

    return validFiles;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || []);
    if (rawFiles.length === 0) return;

    const filesToUpload = validateAndFilterFiles(rawFiles);
    if (filesToUpload.length === 0) {
      e.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const uploadPromises = filesToUpload.map((file) =>
        uploadFileToBucketApi(file, folder),
      );

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log(uploadedUrls);
      onUploadSuccess(uploadedUrls);
    } catch (err) {
      console.error("Upload error:", err);
      onUploadError?.(
        "An error occurred during file upload. Please try again.",
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <label
      className={cn(
        "relative flex cursor-pointer transition-all",
        (disabled || isUploading) && "pointer-events-none opacity-70",
        className,
      )}
    >
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {children({ isUploading })}
    </label>
  );
}
