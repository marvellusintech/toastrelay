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
    const maxDim = 640;
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
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
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
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
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
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="aspect-[4/3] sm:aspect-[16/11] w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Expanded Scanner Frame Overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div className="relative aspect-square w-[80%] max-w-[300px] sm:max-w-[340px] rounded-3xl border border-white/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
          {/* Stylized corner guides */}
          <div className="absolute -top-0.5 -left-0.5 h-8 w-8 rounded-tl-2xl border-t-4 border-l-4 border-turquoise" />
          <div className="absolute -top-0.5 -right-0.5 h-8 w-8 rounded-tr-2xl border-t-4 border-r-4 border-turquoise" />
          <div className="absolute -bottom-0.5 -left-0.5 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-turquoise" />
          <div className="absolute -bottom-0.5 -right-0.5 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-turquoise" />

          {/* Subtle scanning laser line indicator */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-turquoise to-transparent opacity-80 animate-pulse" />
        </div>
      </div>

      {/* Floating helper instruction pill */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/65 px-4 py-1.5 backdrop-blur-md shadow-lg">
        <p className="text-xs font-medium text-white/90">
          Align QR code within the frame
        </p>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={stop}
        className="absolute right-3.5 top-3.5 rounded-full border border-white/15 bg-black/60 p-2 text-white/90 backdrop-blur-md transition hover:bg-black/80 hover:text-white"
        aria-label="Stop camera"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
