"use client";

import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = "/placeholder.jpg",
  alt,
  ...props
}) => {
  const cleanSrc = src?.trim() ? src : fallbackSrc;

  const [currentSrc, setCurrentSrc] = useState(cleanSrc);
  const [prevCleanSrc, setPrevCleanSrc] = useState(cleanSrc);

  if (cleanSrc !== prevCleanSrc) {
    setPrevCleanSrc(cleanSrc);
    setCurrentSrc(cleanSrc);
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || "Image"}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
};