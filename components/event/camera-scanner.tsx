"use client";

import * as React from "react";
import { Camera, Loader2, X } from "lucide-react";
import jsQR from "jsqr";

type Props = {
  onDetected: (payload: string) => void;
};

export function CameraScanner({ onDetected }: Props) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const timerRef = React.useRef<number>(0);
  const lastDetectedRef = React.useRef<string | null>(null);
  const [active, setActive] = React.useState(false);
  const [starting, setStarting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Attach the stream once the <video> element mounts (active becomes true).
  React.useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (active && video && stream && video.srcObject !== stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, [active]);

  const stop = React.useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setActive(false);
    setStarting(false);
    lastDetectedRef.current = null;
  }, []);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const scanFrame = React.useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Downscale the frame to keep decoding fast and accurate.
    const maxDim = 480;
    const scale = Math.min(1, maxDim / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code?.data && code.data !== lastDetectedRef.current) {
      lastDetectedRef.current = code.data;
      onDetected(code.data);
    }
  }, [onDetected]);

  async function start() {
    setError(null);
    setStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setActive(true);
      // Decode roughly every 200ms.
      timerRef.current = window.setInterval(scanFrame, 200);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.name === "NotAllowedError"
            ? "Camera permission denied. Enable camera access and try again."
            : err.message
          : "Unable to access the camera.";
      setError(message);
      setActive(false);
    } finally {
      setStarting(false);
    }
  }

  if (!active) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={start}
          disabled={starting}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-bold text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {starting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          Open camera scanner
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-line bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="aspect-video w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-40 w-40 rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
      </div>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-medium text-white">
        Point the camera at a QR code
      </p>
      <button
        type="button"
        onClick={stop}
        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
        aria-label="Stop camera"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
