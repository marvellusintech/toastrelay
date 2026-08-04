"use client";

import * as React from "react";
import QRCode from "qrcode";

interface QrCodeProps {
  value: string;
  size?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  className?: string;
}

export function QrCode({
  value,
  size = 168,
  margin = 1,
  errorCorrectionLevel = "M",
  className,
}: QrCodeProps) {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size,
      margin,
      errorCorrectionLevel,
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size, margin, errorCorrectionLevel]);

  if (!src) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-label="Loading QR code"
      />
    );
  }

  return (
    <img
      src={src}
      alt="QR code"
      width={size}
      height={size}
      className={className}
    />
  );
}
