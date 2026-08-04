"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import { isVideoUrl } from "@/lib/utils/media";

interface MediaProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function Media({
  src,
  alt = "",
  className,
  imgClassName,
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  ...props
}: MediaProps) {
  const url = getFileUrl(src);

  if (isVideoUrl(src)) {
    return (
      <div className={cn("overflow-hidden", className)} {...props}>
        <video
          src={url}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      <img
        src={url}
        alt={alt}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
