// @/components/event/templates/StorybookWeddingTemplate.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import * as THREE from "three";
import gsap from "gsap";
import { TemplateProps } from "./types";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  GlassWater,
  CheckCircle2,
  Loader2,
  X,
  RotateCcw,
  Hand,
  Mail,
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EventShare } from "@/components/reuseables/event-share";
import { RSVPStatus } from "@/types/enum";
import { submitRsvpApi, createToastApi } from "@/lib/api/events";
import TicketPurchaseModal from "@/components/event/TicketPurchaseModal";
import { motion, AnimatePresence } from "motion/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitRsvpPayload, CreateToastPayload } from "@/types/payload";

// Declare Paystack Pop
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key?: string;
        email?: string;
        amount?: number;
        currency?: string;
        ref?: string;
        reference?: string;
        onClose?: () => void;
        callback?: (response: { reference: string }) => void;
      }) => { openIframe: () => void };
    };
  }
}

// Zod Schema for RSVP
const rsvpSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().min(7, "Invalid phone").optional().or(z.literal("")),
    rsvpStatus: z.enum([RSVPStatus.GOING, RSVPStatus.NOT_GOING, RSVPStatus.MAYBE] as const),
  })
  .refine(
    (data) => Boolean(data.email && data.email.trim() !== "") || Boolean(data.phone && data.phone.trim() !== ""),
    { message: "Either Email or Phone number is required", path: ["email"] },
  );

type RsvpFormValues = z.infer<typeof rsvpSchema>;

const toastSchema = z
  .object({
    authorName: z.string().optional(),
    email: z.string().email("Valid email required").optional().or(z.literal("")),
    content: z.string().min(3, "Please write a toast message"),
    amount: z
      .string()
      .optional()
      .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Amount must be valid"),
    currency: z.string(),
  })
  .refine(
    (data) => {
      const num = Number(data.amount || 0);
      return num > 0 ? Boolean(data.email && data.email.trim() !== "") : true;
    },
    { message: "Email is required for monetary gifts", path: ["email"] },
  );

type ToastFormValues = z.infer<typeof toastSchema>;

// Ambient Romantic Synthesizer Audio Generator
class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private isPaused = false;
  private masterGain: GainNode | null = null;
  private timer: NodeJS.Timeout | null = null;
  private targetVolume = 0.28;
  private chordIndex = 0;
  private noteIndex = 0;

  private chords = [
    [261.63, 329.63, 392.0, 493.88, 587.33], // Cmaj9
    [220.0, 261.63, 329.63, 392.0, 493.88],  // Am9
    [174.61, 261.63, 329.63, 392.0, 440.0],  // Fmaj9
    [196.0, 261.63, 392.0, 440.0, 587.33],   // Gsus4
  ];

  private playNote = () => {
    if (!this.ctx || !this.masterGain || this.ctx.state === "suspended" || this.isPaused) return;
    const chord = this.chords[this.chordIndex];
    const freq = chord[this.noteIndex % chord.length];
    this.noteIndex++;
    if (this.noteIndex >= chord.length) {
      this.noteIndex = 0;
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;
    }

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    noteGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.8);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.9);
  };

  start(targetVolume = 0.28) {
    this.targetVolume = targetVolume;
    if (this.isRunning && !this.isPaused) return;

    if (this.isPaused && this.ctx) {
      this.resume();
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(targetVolume, this.ctx.currentTime + 3.0);
      this.masterGain.connect(this.ctx.destination);
      this.isRunning = true;
      this.isPaused = false;

      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.playNote();
      this.timer = setInterval(this.playNote, 650);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);
        setTimeout(() => {
          if (this.isPaused && this.ctx && this.ctx.state === "running") {
            this.ctx.suspend().catch(() => {});
          }
        }, 150);
      } catch {
        this.ctx.suspend().catch(() => {});
      }
    }
  }

  resume() {
    if (!this.isRunning) {
      this.start(this.targetVolume);
      return;
    }
    if (!this.isPaused) return;
    this.isPaused = false;

    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      if (this.masterGain) {
        try {
          this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
          this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.targetVolume), this.ctx.currentTime + 1.2);
        } catch {}
      }
    }

    if (!this.timer) {
      this.playNote();
      this.timer = setInterval(this.playNote, 650);
    }
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.ctx?.close().catch(() => {});
          this.ctx = null;
          this.masterGain = null;
        }, 600);
      } catch {
        this.ctx = null;
        this.masterGain = null;
      }
    }
  }

  playOpenEnvelopeSound() {
    if (!this.ctx || !this.masterGain || this.ctx.state === "suspended" || this.isPaused) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1046.5, t); // C6
      osc.frequency.exponentialRampToValueAtTime(1318.5, t + 0.35); // E6
      oscGain.gain.setValueAtTime(0.0001, t);
      oscGain.gain.exponentialRampToValueAtTime(0.06, t + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 1.2);
    } catch {}
  }
}

// =============================================================
// COLOR & THEME UTILITIES FOR CUSTOM WEDDING PALETTES
// =============================================================
function parseHexColor(hex: string): { r: number; g: number; b: number } {
  let clean = (hex || "#7a0c1a").replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 122, g: 12, b: 26 }; // Fallback to classic burgundy
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function hexToRgba(hex: string, alpha = 1): string {
  const { r, g, b } = parseHexColor(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darkenHex(hex: string, amount = 0.35): string {
  const { r, g, b } = parseHexColor(hex);
  const factor = Math.max(0, Math.min(1, 1 - amount));
  const dr = Math.round(r * factor);
  const dg = Math.round(g * factor);
  const db = Math.round(b * factor);
  return `#${((1 << 24) + (dr << 16) + (dg << 8) + db).toString(16).slice(1)}`;
}


function getContrastTextColor(hex: string): string {
  const { r, g, b } = parseHexColor(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0a0a0a" : "#ffffff";
}

// Tints the 3D theatrical curtains to match user-customized palette while preserving fabric folds
function createTintedCurtainTexture(image: CanvasImageSource, tintColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const imgEl = image as HTMLImageElement;
  const width = imgEl.naturalWidth || imgEl.width || 2048;
  const height = imgEl.naturalHeight || imgEl.height || 1024;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(image, 0, 0, width, height);

  // Tint hue & chroma while preserving velvet folds
  ctx.globalCompositeOperation = "color";
  ctx.fillStyle = tintColor;
  ctx.fillRect(0, 0, width, height);

  // Soft multiply overlay for depth
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = tintColor;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Texture for inside backing of luxury envelope (custom color with glistening gold damask interior)
function createEnvelopeBackTexture(themeColor = "#4A0C16", themeDark = "#360810"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 960;
  const ctx = canvas.getContext("2d")!;

  // Base velvet background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 960);
  bgGrad.addColorStop(0, themeDark);
  bgGrad.addColorStop(1, themeColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 960);

  // Gilded interior foil pattern
  ctx.strokeStyle = "rgba(212, 175, 55, 0.28)";
  ctx.lineWidth = 1.5;
  const step = 48;
  for (let x = -1200; x < 2400; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 1200, 960);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 960);
    ctx.lineTo(x + 1200, 0);
    ctx.stroke();
  }

  // Gold foil framing
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, 1168, 928);
  ctx.strokeStyle = "rgba(255, 220, 130, 0.5)";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 1136, 896);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Texture for lower front pocket of envelope holding the card
function createEnvelopePocketTexture(
  monogram: string,
  themeColor = "#480C16",
  themeDark = "#32070E",
  pocketLabel = "WEDDING INVITATION",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 660;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 1200, 660);

  // Outer pocket body with V-notch dip at top
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 660);
  bgGrad.addColorStop(0, themeColor);
  bgGrad.addColorStop(1, themeDark);
  ctx.fillStyle = bgGrad;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(600, 150); // V-notch center dip
  ctx.lineTo(1200, 0);
  ctx.lineTo(1200, 660);
  ctx.lineTo(0, 660);
  ctx.closePath();
  ctx.fill();

  // Outer gold foil rim on V-notch
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.lineTo(600, 155);
  ctx.lineTo(1200, 5);
  ctx.stroke();

  // Inner hairline gold rim on V-notch
  ctx.strokeStyle = "rgba(255, 230, 150, 0.65)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 22);
  ctx.lineTo(600, 172);
  ctx.lineTo(1200, 22);
  ctx.stroke();

  // Perimeter border following pocket silhouette (leaving notch open)
  ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(12, 12);
  ctx.lineTo(12, 648);
  ctx.lineTo(1188, 648);
  ctx.lineTo(1188, 12);
  ctx.stroke();

  // Stamped luxury gold monogram crest in center
  ctx.fillStyle = "#FFDF85";
  ctx.font = "italic 44px 'Playfair Display', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(monogram, 600, 420);

  ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(600, 420, 48, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = "16px sans-serif";
  ctx.fillStyle = "rgba(255, 220, 130, 0.75)";
  const ctxAny = ctx as unknown as { letterSpacing?: string };
  if ("letterSpacing" in ctx) {
    ctxAny.letterSpacing = "3px";
  }
  ctx.fillText(pocketLabel, 600, 495);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Texture for top triangular flap of envelope
function createEnvelopeFlapTexture(themeColor = "#500E19", themeDark = "#360810"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 540;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 1200, 540);

  // Triangular flap pointing down
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(1200, 0);
  ctx.lineTo(600, 500);
  ctx.closePath();

  const flapGrad = ctx.createLinearGradient(0, 0, 0, 500);
  flapGrad.addColorStop(0, themeDark);
  flapGrad.addColorStop(1, themeColor);
  ctx.fillStyle = flapGrad;
  ctx.fill();

  // Gold foil border along diagonal edges
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(4, 2);
  ctx.lineTo(600, 496);
  ctx.lineTo(1196, 2);
  ctx.stroke();

  // Inner hairline gold accent
  ctx.strokeStyle = "rgba(255, 230, 150, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(36, 6);
  ctx.lineTo(600, 470);
  ctx.lineTo(1164, 6);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 3D Wax Seal Stamp texture for flap tip
function createWaxSealStampTexture(monogram: string, sealColor = "#870C1B"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 512, 512);

  // Melted wax scalloped disc
  ctx.fillStyle = sealColor;
  ctx.beginPath();
  ctx.arc(256, 256, 230, 0, Math.PI * 2);
  ctx.fill();

  // Inner raised ridge
  ctx.strokeStyle = "rgba(255, 200, 100, 0.4)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 185, 0, Math.PI * 2);
  ctx.stroke();

  // Gold stamped monogram
  ctx.fillStyle = "#FFD97D";
  ctx.font = "italic 72px 'Playfair Display', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(monogram, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Luxury printed invitation card texture (1200 x 900 balanced landscape ratio)
function createInvitationCardTexture(
  name: string,
  formattedDate?: string | null,
  location?: string | null,
  monogram = "W",
  sealColor = "#8F0D1E",
  headerSubtext = "TOGETHER WITH THEIR FAMILIES",
  invitePhrase = "cordially invite you to celebrate their wedding",
  footerNote = "RECEPTION TO FOLLOW • KINDLY RSVP BELOW",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext("2d")!;

  // Warm cream/ivory parchment
  ctx.fillStyle = "#FCFAF6";
  ctx.fillRect(0, 0, 1200, 900);

  // Dual gold foil borders
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, 1144, 844);

  ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 1116, 816);

  // Top wax crest badge
  ctx.fillStyle = sealColor;
  ctx.beginPath();
  ctx.arc(600, 95, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 220, 120, 0.5)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(600, 95, 42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#FFDA85";
  ctx.font = "italic 32px 'Playfair Display', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(monogram, 600, 95);

  // Typography
  ctx.fillStyle = "#6B5E51";
  ctx.font = "italic 26px 'Playfair Display', Georgia, serif";
  ctx.fillText(headerSubtext, 600, 185);

  ctx.fillStyle = "#1E1819";
  let titleFontSize = 56;
  const titleText = name || "The Celebration";
  ctx.font = `bold ${titleFontSize}px 'Playfair Display', Georgia, serif`;
  while (ctx.measureText(titleText).width > 1050 && titleFontSize > 28) {
    titleFontSize -= 2;
    ctx.font = `bold ${titleFontSize}px 'Playfair Display', Georgia, serif`;
  }
  ctx.fillText(titleText, 600, 280);

  ctx.fillStyle = "#8C7B6B";
  ctx.font = "italic 26px 'Playfair Display', Georgia, serif";
  ctx.fillText(invitePhrase, 600, 355);

  // Gilded separator flourish
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(400, 410);
  ctx.lineTo(800, 410);
  ctx.stroke();

  ctx.fillStyle = "#D4AF37";
  ctx.beginPath();
  ctx.arc(600, 410, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#1A1516";
  ctx.font = "bold 36px 'Playfair Display', Georgia, serif";
  ctx.fillText(formattedDate || "Saturday, A Special Day", 600, 480);

  ctx.fillStyle = "#6B5E51";
  let locFontSize = 30;
  const locText = location || "Whitestone Event Place, Ikeja";
  ctx.font = `${locFontSize}px 'Playfair Display', Georgia, serif`;
  while (ctx.measureText(locText).width > 1050 && locFontSize > 20) {
    locFontSize -= 2;
    ctx.font = `${locFontSize}px 'Playfair Display', Georgia, serif`;
  }
  ctx.fillText(locText, 600, 550);

  ctx.fillStyle = "rgba(107, 94, 81, 0.90)";
  ctx.font = "italic 23px 'Playfair Display', Georgia, serif";
  ctx.fillText(footerNote, 600, 640);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}


// Generates glowing cursive neon sign texture for event title hovering above cover image
function createNeonSignTexture(title: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 768;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1536, 768);

  const cleanTitle = (title || "").trim();
  if (!cleanTitle) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Check if title has separator (&, and, +, with) with or without spaces
  const sepMatch = cleanTitle.match(/\s*(&|\+)\s*|\s+(and|with)\s+/i);
  let lines: { text: string; y: number; isAmp?: boolean }[] = [];

  if (sepMatch && sepMatch.index !== undefined) {
    const p1 = cleanTitle.slice(0, sepMatch.index).trim();
    const p2 = cleanTitle.slice(sepMatch.index + sepMatch[0].length).trim();
    const matchedSep = (sepMatch[1] || sepMatch[2] || "&").toLowerCase();
    const sep = matchedSep === "and" || matchedSep === "with" ? "&" : matchedSep;
    // Tight, cohesive line height centered at y = 384
    lines = [
      { text: p1, y: 304 },
      { text: sep, y: 384, isAmp: true },
      { text: p2, y: 464 },
    ];
  } else {
    // If title has multiple words (e.g. 4+ words), split cleanly across two lines with tight line height
    const words = cleanTitle.split(/\s+/);
    if (words.length >= 4) {
      const mid = Math.ceil(words.length / 2);
      lines = [
        { text: words.slice(0, mid).join(" "), y: 342 },
        { text: words.slice(mid).join(" "), y: 426 },
      ];
    } else {
      lines = [{ text: cleanTitle, y: 384 }];
    }
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontStack = "'Playfair Display', Georgia, serif";

  const renderPass = (blur: number, color: string, strokeWidth: number, fill = true) => {
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = fill ? "#ffffff" : "transparent";

    lines.forEach(({ text, y, isAmp }) => {
      let fontSize = isAmp ? 48 : 84;
      const ctxAny = ctx as unknown as { letterSpacing?: string };
      if ("letterSpacing" in ctx) {
        ctxAny.letterSpacing = isAmp ? "0px" : "1.8px";
      }

      ctx.font = isAmp
        ? `italic 400 ${fontSize}px ${fontStack}`
        : `italic 600 ${fontSize}px ${fontStack}`;

      const measured = ctx.measureText(text).width;
      if (measured > 1380) {
        fontSize = Math.floor(fontSize * (1380 / measured));
        ctx.font = isAmp
          ? `italic 400 ${fontSize}px ${fontStack}`
          : `italic 600 ${fontSize}px ${fontStack}`;
      }

      ctx.strokeText(text, 768, y);
      if (fill) {
        ctx.fillText(text, 768, y);
      }
    });
  };

  // Pass 1: Wide warm cyan diffuse neon glow
  renderPass(45, "rgba(0, 190, 255, 0.75)", 6, false);
  // Pass 2: Intense inner cyan neon aura
  renderPass(18, "rgba(160, 240, 255, 0.95)", 4, false);
  // Pass 3: Brilliant white neon glass tube core
  renderPass(5, "#ffffff", 2.5, true);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Global memory cache for preloaded images to ensure instantaneous rendering
const imagePreloadCache = new Map<string, HTMLImageElement>();

function getOrPreloadImage(src: string): HTMLImageElement {
  if (imagePreloadCache.has(src)) {
    return imagePreloadCache.get(src)!;
  }
  const img = new Image();
  const isBlobOrData = src.startsWith("blob:") || src.startsWith("data:");
  const isRelative = src.startsWith("/");
  if (!isBlobOrData && !isRelative) {
    img.crossOrigin = "anonymous";
  }
  img.src = src;
  imagePreloadCache.set(src, img);
  return img;
}

export default function StorybookWeddingTemplate({
  event,
  formattedDate,
  borderRadiusClass,
}: TemplateProps) {
  const {
    id: eventId,
    name,
    description,
    coverImage,
    location,
    ticketEvent,
    currency = "NGN",
    theme,
    isCustomTheme,
    eventType,
    eventTypeId,
  } = event;

  // Determine if this event is a wedding or generic celebration
  // Default is wedding ONLY if no event type is specified at all.
  // If an event type is specified (via eventTypeId, eventType, etc.):
  // - If it contains "wedding", it is a wedding
  // - If it is anything else (such as "anniversary", "birthday", "social", "other"),
  //   it is strictly NOT a wedding and uses generic celebration copy.
  const isWedding = useMemo(() => {
    const rawTokens: string[] = [];

    // 1. Check eventTypeId (e.g. "anniversary", "wedding", "birthday")
    if (eventTypeId) {
      rawTokens.push(String(eventTypeId));
    }

    // Check potential loose properties on event
    const looseEvent = event as unknown as Record<string, unknown>;
    if (looseEvent?.typeId && typeof looseEvent.typeId === "string") {
      rawTokens.push(looseEvent.typeId);
    }
    if (looseEvent?.category && typeof looseEvent.category === "string") {
      rawTokens.push(looseEvent.category);
    }

    // 2. Check eventType (object with id, name, label or string)
    if (eventType) {
      if (typeof eventType === "object" && eventType !== null) {
        if (eventType.id) rawTokens.push(String(eventType.id));
        if (eventType.name) rawTokens.push(String(eventType.name));
        if (eventType.label) rawTokens.push(String(eventType.label));
      } else if (typeof eventType === "string") {
        rawTokens.push(eventType);
      }
    }

    // Normalize and filter tokens
    const normalizedTokens = rawTokens
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // If no event type token is found anywhere, default to wedding
    if (normalizedTokens.length === 0) {
      return true;
    }

    // An event is a wedding ONLY if at least one token includes "wedding"
    return normalizedTokens.some((token) => token.includes("wedding"));
  }, [eventType, eventTypeId, event]);

  // Centralized dynamic event copy: wedding vs purely generic
  const eventCopy = useMemo(() => {
    return {
      invitationBadge: isWedding
        ? "Official Wedding Invitation"
        : "Official Invitation",
      pocketBadge: isWedding
        ? "WEDDING INVITATION"
        : "SPECIAL INVITATION",
      cardHeader: isWedding
        ? "TOGETHER WITH THEIR FAMILIES"
        : "YOU ARE CORDIALLY INVITED",
      cardInvite: isWedding
        ? "cordially invite you to celebrate their wedding"
        : "cordially invite you to celebrate this special occasion",
      cardFooter: isWedding
        ? "RECEPTION TO FOLLOW • KINDLY RSVP BELOW"
        : "CELEBRATION TO FOLLOW • KINDLY RSVP BELOW",
      toastButton: isWedding ? "Toast Couple" : "Send a Toast",
      toastModalTitle: isWedding ? "Toast the Couple" : "Send a Toast",
      toastModalSubtitle: isWedding
        ? "Leave a heartfelt wish and optional monetary gift."
        : "Leave your warm wishes and optional monetary gift.",
      toastPlaceholder: isWedding
        ? "Wishing you a lifetime filled with love and joy..."
        : "Wishing you joy, celebration, and wonderful memories...",
      toastSuccess: isWedding
        ? "Thank you for your blessings and loving contribution to the couple!"
        : "Thank you for your warm wishes and celebratory contribution!",
      storyButton: isWedding ? "Story" : "Details",
      storyHeader: isWedding
        ? "Our Story & Celebration"
        : "About the Celebration",
      storyEmptyText: isWedding
        ? "Join us as we celebrate our love and begin our new journey together."
        : "Join us as we celebrate this special occasion together.",
      storySrDescription: isWedding
        ? `Full description, celebration story, and event details for ${name || "this wedding"}.`
        : `Full description and celebration details for ${name || "this event"}.`,
    };
  }, [isWedding, name]);

  const coupleImgSrc = coverImage ? getFileUrl(coverImage) : null;

  // Eagerly preload cover couple image into memory cache as early as component render & mounts
  if (typeof window !== "undefined" && coupleImgSrc) {
    getOrPreloadImage(coupleImgSrc);
  }

  useEffect(() => {
    if (coupleImgSrc) {
      getOrPreloadImage(coupleImgSrc);
    }
  }, [coupleImgSrc]);

  // Theme & Customization Palette
  const hasCustomTheme = Boolean(isCustomTheme && theme?.primaryColor);
  const themePrimary = hasCustomTheme ? (theme?.primaryColor as string) : "#7a0c1a";
  const themePrimaryDark = hasCustomTheme ? darkenHex(themePrimary, 0.4) : "#360810";
  const themePrimaryDeep = hasCustomTheme ? darkenHex(themePrimary, 0.6) : "#220508";
  const contrastText = getContrastTextColor(themePrimary);

  const getBorderRadiusClass = () => {
    if (isCustomTheme && theme?.borderRadius) {
      switch (theme.borderRadius) {
        case "none":
          return "rounded-none";
        case "sm":
          return "rounded-sm";
        case "md":
          return "rounded-md";
        case "lg":
          return "rounded-lg";
        case "xl":
          return "rounded-xl";
        case "2xl":
          return "rounded-2xl";
        case "full":
          return "rounded-full";
        default:
          return "rounded-xl";
      }
    }
    return borderRadiusClass || "rounded-xl";
  };

  const buttonRadius = getBorderRadiusClass();

  const primaryBtnStyle: React.CSSProperties = hasCustomTheme
    ? { backgroundColor: themePrimary, color: contrastText }
    : {};

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Experience States:
  // 'SEAL' -> 'STAGE' -> 'TABLE' -> 'INSPECT'
  const [experienceState, setExperienceState] = useState<"SEAL" | "STAGE" | "TABLE" | "INSPECT">("SEAL");
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Modals & Slide-overs
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isToastSubmitted, setIsToastSubmitted] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Refs for Three.js
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lookAtTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.85, -0.08));
  const animationFrameIdRef = useRef<number | null>(null);
  const audioRef = useRef<RomanticAudioEngine | null>(null);
  const userWantsAudioRef = useRef<boolean>(false);
  const isTabVisibleRef = useRef<boolean>(typeof document !== "undefined" ? document.visibilityState === "visible" : true);
  const isElementVisibleRef = useRef<boolean>(true);
  const plantMeshesRef = useRef<THREE.Mesh[]>([]);
  const panningTimelineRef = useRef<gsap.core.Tween | null>(null);
  const cameraTimelineRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const neonMeshRef = useRef<THREE.Mesh | null>(null);
  const cardMeshRef = useRef<THREE.Mesh | null>(null);
  const pocketMeshRef = useRef<THREE.Mesh | null>(null);
  const envelopeFlapPivotRef = useRef<THREE.Group | null>(null);
  const envelopeStateRef = useRef<"CLOSED" | "OPEN">("CLOSED");
  const envelopeGroupRef = useRef<THREE.Group | null>(null);

  // Extracted Event / Celebrant Monogram
  const monogram = useMemo(() => {
    const raw = name || (isWedding ? "Wedding" : "Celebration");
    const parts = raw.split(/&|and/i).map((s) => s.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0].charAt(0)} & ${parts[1].charAt(0)}`;
    }
    const words = raw.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return `${words[0].charAt(0)} & ${words[1].charAt(0)}`;
    }
    return raw.slice(0, 2).toUpperCase() || (isWedding ? "W" : "C");
  }, [name, isWedding]);

  // Handle Returning from Paystack redirect
  useEffect(() => {
    const toastParam = searchParams.get("toast");
    const refParam = searchParams.get("reference") || searchParams.get("trxref");
    if (toastParam === "success" || refParam) {
      setIsToastOpen(true);
      setIsToastSubmitted(true);
      const updated = new URLSearchParams(searchParams.toString());
      updated.delete("toast");
      updated.delete("reference");
      updated.delete("trxref");
      const q = updated.toString();
      window.history.replaceState(null, "", q ? `${pathname}?${q}` : pathname);
    }
  }, [searchParams, pathname]);

  // Audio Handler
  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new RomanticAudioEngine();
    }
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
      userWantsAudioRef.current = false;
    } else {
      audioRef.current.resume();
      setIsAudioPlaying(true);
      userWantsAudioRef.current = true;
    }
  };

  // Automatically pause audio when someone leaves the view (switches tab, minimizes, or scrolls past),
  // and resume playback when they return (only if audio was previously playing).
  useEffect(() => {
    const updateAudioPlayback = () => {
      const isInView = isTabVisibleRef.current && isElementVisibleRef.current;

      if (!isInView) {
        // Person left the view
        if (userWantsAudioRef.current && audioRef.current) {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        }
      } else {
        // Person returned to the view
        if (userWantsAudioRef.current && audioRef.current) {
          audioRef.current.resume();
          setIsAudioPlaying(true);
        }
      }
    };

    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
      updateAudioPlayback();
    };

    const handlePageHide = () => {
      isTabVisibleRef.current = false;
      updateAudioPlayback();
    };

    const handlePageShow = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
      updateAudioPlayback();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    let observer: IntersectionObserver | null = null;
    const target = containerRef.current || canvasContainerRef.current;
    if (typeof IntersectionObserver !== "undefined" && target) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isElementVisibleRef.current = entry.isIntersecting;
          }
          updateAudioPlayback();
        },
        { threshold: 0 }
      );
      observer.observe(target);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      observer?.disconnect();
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // State tracking refs for event listeners and resize handlers
  const experienceStateRef = useRef(experienceState);
  experienceStateRef.current = experienceState;
  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;

  // Centralized camera animation stopper to eliminate rogue tweens, drift, or sideways tilting
  const stopAllCameraAnimations = useCallback(() => {
    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
      stageTimeoutRef.current = null;
    }
    if (panningTimelineRef.current) {
      panningTimelineRef.current.kill();
      panningTimelineRef.current = null;
    }
    if (cameraTimelineRef.current) {
      cameraTimelineRef.current.kill();
      cameraTimelineRef.current = null;
    }
    if (cameraRef.current) {
      gsap.killTweensOf(cameraRef.current.position);
      gsap.killTweensOf(cameraRef.current.rotation);
      cameraRef.current.up.set(0, 1, 0);
    }
    gsap.killTweensOf(lookAtTargetRef.current);
  }, []);

  // Calculate responsive camera position and lookAt target for Table and Inspect modes
  const getStationeryCameraCoords = useCallback(() => {
    if (typeof window === "undefined") {
      return {
        table: { pos: { x: 3.6, y: 1.85, z: 3.15 }, lookAt: { x: 3.6, y: 1.77, z: 1.46 } },
        inspect: { pos: { x: 3.6, y: 1.80, z: 2.45 }, lookAt: { x: 3.6, y: 1.77, z: 1.46 } },
      };
    }

    const aspect = window.innerWidth / window.innerHeight;
    const isMobile = aspect < 1.0;
    const cardCenter = { x: 3.6, y: 1.77, z: 1.46 };

    // In Table View:
    // Scale distance inversely with aspect ratio on narrow screens so envelope & table fit comfortably
    const tableDistance = aspect >= 1.0
      ? 1.69
      : Math.min(4.8, 1.25 / (0.8284 * aspect));

    // In Inspect View ("Hold Me"):
    // On mobile portrait, narrow horizontal FOV causes wide landscape cards (0.90m) to crop if too close.
    // Setting factor to 0.97m brings the camera in close enough that the card fills ~93% of the mobile screen width,
    // making all content prominently legible while staying comfortably inside the viewport edges.
    const inspectDistance = aspect >= 1.0
      ? 0.99
      : Math.min(3.8, 0.97 / (0.8284 * aspect));

    const mobileYOffset = isMobile ? 0.10 : 0.0;

    return {
      table: {
        pos: {
          x: 3.6,
          y: 1.85 + (isMobile ? 0.06 : 0),
          z: cardCenter.z + tableDistance,
        },
        lookAt: {
          x: 3.6,
          y: cardCenter.y + (isMobile ? 0.04 : 0),
          z: cardCenter.z,
        },
      },
      inspect: {
        pos: {
          x: 3.6,
          y: cardCenter.y + mobileYOffset + (isMobile ? 0.02 : 0.03),
          z: cardCenter.z + inspectDistance,
        },
        lookAt: {
          x: 3.6,
          y: cardCenter.y + mobileYOffset,
          z: cardCenter.z,
        },
      },
    };
  }, []);

  // -------------------------------------------------------------
  // THREE.JS SCENE SETUP WITH REALISTIC ASSETS
  // -------------------------------------------------------------
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0608);
    scene.fog = new THREE.FogExp2(0x0c0608, 0.038);
    sceneRef.current = scene;

    // 2. Camera (Initially focused close-up on the glowing event title)
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 3.80, 3.2);
    camera.lookAt(lookAtTargetRef.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // -------------------------------------------------------------
    // LIGHTING
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffecd6, 0.95);
    scene.add(ambientLight);

    // Warm stage spotlight focused on the center
    const stageSpot = new THREE.SpotLight(0xfffaec, 4.8, 18, Math.PI / 3.8, 0.45, 1.2);
    stageSpot.position.set(0, 7.5, 5.0);
    stageSpot.target.position.set(0, 1.8, 0);
    stageSpot.castShadow = true;
    stageSpot.shadow.bias = -0.001;
    scene.add(stageSpot);
    scene.add(stageSpot.target);

    // Table spotlight
    const tableSpot = new THREE.SpotLight(0xffdfb3, 3.8, 10, Math.PI / 4.5, 0.4, 1.0);
    tableSpot.position.set(3.4, 5.5, 3.2);
    tableSpot.target.position.set(3.6, 1.55, 1.5);
    scene.add(tableSpot);
    scene.add(tableSpot.target);

    // Subtle golden rim backlight
    const rimLight = new THREE.DirectionalLight(0xffb580, 2.6);
    rimLight.position.set(0, 4.5, -4);
    scene.add(rimLight);

    // -------------------------------------------------------------
    // REALISTIC SCENE ELEMENTS
    // -------------------------------------------------------------
    const textureLoader = new THREE.TextureLoader();

    // 1. Realistic Polished Parquet Hardwood Stage Floor
    textureLoader.load("/templates/the-wedding-story/floor.jpg", (floorTex) => {
      floorTex.colorSpace = THREE.SRGBColorSpace;
      floorTex.wrapS = THREE.RepeatWrapping;
      floorTex.wrapT = THREE.RepeatWrapping;
      floorTex.repeat.set(4, 4);

      const floorGeo = new THREE.PlaneGeometry(36, 36);
      const floorMat = new THREE.MeshStandardMaterial({
        map: floorTex,
        roughness: 0.28,
        metalness: 0.15,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      floor.receiveShadow = true;
      scene.add(floor);
    });

    // 2. Realistic Theatrical Curtain Backdrop (dynamically tinted to custom theme palette if configured)
    textureLoader.load(
      "/templates/the-wedding-story/curtains.jpg",
      (curtainTex) => {
        curtainTex.colorSpace = THREE.SRGBColorSpace;
        const finalCurtainTex =
          hasCustomTheme && curtainTex.image
            ? createTintedCurtainTexture(curtainTex.image, themePrimary)
            : curtainTex;
        const curtainGeo = new THREE.PlaneGeometry(24, 13);
        const curtainMat = new THREE.MeshStandardMaterial({
          map: finalCurtainTex,
          roughness: 0.8,
          metalness: 0.05,
        });
        const curtainMesh = new THREE.Mesh(curtainGeo, curtainMat);
        curtainMesh.position.set(0, 4.8, -2.2);
        curtainMesh.receiveShadow = true;
        scene.add(curtainMesh);
      },
    );

    // 3. Realistic Circular Floral Ring Arch (True Transparent PNG)
    textureLoader.load(
      "/templates/the-wedding-story/floral_arch.png",
      (archTex) => {
        archTex.colorSpace = THREE.SRGBColorSpace;
        const archGeo = new THREE.PlaneGeometry(5.2, 5.2);
        const archMat = new THREE.MeshStandardMaterial({
          map: archTex,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.45,
          side: THREE.DoubleSide,
        });
        const archMesh = new THREE.Mesh(archGeo, archMat);
        archMesh.position.set(0, 2.45, -0.6);
        archMesh.castShadow = true;
        scene.add(archMesh);
      },
    );

    // 4. Floating 3D Glowing Cursive Neon Title Sign
    const neonTex = createNeonSignTexture(name);
    const neonGeo = new THREE.PlaneGeometry(4.4, 2.2);
    const neonMat = new THREE.MeshBasicMaterial({
      map: neonTex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const neonMesh = new THREE.Mesh(neonGeo, neonMat);
    neonMesh.position.set(0, 3.85, -0.08);
    scene.add(neonMesh);
    neonMeshRef.current = neonMesh;

    // Subtle cyan point light for authentic neon ambiance
    const neonPointLight = new THREE.PointLight(0x80d8ff, 1.4, 4.5);
    neonPointLight.position.set(0, 3.85, 0.15);
    scene.add(neonPointLight);

    // Auto-update texture when Playfair Display loads
    if (document.fonts) {
      document.fonts.load("400 48px 'Great Vibes'").then(() => {
        if (neonMeshRef.current) {
          const updatedTex = createNeonSignTexture(name);
          (neonMeshRef.current.material as THREE.MeshBasicMaterial).map = updatedTex;
          (neonMeshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
      });
      document.fonts.ready.then(() => {
        if (neonMeshRef.current) {
          const updatedTex = createNeonSignTexture(name);
          (neonMeshRef.current.material as THREE.MeshBasicMaterial).map = updatedTex;
          (neonMeshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
        if (cardMeshRef.current) {
          const updatedCardTex = createInvitationCardTexture(
            name,
            formattedDate ?? undefined,
            location ?? undefined,
            monogram,
            themePrimary,
            eventCopy.cardHeader,
            eventCopy.cardInvite,
            eventCopy.cardFooter,
          );
          (cardMeshRef.current.material as THREE.MeshStandardMaterial).map = updatedCardTex;
          (cardMeshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
        if (pocketMeshRef.current) {
          const updatedPocketTex = createEnvelopePocketTexture(
            monogram,
            themePrimary,
            themePrimaryDark,
            eventCopy.pocketBadge,
          );
          (pocketMeshRef.current.material as THREE.MeshStandardMaterial).map = updatedPocketTex;
          (pocketMeshRef.current.material as THREE.MeshStandardMaterial).needsUpdate = true;
        }
      });
    }

    // 5. Luxury Ceremonial Stage Dais / Plinth Platform
    const daisGroup = new THREE.Group();
    daisGroup.position.set(0, 0, -0.2);
    scene.add(daisGroup);

    // Dais soft contact shadow on the parquet hardwood floor
    const daisShadowCanvas = document.createElement("canvas");
    daisShadowCanvas.width = 256;
    daisShadowCanvas.height = 256;
    const dsCtx = daisShadowCanvas.getContext("2d");
    if (dsCtx) {
      const grad = dsCtx.createRadialGradient(128, 128, 60, 128, 128, 128);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.50)");
      grad.addColorStop(0.6, "rgba(0, 0, 0, 0.22)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      dsCtx.fillStyle = grad;
      dsCtx.fillRect(0, 0, 256, 256);
    }
    const daisShadowTex = new THREE.CanvasTexture(daisShadowCanvas);
    const daisShadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5.4, 5.4),
      new THREE.MeshBasicMaterial({ map: daisShadowTex, transparent: true, depthWrite: false })
    );
    daisShadowMesh.rotation.x = -Math.PI / 2;
    daisShadowMesh.position.set(0, 0.001, 0);
    daisGroup.add(daisShadowMesh);

    // Dais stepped base with polished Gold Brass rim bevel
    const daisBaseGeo = new THREE.CylinderGeometry(2.4, 2.46, 0.065, 48);
    const daisRimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.82,
    });
    const daisBaseMesh = new THREE.Mesh(daisBaseGeo, daisRimMat);
    daisBaseMesh.position.y = 0.0325;
    daisBaseMesh.receiveShadow = true;
    daisGroup.add(daisBaseMesh);

    // Dais top surface inset disc (Polished Ivory/Cream Marble Lacquer or Velvet Theme Top)
    const daisTopGeo = new THREE.CylinderGeometry(2.35, 2.35, 0.006, 48);
    const daisTopMat = new THREE.MeshStandardMaterial({
      color: hasCustomTheme ? new THREE.Color(themePrimaryDeep) : 0xfaf6f0,
      roughness: hasCustomTheme ? 0.75 : 0.18,
      metalness: 0.08,
    });
    const daisTopMesh = new THREE.Mesh(daisTopGeo, daisTopMat);
    daisTopMesh.position.y = 0.066;
    daisTopMesh.receiveShadow = true;
    daisGroup.add(daisTopMesh);

    // Center Couple standing firmly on the dais surface (top at y = 0.068, z = -0.15)
    const coupleGroup = new THREE.Group();
    coupleGroup.position.set(0, 0.068, -0.15);
    scene.add(coupleGroup);

    const coupleImgSrc = coverImage ? getFileUrl(coverImage) : null;

    const buildCoupleMesh = (loadedImg: HTMLImageElement, imgSrc: string) => {
      // Clear any previous couple mesh or placeholder to prevent double stacking or z-fighting
      while (coupleGroup.children.length > 0) {
        const child = coupleGroup.children[0];
        coupleGroup.remove(child);
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      }

      // Detect if image is a cutout and identify the true solid ground contact baseline
      let isCutout = false;
      let bottomPadFraction = 0;

      try {
        const testCanvas = document.createElement("canvas");
        // Downsample analysis canvas to 256px max dimension for sub-millisecond processing
        const maxDim = 256;
        const scale = Math.min(1, maxDim / Math.max(loadedImg.width, loadedImg.height));
        const tw = Math.max(1, Math.round(loadedImg.width * scale));
        const th = Math.max(1, Math.round(loadedImg.height * scale));
        testCanvas.width = tw;
        testCanvas.height = th;
        const tCtx = testCanvas.getContext("2d", { willReadFrequently: true });
        if (tCtx) {
          tCtx.drawImage(loadedImg, 0, 0, tw, th);
          const pData = tCtx.getImageData(0, 0, tw, th).data;

          for (let i = 3; i < pData.length; i += 16) {
            if (pData[i] < 240) {
              isCutout = true;
              break;
            }
          }

          if (isCutout) {
            // Find row where subject has solid contact (both feet and dress firmly present)
            let solidContactY = -1;
            let bottomOpaqueY = -1;
            for (let y = th - 1; y >= 0; y--) {
              const rowStart = y * tw * 4;
              let opaqueCount = 0;
              for (let x = 0; x < tw; x += 2) {
                if (pData[rowStart + x * 4 + 3] > 40) {
                  opaqueCount++;
                }
              }
              if (opaqueCount > 5 && bottomOpaqueY === -1) {
                bottomOpaqueY = y;
              }
              if (opaqueCount >= Math.round(tw * 0.15) && solidContactY === -1) {
                solidContactY = y;
                break;
              }
            }
            const targetY = solidContactY !== -1 ? solidContactY : (bottomOpaqueY !== -1 ? bottomOpaqueY : th - 1);
            bottomPadFraction = Math.max(0, (th - 1 - targetY) / th);
          }
        }
      } catch {
        // Fallback for CORS: treat .png / .webp as potential cutout with solid margin
        isCutout = imgSrc.includes(".png") || imgSrc.includes(".webp");
        if (isCutout) {
          bottomPadFraction = 0.08;
        }
      }

      const cTex = new THREE.Texture(loadedImg);
      cTex.colorSpace = THREE.SRGBColorSpace;
      cTex.needsUpdate = true;

      if (isCutout) {
        // FREESTANDING CUTOUT - FIRMLY ANCHORED TO STAGE DAIS
        const aspect = loadedImg.width / loadedImg.height;
        const height = 3.3;
        const width = height * aspect;
        const cGeo = new THREE.PlaneGeometry(width, height);
        const cMat = new THREE.MeshStandardMaterial({
          map: cTex,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.45,
          side: THREE.DoubleSide,
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);

        // Grounding offset: sink solid baseline 0.075m into the dais surface.
        // This firmly embeds the front shoe, places the back shoe flush onto the surface,
        // and eliminates any gap under the dress hem.
        const bottomGapMeters = bottomPadFraction * height;
        cMesh.position.set(0, height / 2 - bottomGapMeters - 0.075, 0);
        cMesh.castShadow = true;
        cMesh.customDepthMaterial = new THREE.MeshDepthMaterial({
          depthPacking: THREE.RGBADepthPacking,
          map: cTex,
          alphaTest: 0.5,
        });

        coupleGroup.add(cMesh);

        // -----------------------------------------------------------
        // DELICATE GROUND CONTACT SHADOW ON STAGE DAIS
        // -----------------------------------------------------------
        const shadowCanvas = document.createElement("canvas");
        shadowCanvas.width = 512;
        shadowCanvas.height = 256;
        const sCtx = shadowCanvas.getContext("2d");
        if (sCtx) {
          // 1. Gentle ambient contact under stance footprint
          const ambGrad = sCtx.createRadialGradient(256, 128, 20, 256, 128, 220);
          ambGrad.addColorStop(0, "rgba(0, 0, 0, 0.16)");
          ambGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.06)");
          ambGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          sCtx.fillStyle = ambGrad;
          sCtx.beginPath();
          sCtx.ellipse(256, 128, 220, 90, 0, 0, Math.PI * 2);
          sCtx.fill();

          // 2. Soft contact shadow under Bride's dress hem
          const brideGrad = sCtx.createRadialGradient(180, 125, 5, 180, 125, 110);
          brideGrad.addColorStop(0, "rgba(0, 0, 0, 0.32)");
          brideGrad.addColorStop(0.45, "rgba(0, 0, 0, 0.15)");
          brideGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          sCtx.fillStyle = brideGrad;
          sCtx.beginPath();
          sCtx.ellipse(180, 125, 110, 55, -0.05, 0, Math.PI * 2);
          sCtx.fill();

          // 3. Subtle contact shadow under Groom's shoes
          const groomGrad = sCtx.createRadialGradient(325, 128, 5, 325, 128, 70);
          groomGrad.addColorStop(0, "rgba(0, 0, 0, 0.38)");
          groomGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.16)");
          groomGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          sCtx.fillStyle = groomGrad;
          sCtx.beginPath();
          sCtx.ellipse(325, 128, 70, 36, 0, 0, Math.PI * 2);
          sCtx.fill();

          // 4. Fine contact line right at intersection
          const lineGrad = sCtx.createLinearGradient(0, 122, 0, 134);
          lineGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
          lineGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.30)");
          lineGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          sCtx.fillStyle = lineGrad;
          sCtx.fillRect(100, 122, 300, 12);
        }

        const shadowTex = new THREE.CanvasTexture(shadowCanvas);
        const shadowGeo = new THREE.PlaneGeometry(width * 0.95, 0.55);
        const shadowMat = new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.set(0, 0.002, 0.0);
        coupleGroup.add(shadowMesh);

        // -----------------------------------------------------------
        // SCATTERED ROMANTIC WHITE & BLUSH ROSE PETALS FOR FOREGROUND DEPTH
        // -----------------------------------------------------------
        const petalGeo = new THREE.PlaneGeometry(0.065, 0.05);
        const whitePetalMat = new THREE.MeshStandardMaterial({
          color: 0xfefcf9,
          roughness: 0.35,
          side: THREE.DoubleSide,
        });
        const blushPetalMat = new THREE.MeshStandardMaterial({
          color: 0xf8d8d8,
          roughness: 0.35,
          side: THREE.DoubleSide,
        });

        // 24 scattered petals with organic placements around the feet and hem
        const petalPositions = [
          // In front of dress (Z > 0)
          { x: -0.85, z: 0.08, rot: 0.4, blush: false },
          { x: -0.65, z: 0.14, rot: -0.8, blush: true },
          { x: -0.45, z: 0.09, rot: 1.2, blush: false },
          { x: -0.25, z: 0.12, rot: -0.3, blush: false },
          { x: -0.10, z: 0.16, rot: 0.7, blush: true },
          // In front of groom's shoes (Z > 0)
          { x: 0.22, z: 0.10, rot: -0.5, blush: false },
          { x: 0.38, z: 0.15, rot: 0.9, blush: true },
          { x: 0.52, z: 0.11, rot: -1.1, blush: false },
          { x: 0.68, z: 0.07, rot: 0.3, blush: false },
          // Around and slightly behind base (Z <= 0)
          { x: -1.10, z: -0.06, rot: 1.4, blush: false },
          { x: -0.98, z: -0.15, rot: -0.9, blush: true },
          { x: -0.78, z: -0.12, rot: 0.6, blush: false },
          { x: -0.55, z: -0.18, rot: -1.3, blush: false },
          { x: -0.32, z: -0.08, rot: 0.8, blush: true },
          { x: 0.15, z: -0.12, rot: -0.6, blush: false },
          { x: 0.42, z: -0.16, rot: 1.1, blush: false },
          { x: 0.60, z: -0.10, rot: -0.4, blush: true },
          { x: 0.75, z: -0.04, rot: 0.5, blush: false },
          // Additional outer romantic accents
          { x: -1.22, z: 0.04, rot: -0.7, blush: true },
          { x: -0.92, z: 0.20, rot: 1.0, blush: false },
          { x: -0.38, z: 0.22, rot: -1.2, blush: false },
          { x: 0.05, z: 0.19, rot: 0.4, blush: true },
          { x: 0.48, z: 0.22, rot: -0.8, blush: false },
          { x: 0.82, z: 0.12, rot: 1.3, blush: true },
        ];

        petalPositions.forEach((pt) => {
          const petal = new THREE.Mesh(petalGeo, pt.blush ? blushPetalMat : whitePetalMat);
          petal.rotation.x = -Math.PI / 2 + 0.04;
          petal.rotation.z = pt.rot;
          petal.position.set(pt.x, 0.003, pt.z);
          petal.receiveShadow = true;
          coupleGroup.add(petal);
        });
      } else {
        // Photo with background: framed portrait on dais
        const aspect = loadedImg.width / loadedImg.height;
        const height = 3.0;
        const width = Math.min(height * aspect, 2.4);
        const cGeo = new THREE.PlaneGeometry(width, height);
        const cMat = new THREE.MeshStandardMaterial({
          map: cTex,
          transparent: true,
          roughness: 0.4,
          side: THREE.DoubleSide,
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.set(0, height / 2 + 0.3, 0);
        cMesh.castShadow = true;
        coupleGroup.add(cMesh);

        // Subtle gold trim frame around portrait
        const trimGeo = new THREE.BoxGeometry(width + 0.08, height + 0.08, 0.04);
        const trimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.75 });
        const trimMesh = new THREE.Mesh(trimGeo, trimMat);
        trimMesh.position.set(0, height / 2 + 0.3, -0.025);
        coupleGroup.add(trimMesh);
      }
    };

    const loadCoupleImage = (src: string) => {
      const img = getOrPreloadImage(src);

      const onDone = () => {
        buildCoupleMesh(img, src);
      };

      if (img.complete && img.naturalWidth > 0) {
        onDone();
      } else {
        img.onload = onDone;
        img.onerror = () => {
          // If CORS anonymous failed on external image, attempt non-CORS reload
          if (img.crossOrigin) {
            const retryImg = new Image();
            retryImg.onload = () => buildCoupleMesh(retryImg, src);
            retryImg.src = src;
            imagePreloadCache.set(src, retryImg);
          }
        };
      }
    };

    if (coupleImgSrc) {
      loadCoupleImage(coupleImgSrc);
    }

    // 6. Photorealistic Foreground Bird of Paradise Plants (Left & Right framing)
    plantMeshesRef.current = [];
    const plantGeo = new THREE.PlaneGeometry(2.8, 3.8);

    textureLoader.load("/templates/the-wedding-story/plant.png", (plantTex) => {
      plantTex.colorSpace = THREE.SRGBColorSpace;
      const plantMat = new THREE.MeshStandardMaterial({
        map: plantTex,
        transparent: true,
        alphaTest: 0.05,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });

      // Left Plant
      const plantL = new THREE.Mesh(plantGeo, plantMat);
      plantL.position.set(-2.3, 1.4, 4.3);
      plantL.rotation.set(0.08, 0.25, -0.05);
      scene.add(plantL);
      plantMeshesRef.current.push(plantL);

      // Right Plant (Mirrored)
      const plantMatR = plantMat.clone();
      const plantR = new THREE.Mesh(plantGeo, plantMatR);
      plantR.scale.set(-1, 1, 1);
      plantR.position.set(2.3, 1.4, 4.3);
      plantR.rotation.set(0.08, -0.25, 0.05);
      scene.add(plantR);
      plantMeshesRef.current.push(plantR);
    });

    // 7. Floating Golden Dust Particles (Bokeh Sparkles)
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = Math.random() * 6.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d")!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, "rgba(255, 230, 180, 1)");
    pGrad.addColorStop(0.35, "rgba(255, 190, 120, 0.5)");
    pGrad.addColorStop(1, "rgba(255, 190, 120, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. The Side Invitation Table & Sealed Envelope Stationery
    const tableGroup = new THREE.Group();
    tableGroup.position.set(3.6, 0, 1.5);
    scene.add(tableGroup);

    // Marble Table Top
    const tableTopGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 32);
    const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x221a1f, roughness: 0.25, metalness: 0.3 });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.y = 1.0;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Table Leg
    const tableLegGeo = new THREE.CylinderGeometry(0.08, 0.18, 1.0, 16);
    const tableLegMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.35, metalness: 0.75 });
    const tableLeg = new THREE.Mesh(tableLegGeo, tableLegMat);
    tableLeg.position.y = 0.5;
    tableGroup.add(tableLeg);

    // ---------------------------------------------------------
    // REALISTIC GILDED TABLETOP CRADLE STAND (Concealed Behind Stationery)
    // ---------------------------------------------------------
    const standMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.28, metalness: 0.85 });
    const standGroup = new THREE.Group();
    standGroup.position.set(0, 1.04, 0.02);
    tableGroup.add(standGroup);

    // 1. Heavy polished gold base plate resting firmly on marble table
    const baseGeo = new THREE.BoxGeometry(0.76, 0.015, 0.20);
    const baseMesh = new THREE.Mesh(baseGeo, standMat);
    baseMesh.position.set(0, 0.0075, 0);
    baseMesh.receiveShadow = true;
    standGroup.add(baseMesh);

    // 2. Front retaining lip to keep the envelope securely propped
    const lipGeo = new THREE.BoxGeometry(0.76, 0.025, 0.015);
    const lipMesh = new THREE.Mesh(lipGeo, standMat);
    lipMesh.position.set(0, 0.022, 0.095);
    lipMesh.receiveShadow = true;
    standGroup.add(lipMesh);

    // 3. Low-profile angled back support - completely hidden behind envelope (height 0.26m vs envelope 0.78m)
    const backSupportGeo = new THREE.BoxGeometry(0.55, 0.26, 0.012);
    const backSupportMesh = new THREE.Mesh(backSupportGeo, standMat);
    backSupportMesh.position.set(0, 0.13, -0.04);
    backSupportMesh.rotation.set(-0.16, 0, 0);
    standGroup.add(backSupportMesh);

    // ---------------------------------------------------------
    // 3D SEALED ENVELOPE & SLIDING INVITATION CARD
    // ---------------------------------------------------------
    const envelopeGroup = new THREE.Group();
    envelopeGroup.position.set(0, 1.06, 0.03);
    envelopeGroup.rotation.set(-0.16, 0, 0);
    tableGroup.add(envelopeGroup);
    envelopeGroupRef.current = envelopeGroup;

    // 1. Envelope Back Panel (Custom velvet cardstock with gold damask inner foil lining)
    const backTex = createEnvelopeBackTexture(themePrimary, themePrimaryDark);
    const backGeo = new THREE.PlaneGeometry(0.98, 0.78);
    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      roughness: 0.38,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.set(0, 0.39, 0);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;
    envelopeGroup.add(backMesh);

    // 2. Luxury Printed Invitation Card (Sliding out on "View Invitation")
    const cardTex = createInvitationCardTexture(
      name,
      formattedDate ?? undefined,
      location ?? undefined,
      monogram,
      themePrimary,
      eventCopy.cardHeader,
      eventCopy.cardInvite,
      eventCopy.cardFooter,
    );
    const cardGeo = new THREE.PlaneGeometry(0.90, 0.68);
    const cardMat = new THREE.MeshStandardMaterial({
      map: cardTex,
      roughness: 0.32,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    // Initially tucked completely inside envelope pocket, strictly above the table surface
    cardMesh.position.set(0, 0.38, 0.014);
    cardMesh.castShadow = true;
    // Hidden while sealed to guarantee zero glitching or peeking from afar
    cardMesh.visible = false;
    envelopeGroup.add(cardMesh);
    cardMeshRef.current = cardMesh;

    // 3. Envelope Front Pocket (Theme velvet with V-notch dip and stamped gold monogram)
    const pocketTex = createEnvelopePocketTexture(
      monogram,
      themePrimary,
      themePrimaryDark,
      eventCopy.pocketBadge,
    );
    const pocketGeo = new THREE.PlaneGeometry(0.98, 0.54);
    const pocketMat = new THREE.MeshStandardMaterial({
      map: pocketTex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.42,
      metalness: 0.12,
      side: THREE.DoubleSide,
    });
    const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
    pocketMesh.position.set(0, 0.27, 0.024);
    pocketMesh.castShadow = true;
    envelopeGroup.add(pocketMesh);
    pocketMeshRef.current = pocketMesh;

    // 4. Envelope Top Flap & Wax Seal (Pivot Group for opening/sealing)
    const flapPivot = new THREE.Group();
    flapPivot.position.set(0, 0.78, 0.026); // Top hinge of the envelope back (in front of pocket when sealed)
    envelopeGroup.add(flapPivot);
    envelopeFlapPivotRef.current = flapPivot;

    // Triangular Flap Mesh
    const flapTex = createEnvelopeFlapTexture(themePrimary, themePrimaryDark);
    const flapGeo = new THREE.PlaneGeometry(0.98, 0.44);
    const flapMat = new THREE.MeshStandardMaterial({
      map: flapTex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.42,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const flapMesh = new THREE.Mesh(flapGeo, flapMat);
    flapMesh.position.set(0, -0.22, 0.003);
    flapMesh.castShadow = true;
    flapPivot.add(flapMesh);

    // Stamped 3D Golden/Custom Wax Seal on the Flap Tip
    const sealTex = createWaxSealStampTexture(monogram, themePrimary);
    const sealGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.015, 24);
    const sealMat = new THREE.MeshStandardMaterial({
      map: sealTex,
      roughness: 0.35,
      metalness: 0.4,
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.set(0, -0.38, 0.012);
    sealMesh.castShadow = true;
    flapPivot.add(sealMesh);

    // -------------------------------------------------------------
    // RENDER LOOP
    // -------------------------------------------------------------
    const clock = new THREE.Clock();
    const render = () => {
      animationFrameIdRef.current = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Gentle breeze swaying foreground plants
      plantMeshesRef.current.forEach((mesh, idx) => {
        mesh.rotation.z += Math.sin(elapsed * 1.5 + idx) * 0.0006;
      });

      // Drifting floating particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] -= 0.003;
        if (positions[i] < 0) positions[i] = 6.5;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle camera breathing
      if (experienceStateRef.current === "STAGE" && !isTransitioningRef.current && camera) {
        camera.position.y = 2.1 + Math.sin(elapsed * 0.8) * 0.025;
      }

      if (camera) {
        camera.lookAt(lookAtTargetRef.current);
      }

      renderer.render(scene, camera);
    };
    render();

    // -------------------------------------------------------------
    // EVENT LISTENERS & RESIZE
    // -------------------------------------------------------------
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Re-evaluate responsive camera positions on window resize
      const coords = getStationeryCameraCoords();

      // Adjust camera for new aspect ratio if currently viewing stationery
      if (!isTransitioningRef.current) {
        if (experienceStateRef.current === "TABLE") {
          camera.position.set(coords.table.pos.x, coords.table.pos.y, coords.table.pos.z);
          lookAtTargetRef.current.set(coords.table.lookAt.x, coords.table.lookAt.y, coords.table.lookAt.z);
        } else if (experienceStateRef.current === "INSPECT") {
          camera.position.set(coords.inspect.pos.x, coords.inspect.pos.y, coords.inspect.pos.z);
          lookAtTargetRef.current.set(coords.inspect.lookAt.x, coords.inspect.lookAt.y, coords.inspect.lookAt.z);
        } else if (experienceStateRef.current === "STAGE") {
          lookAtTargetRef.current.set(0, 1.8, 0);
        }
      }
    };
    window.addEventListener("resize", handleResize);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handleCanvasClick = (e: MouseEvent) => {
      if (!camera) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      if (envelopeGroupRef.current) {
        const hits = raycaster.intersectObjects(envelopeGroupRef.current.children, true);
        if (hits.length > 0) {
          const btn = document.getElementById("the-wedding-story-view-invitation-btn");
          if (btn) btn.click();
        }
      }
    };
    renderer.domElement.addEventListener("click", handleCanvasClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleCanvasClick);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      audioRef.current?.stop();
      stopAllCameraAnimations();
    };
  }, [coverImage, eventCopy, formattedDate, getStationeryCameraCoords, hasCustomTheme, location, monogram, name, stopAllCameraAnimations, themePrimary, themePrimaryDark, themePrimaryDeep]);

  // -------------------------------------------------------------
  // GSAP CAMERA TRANSITIONS
  // -------------------------------------------------------------

  // 1. Break Seal & Open Doors (Smoothly Zoom Out from Event Title)
  const handleBreakSeal = useCallback(() => {
    const camera = cameraRef.current;
    setIsSealBroken(true);
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    if (!audioRef.current) {
      audioRef.current = new RomanticAudioEngine();
    }
    userWantsAudioRef.current = true;
    audioRef.current.start(0.28);
    setIsAudioPlaying(true);

    stopAllCameraAnimations();

    // Transition state to STAGE after curtains finish parting (1.2s)
    stageTimeoutRef.current = setTimeout(() => {
      if (experienceStateRef.current === "SEAL") {
        experienceStateRef.current = "STAGE";
        setExperienceState("STAGE");
      }
    }, 1200);

    if (camera) {
      // Ensure starting position is focused on the event title
      camera.position.set(0, 3.80, 3.2);
      lookAtTargetRef.current.set(0, 3.85, -0.08);

      const tl = gsap.timeline({
        onComplete: () => {
          cameraTimelineRef.current = null;
          experienceStateRef.current = "STAGE";
          isTransitioningRef.current = false;
          setIsTransitioning(false);
          panningTimelineRef.current = gsap.to(camera.position, {
            x: 1.6,
            duration: 9.0,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });
      cameraTimelineRef.current = tl;

      // As doors part (starting at t = 0.2s), smoothly zoom out and pull back from event title to wide stage shot
      tl.to(
        camera.position,
        {
          x: 0,
          y: 2.1,
          z: 7.8,
          duration: 3.2,
          ease: "power2.out",
        },
        0.2,
      );

      tl.to(
        lookAtTargetRef.current,
        {
          x: 0,
          y: 1.8,
          z: 0,
          duration: 3.2,
          ease: "power2.out",
        },
        0.2,
      );
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 3400);
    }
  }, [stopAllCameraAnimations]);

  // 2. View Invitation (Dolly to table & automatically unseal envelope and slide out invitation card)
  const handleMoveToTable = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    stopAllCameraAnimations();

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const coords = getStationeryCameraCoords();

    const tl = gsap.timeline({
      onComplete: () => {
        cameraTimelineRef.current = null;
        envelopeStateRef.current = "OPEN";
        experienceStateRef.current = "TABLE";
        setExperienceState("TABLE");
        isTransitioningRef.current = false;
        setIsTransitioning(false);

        // Guarantee camera and target are locked straight-on with zero sideways tilt
        camera.position.set(coords.table.pos.x, coords.table.pos.y, coords.table.pos.z);
        lookAtTargetRef.current.set(coords.table.lookAt.x, coords.table.lookAt.y, coords.table.lookAt.z);
        camera.lookAt(lookAtTargetRef.current);
      },
    });
    cameraTimelineRef.current = tl;

    // Camera smoothly pans to eye-level, straight-on table viewing position
    tl.to(camera.position, {
      x: coords.table.pos.x,
      y: coords.table.pos.y,
      z: coords.table.pos.z,
      duration: 2.8,
      ease: "power2.inOut",
    });

    tl.to(
      lookAtTargetRef.current,
      {
        x: coords.table.lookAt.x,
        y: coords.table.lookAt.y,
        z: coords.table.lookAt.z,
        duration: 2.8,
        ease: "power2.inOut",
      },
      "<",
    );

    // In-flight approach (t = 1.35s): As camera glides into the table vicinity,
    // envelope flap unseals and swings open BACKWARDS behind the back panel
    if (envelopeFlapPivotRef.current) {
      tl.to(
        envelopeFlapPivotRef.current.rotation,
        {
          x: Math.PI * 0.88,
          duration: 0.9,
          ease: "power2.inOut",
        },
        1.35,
      );
      tl.to(
        envelopeFlapPivotRef.current.position,
        {
          z: -0.005,
          duration: 0.9,
          ease: "power2.inOut",
        },
        1.35,
      );
    }

    // At t = 1.7s, reveal card and play subtle paper/seal opening chime
    tl.call(() => {
      if (cardMeshRef.current) {
        cardMeshRef.current.visible = true;
      }
      audioRef.current?.playOpenEnvelopeSound();
    }, [], 1.7);

    // At t = 1.8s (mid-approach as flap opens behind), card smoothly slides up out of the pocket,
    // settling into place right as the camera locks into its final framing
    if (cardMeshRef.current) {
      tl.to(
        cardMeshRef.current.position,
        {
          y: 0.72,
          z: 0.028,
          duration: 1.2,
          ease: "power2.out",
        },
        1.8,
      );
    }
  }, [getStationeryCameraCoords, stopAllCameraAnimations]);

  // 3. Hold Me (Inspect close-up straight-on view with responsive mobile framing)
  const handleInspectCard = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    stopAllCameraAnimations();

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const coords = getStationeryCameraCoords();

    const tl = gsap.timeline({
      onComplete: () => {
        cameraTimelineRef.current = null;
        experienceStateRef.current = "INSPECT";
        setExperienceState("INSPECT");
        isTransitioningRef.current = false;
        setIsTransitioning(false);

        camera.position.set(coords.inspect.pos.x, coords.inspect.pos.y, coords.inspect.pos.z);
        lookAtTargetRef.current.set(coords.inspect.lookAt.x, coords.inspect.lookAt.y, coords.inspect.lookAt.z);
        camera.lookAt(lookAtTargetRef.current);
      },
    });
    cameraTimelineRef.current = tl;

    tl.to(camera.position, {
      x: coords.inspect.pos.x,
      y: coords.inspect.pos.y,
      z: coords.inspect.pos.z,
      duration: 1.4,
      ease: "power2.out",
    });

    tl.to(
      lookAtTargetRef.current,
      {
        x: coords.inspect.lookAt.x,
        y: coords.inspect.lookAt.y,
        z: coords.inspect.lookAt.z,
        duration: 1.4,
        ease: "power2.out",
      },
      "<",
    );
  }, [getStationeryCameraCoords, stopAllCameraAnimations]);

  // 4. Release Card back to table view
  const handleReleaseCard = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    stopAllCameraAnimations();

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const coords = getStationeryCameraCoords();

    const tl = gsap.timeline({
      onComplete: () => {
        cameraTimelineRef.current = null;
        experienceStateRef.current = "TABLE";
        setExperienceState("TABLE");
        isTransitioningRef.current = false;
        setIsTransitioning(false);

        camera.position.set(coords.table.pos.x, coords.table.pos.y, coords.table.pos.z);
        lookAtTargetRef.current.set(coords.table.lookAt.x, coords.table.lookAt.y, coords.table.lookAt.z);
        camera.lookAt(lookAtTargetRef.current);
      },
    });
    cameraTimelineRef.current = tl;

    tl.to(camera.position, {
      x: coords.table.pos.x,
      y: coords.table.pos.y,
      z: coords.table.pos.z,
      duration: 1.2,
      ease: "power2.inOut",
    });

    tl.to(
      lookAtTargetRef.current,
      {
        x: coords.table.lookAt.x,
        y: coords.table.lookAt.y,
        z: coords.table.lookAt.z,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "<",
    );
  }, [getStationeryCameraCoords, stopAllCameraAnimations]);

  // 5. Return to Stage & Re-seal Envelope & Engage Continuous Promotional Pan
  const handleReturnToStage = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    stopAllCameraAnimations();

    isTransitioningRef.current = true;
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        cameraTimelineRef.current = null;
        if (cardMeshRef.current) {
          cardMeshRef.current.visible = false;
        }
        envelopeStateRef.current = "CLOSED";
        experienceStateRef.current = "STAGE";
        setExperienceState("STAGE");
        isTransitioningRef.current = false;
        setIsTransitioning(false);

        // Continuous slow cinematic pan left to right
        panningTimelineRef.current = gsap.to(camera.position, {
          x: 1.6,
          duration: 9.0,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      },
    });
    cameraTimelineRef.current = tl;

    // Camera glides back to wide stage view
    tl.to(camera.position, {
      x: 0,
      y: 2.1,
      z: 7.8,
      duration: 3.4,
      ease: "power2.inOut",
    });

    tl.to(
      lookAtTargetRef.current,
      {
        x: 0,
        y: 1.8,
        z: 0,
        duration: 3.4,
        ease: "power2.inOut",
      },
      "<",
    );

    // Concurrently slide card back into envelope pocket
    if (cardMeshRef.current) {
      tl.to(
        cardMeshRef.current.position,
        {
          y: 0.38,
          z: 0.014,
          duration: 0.9,
          ease: "power2.in",
        },
        0.1,
      );
    }

    // Flap folds back down over front pocket and seals shut
    if (envelopeFlapPivotRef.current) {
      tl.to(
        envelopeFlapPivotRef.current.rotation,
        {
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0.8,
      );
      tl.to(
        envelopeFlapPivotRef.current.position,
        {
          z: 0.026,
          duration: 0.8,
          ease: "power2.out",
        },
        0.8,
      );
    }
  }, [stopAllCameraAnimations]);

  // Form Submissions
  const {
    register: registerRsvp,
    handleSubmit: handleSubmitRsvp,
    setValue: setRsvpValue,
    watch: watchRsvp,
    reset: resetRsvp,
    formState: { errors: rsvpErrors, isSubmitting: isRsvpSubmitting },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { name: "", email: "", phone: "", rsvpStatus: RSVPStatus.GOING },
  });

  const selectedRsvpStatus = watchRsvp("rsvpStatus");

  const onRsvpSubmit: SubmitHandler<RsvpFormValues> = async (values) => {
    setRsvpError(null);
    try {
      const payload: SubmitRsvpPayload = {
        eventId,
        rsvpStatus: values.rsvpStatus,
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
      };
      await submitRsvpApi(payload);
      setIsRsvpSubmitted(true);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setRsvpError(e.message || "Failed to submit RSVP.");
    }
  };

  const {
    register: registerToast,
    handleSubmit: handleSubmitToast,
    reset: resetToast,
    formState: { errors: toastErrors, isSubmitting: isToastSubmitting },
  } = useForm<ToastFormValues>({
    resolver: zodResolver(toastSchema),
    defaultValues: { authorName: "", email: "", content: "", amount: "", currency: "NGN" },
  });

  const onToastSubmit: SubmitHandler<ToastFormValues> = async (values) => {
    setToastError(null);
    try {
      const parsedAmount = values.amount ? Number(values.amount) : undefined;
      const payload: CreateToastPayload = {
        eventId,
        content: values.content,
        authorName: values.authorName || undefined,
        amount: parsedAmount && parsedAmount > 0 ? parsedAmount : undefined,
        email: values.email || undefined,
        currency: parsedAmount && parsedAmount > 0 ? values.currency : undefined,
        callbackUrl: `${window.location.origin}${window.location.pathname}?toast=success`,
      };

      const res = await createToastApi(payload);
      const data = res.data?.data;

      if (data && "paymentId" in data && "reference" in data && data.reference) {
        if ("authorizationUrl" in data && data.authorizationUrl) {
          window.location.href = data.authorizationUrl;
          return;
        }
        if (window.PaystackPop) {
          const handler = window.PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
            email: values.email,
            amount: Number(data.amount) * 100,
            currency: data.currency || values.currency,
            ref: data.reference,
            callback: () => setIsToastSubmitted(true),
            onClose: () => setToastError("Payment cancelled."),
          });
          handler.openIframe();
        } else {
          setIsToastSubmitted(true);
        }
      } else {
        setIsToastSubmitted(true);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setToastError(e.message || "Failed to send toast.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black text-white font-serif select-none"
    >
      {/* Playfair Display Luxury Typography */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
      />

      {/* High-priority asset preloads for immediate stage readiness & fastest LCP */}
      {coupleImgSrc && (
        <link
          rel="preload"
          as="image"
          href={coupleImgSrc}
          fetchPriority="high"
          {...(coupleImgSrc.startsWith("http://") || coupleImgSrc.startsWith("https://")
            ? { crossOrigin: "anonymous" }
            : {})}
        />
      )}
      <link rel="preload" as="image" href="/templates/the-wedding-story/cover_velvet.jpg" fetchPriority="high" />
      <link rel="preload" as="image" href="/templates/the-wedding-story/wax_seal.png" fetchPriority="high" />
      <link rel="preload" as="image" href="/templates/the-wedding-story/curtains.jpg" />
      <link rel="preload" as="image" href="/templates/the-wedding-story/floral_arch.png" />
      <link rel="preload" as="image" href="/templates/the-wedding-story/floor.jpg" />

      {/* 3D WebGL Canvas Layer */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header Controls */}
      {experienceState !== "SEAL" && (
        <header className="fixed top-5 inset-x-0 z-40 px-6 sm:px-10 max-w-7xl mx-auto flex items-center justify-end pointer-events-none animate-in fade-in duration-700">
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Event Story & Details Trigger */}
            <button
              type="button"
              onClick={() => setIsDescriptionOpen(true)}
              title="View Event Story & Details"
              className="p-2.5 rounded-full bg-stone-950/60 hover:bg-stone-900 border border-stone-800 hover:border-amber-400/50 text-stone-300 hover:text-amber-200 backdrop-blur-md shadow-xl transition-all cursor-pointer flex items-center gap-1.5 group"
            >
              <BookOpen className="w-4 h-4 text-amber-300/90 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-sans font-medium text-stone-200">
                Details
              </span>
            </button>

            <button
              type="button"
              onClick={toggleAudio}
              title={isAudioPlaying ? "Mute Music" : "Play Romantic Melody"}
              className={`p-2.5 rounded-full border backdrop-blur-md shadow-xl transition-all cursor-pointer ${
                isAudioPlaying
                  ? "bg-amber-500/25 border-amber-400/60 text-amber-200"
                  : "bg-stone-950/60 border-stone-800 text-stone-300 hover:bg-stone-900"
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              className="p-2.5 rounded-full bg-stone-950/60 hover:bg-stone-900 border border-stone-800 text-stone-300 backdrop-blur-md shadow-xl transition-all cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <EventShare
              slug={event.slug}
              eventName={name}
              triggerClassName="border-stone-800 bg-stone-950/60 text-stone-200 hover:bg-stone-900 p-2.5 rounded-full backdrop-blur-md shadow-xl cursor-pointer"
            />
          </div>
        </header>
      )}

      {/* Floating Header for SEAL View (Before opening) */}
      {experienceState === "SEAL" && !isSealBroken && (
        <header className="fixed top-5 inset-x-0 z-40 px-6 sm:px-10 max-w-7xl mx-auto flex items-center justify-end pointer-events-none animate-in fade-in duration-700">
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDescriptionOpen(true)}
              title="View Event Story & Details"
              className="px-3.5 py-2 rounded-full bg-stone-950/70 hover:bg-stone-900 border border-amber-400/30 hover:border-amber-400/60 text-stone-200 hover:text-amber-200 backdrop-blur-md shadow-xl transition-all cursor-pointer flex items-center gap-2 text-xs font-sans font-medium"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Event Details</span>
            </button>
            <EventShare
              slug={event.slug}
              eventName={name}
              triggerClassName="border-stone-800 bg-stone-950/70 text-stone-200 hover:bg-stone-900 p-2.5 rounded-full backdrop-blur-md shadow-xl cursor-pointer"
            />
          </div>
        </header>
      )}

      {/* ========================================================= */}
      {/* 1. INITIAL WAX SEAL COVER (EXACT MATCH TO SCREENSHOT 1)   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {experienceState === "SEAL" && (
          <div className="absolute inset-0 z-50 overflow-hidden flex">
            {/* Left Velvet Door Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: isSealBroken ? "-100%" : 0 }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full relative shadow-[10px_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{
                backgroundImage: `url('/templates/the-wedding-story/cover_velvet.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center left",
              }}
            >
              {hasCustomTheme && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: themePrimary,
                    mixBlendMode: "color",
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
            </motion.div>

            {/* Right Velvet Door Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: isSealBroken ? "100%" : 0 }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full relative shadow-[-10px_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
              style={{
                backgroundImage: `url('/templates/the-wedding-story/cover_velvet.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center right",
              }}
            >
              {hasCustomTheme && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: themePrimary,
                    mixBlendMode: "color",
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-black/30 pointer-events-none" />
            </motion.div>

            {/* Vertical Center Satin Gold Ribbon */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isSealBroken ? 0 : 1 }}
              transition={{ duration: 0.35 }}
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-8 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20 pointer-events-none"
              style={{
                backgroundColor: "#c59a3f",
                backgroundImage: `linear-gradient(90deg, #8a631c 0%, #ffd978 35%, #fbe8a6 50%, #e6be5c 65%, #7a5413 100%)`,
              }}
            />

            {/* Center Interactive Wax Seal with Invitation Text */}
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: isSealBroken ? 0 : 1, scale: isSealBroken ? 1.4 : 1 }}
              transition={{ duration: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none"
            >
              {/* Text to the left of the seal: "Click to Open Invitation" */}
              <div className="absolute right-[calc(100%+16px)] sm:right-[calc(100%+24px)] text-right whitespace-nowrap">
                <span className="text-stone-100 text-xs sm:text-sm font-sans font-medium tracking-wide leading-tight block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Click to Open
                </span>
                <span className="text-stone-100 text-xs sm:text-sm font-sans font-medium tracking-wide leading-tight block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Invitation
                </span>
              </div>

              {/* The Realistic Wax Seal Button */}
              <button
                type="button"
                onClick={handleBreakSeal}
                className="pointer-events-auto relative w-20 h-20 sm:w-24 sm:h-24 cursor-pointer group focus:outline-none transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                title="Click to Open Invitation"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/templates/the-wedding-story/wax_seal.png"
                  alt="Royal Gold Wax Seal"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.7)]"
                />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 2. MAIN STAGE: "VIEW INVITATION" (MATCHING SCREENSHOT 2)  */}
      {/* ========================================================= */}
      {experienceState === "STAGE" && !isTransitioning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="fixed bottom-10 inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Circular Button with Envelope Icon & Text (Exact Match to Screenshot 2) */}
          <button
            id="the-wedding-story-view-invitation-btn"
            type="button"
            onClick={handleMoveToTable}
            className="pointer-events-auto flex flex-col items-center justify-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            {/* Circular Envelope Icon Button */}
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-all duration-300 ${
                hasCustomTheme
                  ? "border border-white/20"
                  : "bg-stone-950/70 border border-white/20 text-white shadow-[0_8px_30px_rgba(0,0,0,0.8)] group-hover:border-amber-300/50"
              }`}
              style={
                hasCustomTheme
                  ? {
                      backgroundColor: themePrimary,
                      color: contrastText,
                      boxShadow: `0 8px 30px ${hexToRgba(themePrimary, 0.45)}`,
                    }
                  : undefined
              }
            >
              <Mail
                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors"
                style={hasCustomTheme ? { color: contrastText } : undefined}
              />
            </div>

            {/* Label Text Beneath */}
            <span className="text-xs sm:text-sm font-sans font-medium text-stone-100 tracking-wide drop-shadow-md group-hover:text-amber-200 transition-colors">
              View Invitation
            </span>
          </button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* 3. TABLE VIEW CONTROLS ("Hold Me" & "Return to Stage")    */}
      {/* ========================================================= */}
      {experienceState === "TABLE" && !isTransitioning && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ duration: 0.6 }}
          className="fixed bottom-8 inset-x-0 z-30 flex items-center justify-center gap-4 pointer-events-none px-4"
        >
          <Button
            onClick={handleReturnToStage}
            variant="outline"
            className="pointer-events-auto h-12 px-6 rounded-full border-amber-300/30 bg-stone-950/75 hover:bg-stone-900 text-stone-200 font-sans text-xs tracking-wider uppercase backdrop-blur-md cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>Return to Stage</span>
          </Button>

          <Button
            onClick={handleInspectCard}
            className={`pointer-events-auto h-12 px-8 rounded-full font-sans font-bold text-xs tracking-widest uppercase transition-all cursor-pointer flex items-center gap-2 ${
              hasCustomTheme
                ? "hover:scale-105"
                : "bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-stone-950 shadow-[0_10px_35px_rgba(212,175,55,0.4)] hover:scale-105"
            }`}
            style={
              hasCustomTheme
                ? {
                    backgroundColor: themePrimary,
                    color: contrastText,
                    boxShadow: `0 10px 35px ${hexToRgba(themePrimary, 0.45)}`,
                  }
                : undefined
            }
          >
            <Hand className="w-4 h-4" style={hasCustomTheme ? { color: contrastText } : undefined} />
            <span>Hold Me</span>
          </Button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* 4. CARD INSPECT VIEW (Close-up reading & Action buttons)  */}
      {/* ========================================================= */}
      {experienceState === "INSPECT" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-30 flex flex-col justify-between p-6 sm:p-10 pointer-events-none"
        >
          <div className="flex justify-end pt-12">
            <Button
              onClick={handleReleaseCard}
              variant="outline"
              className="pointer-events-auto rounded-full border-amber-300/40 bg-stone-950/80 hover:bg-stone-900 text-stone-200 font-sans text-xs tracking-wider uppercase px-5 h-10 backdrop-blur-md cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4 text-amber-300" />
              <span>Put Down</span>
            </Button>
          </div>

          <div className="max-w-xl mx-auto w-full space-y-4 pb-4">
            <div
              className="p-4 sm:p-5 rounded-2xl bg-stone-950/80 border border-amber-400/30 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto"
              style={hasCustomTheme ? { borderColor: hexToRgba(themePrimary, 0.35) } : undefined}
            >
              <div className="text-left font-sans">
                <span
                  className="text-[10px] uppercase tracking-widest block font-semibold"
                  style={{ color: hasCustomTheme ? themePrimary : "#fcd34d" }}
                >
                  {eventCopy.invitationBadge}
                </span>
                <p className="text-sm font-bold text-stone-100">{name}</p>
                <p className="text-xs text-stone-400">{formattedDate || "A Special Celebration"}</p>
              </div>

              <div className="flex flex-col items-stretch sm:items-end gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    onClick={() => setIsRsvpOpen(true)}
                    className={`flex-1 sm:flex-initial h-10 px-5 ${buttonRadius} font-sans font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
                      hasCustomTheme ? "" : "bg-amber-400 hover:bg-amber-500 text-stone-950"
                    }`}
                    style={hasCustomTheme ? primaryBtnStyle : undefined}
                  >
                    RSVP Now
                  </Button>

                  <Button
                    onClick={() => setIsToastOpen(true)}
                    variant="outline"
                    className={`flex-1 sm:flex-initial h-10 px-4 ${buttonRadius} border-amber-400/40 bg-stone-900/60 hover:bg-stone-800 text-stone-200 font-sans text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5`}
                    style={hasCustomTheme ? { borderColor: hexToRgba(themePrimary, 0.4) } : undefined}
                  >
                    <GlassWater
                      className="w-3.5 h-3.5"
                      style={{ color: hasCustomTheme ? themePrimary : "#fcd34d" }}
                    />
                    {eventCopy.toastButton}
                  </Button>
                </div>

                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setIsDescriptionOpen(true)}
                  className="h-auto p-0 text-xs text-amber-300/80 hover:text-amber-200 font-sans tracking-wide cursor-pointer flex items-center justify-center sm:justify-end gap-1.5 self-center sm:self-end"
                  style={hasCustomTheme ? { color: themePrimary } : undefined}
                >
                  {/* <BookOpen className="w-3.5 h-3.5" /> */}
                  <span>{eventCopy.storyButton}</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* EVENT DESCRIPTION & STORY SLIDEOVER (SHEET)               */}
      {/* ========================================================= */}
      <Sheet open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md md:max-w-lg bg-stone-950/95 border-l border-amber-400/25 text-stone-100 backdrop-blur-2xl shadow-2xl p-0 flex flex-col z-50 overflow-hidden"
          style={hasCustomTheme ? { borderLeftColor: hexToRgba(themePrimary, 0.45) } : undefined}
        >
          {/* Header */}
          <SheetHeader className="p-6 pb-5 border-b border-stone-800/80 bg-stone-900/40">
            <div className="flex items-center gap-3.5 pr-8">
              <div
                className="w-11 h-11 rounded-full border border-amber-400/40 flex items-center justify-center font-serif text-sm font-bold text-amber-200 bg-amber-950/30 shrink-0 shadow-inner"
                style={
                  hasCustomTheme
                    ? {
                        borderColor: themePrimary,
                        color: contrastText,
                        backgroundColor: themePrimaryDark,
                      }
                    : undefined
                }
              >
                {monogram}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <span
                  className="text-[10px] uppercase tracking-widest block font-semibold"
                  style={{ color: hasCustomTheme ? themePrimary : "#fcd34d" }}
                >
                  {eventCopy.storyHeader}
                </span>
                <SheetTitle className="text-lg sm:text-xl font-serif font-bold text-stone-100 tracking-wide truncate">
                  {name}
                </SheetTitle>
              </div>
            </div>
            <SheetDescription className="sr-only">
              {eventCopy.storySrDescription}
            </SheetDescription>
          </SheetHeader>

          {/* Quick Info Badges */}
          {(formattedDate || location) && (
            <div className="grid grid-cols-1 gap-2.5 px-6 py-3.5 border-b border-stone-800/80 bg-stone-900/20">
              {formattedDate && (
                <div className="flex items-center gap-2.5 text-xs text-stone-300 font-sans">
                  <Calendar
                    className="w-4 h-4 shrink-0 text-amber-400"
                    style={hasCustomTheme ? { color: themePrimary } : undefined}
                  />
                  <span className="font-medium">{formattedDate}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2.5 text-xs text-stone-300 font-sans">
                  <MapPin
                    className="w-4 h-4 shrink-0 text-amber-400"
                    style={hasCustomTheme ? { color: themePrimary } : undefined}
                  />
                  <span className="font-medium line-clamp-2">{location}</span>
                </div>
              )}
            </div>
          )}

          {/* Scrollable Description Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase font-serif tracking-widest text-amber-300/80">
              <Sparkles className="w-3.5 h-3.5" style={hasCustomTheme ? { color: themePrimary } : undefined} />
              <span>Event Details</span>
            </div>

            {description ? (
              <div
                className="prose prose-invert prose-stone max-w-none text-stone-200 text-sm leading-relaxed font-sans whitespace-pre-line space-y-3 selection:bg-amber-500/30 [&_a]:text-amber-300 [&_a]:underline [&_strong]:text-stone-100 [&_h1]:text-stone-100 [&_h2]:text-stone-100 [&_h3]:text-stone-100"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <div className="py-12 text-center space-y-3 font-sans">
                <Sparkles
                  className="w-8 h-8 mx-auto text-amber-400/50"
                  style={hasCustomTheme ? { color: themePrimary } : undefined}
                />
                <p className="text-stone-300 text-sm italic font-serif">
                  {eventCopy.storyEmptyText}
                </p>
                <p className="text-stone-500 text-xs">
                  Full celebration schedule and program details will be shared during the event.
                </p>
              </div>
            )}
          </div>

          {/* Footer with Quick RSVP & Toast Actions */}
          <SheetFooter className="p-6 border-t border-stone-800/80 bg-stone-900/60 mt-auto">
            <div className="flex items-center gap-3 w-full">
              <Button
                onClick={() => {
                  setIsDescriptionOpen(false);
                  setIsRsvpOpen(true);
                }}
                className={`flex-1 h-11 ${buttonRadius} font-sans font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
                  hasCustomTheme ? "" : "bg-amber-400 hover:bg-amber-500 text-stone-950 shadow-[0_4px_16px_rgba(212,175,55,0.3)]"
                }`}
                style={hasCustomTheme ? primaryBtnStyle : undefined}
              >
                RSVP
              </Button>

              <Button
                onClick={() => {
                  setIsDescriptionOpen(false);
                  setIsToastOpen(true);
                }}
                variant="outline"
                className={`flex-1 h-11 ${buttonRadius} border-amber-400/40 bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-sans text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5`}
                style={hasCustomTheme ? { borderColor: hexToRgba(themePrimary, 0.4) } : undefined}
              >
                <GlassWater
                  className="w-3.5 h-3.5"
                  style={{ color: hasCustomTheme ? themePrimary : "#fcd34d" }}
                />
                <span>{eventCopy.toastButton}</span>
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ========================================================= */}
      {/* RSVP MODAL                                                */}
      {/* ========================================================= */}
      {isRsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 p-6 sm:p-8 shadow-2xl font-sans text-stone-100 rounded-3xl">
            <button
              type="button"
              onClick={() => {
                setIsRsvpOpen(false);
                setIsRsvpSubmitted(false);
                setRsvpError(null);
                resetRsvp();
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isRsvpSubmitted ? (
              <div className="text-center py-6 space-y-4 font-sans">
                <CheckCircle2
                  className="w-14 h-14 mx-auto animate-bounce"
                  style={{ color: hasCustomTheme ? themePrimary : "#fbbf24" }}
                />
                <h3 className="text-2xl font-serif text-stone-100">RSVP Confirmed!</h3>
                <p className="text-stone-300 text-sm">
                  We look forward to celebrating this beautiful day with you!
                </p>
                <Button
                  onClick={() => {
                    setIsRsvpOpen(false);
                    setIsRsvpSubmitted(false);
                  }}
                  className={`mt-4 bg-stone-800 hover:bg-stone-700 text-stone-200 px-6 ${buttonRadius} cursor-pointer`}
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-serif text-stone-100">Confirm Attendance</h3>
                  <p className="text-xs text-stone-400 mt-1">Please provide your details below to RSVP.</p>
                </div>

                {rsvpError && (
                  <div className="p-3 text-xs bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg">
                    {rsvpError}
                  </div>
                )}

                <form onSubmit={handleSubmitRsvp(onRsvpSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpValue("rsvpStatus", RSVPStatus.GOING)}
                      className={`py-2 px-3 text-xs font-semibold ${buttonRadius} border transition-all cursor-pointer ${
                        selectedRsvpStatus === RSVPStatus.GOING
                          ? hasCustomTheme
                            ? "font-bold"
                            : "bg-amber-500 border-amber-400 text-stone-950 font-bold"
                          : "bg-stone-800 border-stone-700 text-stone-300"
                      }`}
                      style={
                        selectedRsvpStatus === RSVPStatus.GOING && hasCustomTheme
                          ? { backgroundColor: themePrimary, borderColor: themePrimary, color: contrastText }
                          : undefined
                      }
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpValue("rsvpStatus", RSVPStatus.NOT_GOING)}
                      className={`py-2 px-3 text-xs font-semibold ${buttonRadius} border transition-all cursor-pointer ${
                        selectedRsvpStatus === RSVPStatus.NOT_GOING
                          ? hasCustomTheme
                            ? "font-bold"
                            : "bg-amber-500 border-amber-400 text-stone-950 font-bold"
                          : "bg-stone-800 border-stone-700 text-stone-300"
                      }`}
                      style={
                        selectedRsvpStatus === RSVPStatus.NOT_GOING && hasCustomTheme
                          ? { backgroundColor: themePrimary, borderColor: themePrimary, color: contrastText }
                          : undefined
                      }
                    >
                      Decline
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Full Name *</label>
                    <input
                      {...registerRsvp("name")}
                      placeholder="Jane Doe"
                      className={`w-full h-11 px-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none`}
                    />
                    {rsvpErrors.name && <p className="text-xs text-rose-400">{rsvpErrors.name.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Email Address</label>
                    <input
                      {...registerRsvp("email")}
                      type="email"
                      placeholder="jane@example.com"
                      className={`w-full h-11 px-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Phone Number</label>
                    <input
                      {...registerRsvp("phone")}
                      type="tel"
                      placeholder="+234..."
                      className={`w-full h-11 px-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none`}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isRsvpSubmitting}
                    className={`w-full h-11 font-bold ${buttonRadius} cursor-pointer transition-all ${
                      hasCustomTheme ? "" : "bg-amber-400 hover:bg-amber-500 text-stone-950"
                    }`}
                    style={hasCustomTheme ? primaryBtnStyle : undefined}
                  >
                    {isRsvpSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Submit RSVP"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOAST & CASH GIFT MODAL                                   */}
      {/* ========================================================= */}
      {isToastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 p-6 sm:p-8 shadow-2xl font-sans text-stone-100 rounded-3xl">
            <button
              type="button"
              onClick={() => {
                setIsToastOpen(false);
                setIsToastSubmitted(false);
                setToastError(null);
                resetToast();
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isToastSubmitted ? (
              <div className="text-center py-6 space-y-4 font-sans">
                <GlassWater
                  className="w-14 h-14 mx-auto animate-bounce"
                  style={{ color: hasCustomTheme ? themePrimary : "#fbbf24" }}
                />
                <h3 className="text-2xl font-serif text-stone-100">Toast Sent!</h3>
                <p className="text-stone-300 text-sm">
                  {eventCopy.toastSuccess}
                </p>
                <Button
                  onClick={() => {
                    setIsToastOpen(false);
                    setIsToastSubmitted(false);
                  }}
                  className={`mt-4 bg-stone-800 hover:bg-stone-700 text-stone-200 px-6 ${buttonRadius} cursor-pointer`}
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-serif text-stone-100">{eventCopy.toastModalTitle}</h3>
                  <p className="text-xs text-stone-400 mt-1">{eventCopy.toastModalSubtitle}</p>
                </div>

                {toastError && (
                  <div className="p-3 text-xs bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg">
                    {toastError}
                  </div>
                )}

                <form onSubmit={handleSubmitToast(onToastSubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Your Name</label>
                    <input
                      {...registerToast("authorName")}
                      placeholder="Jane Doe (Optional)"
                      className={`w-full h-11 px-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Toast Message *</label>
                    <textarea
                      {...registerToast("content")}
                      rows={3}
                      placeholder={eventCopy.toastPlaceholder}
                      className={`w-full p-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none resize-none`}
                    />
                    {toastErrors.content && <p className="text-xs text-rose-400">{toastErrors.content.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Cash Gift (Optional)</label>
                    <div className="flex gap-2">
                      <select
                        {...registerToast("currency")}
                        className={`h-11 px-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none`}
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                      <input
                        {...registerToast("amount")}
                        type="number"
                        placeholder="0.00"
                        className={`w-full h-11 px-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-300">Email Address</label>
                    <input
                      {...registerToast("email")}
                      type="email"
                      placeholder="jane@example.com"
                      className={`w-full h-11 px-3 bg-stone-950 border border-stone-800 ${buttonRadius} text-sm text-stone-100 focus:border-amber-400 focus:outline-none`}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isToastSubmitting}
                    className={`w-full h-11 font-bold ${buttonRadius} cursor-pointer transition-all ${
                      hasCustomTheme ? "" : "bg-amber-400 hover:bg-amber-500 text-stone-950"
                    }`}
                    style={hasCustomTheme ? primaryBtnStyle : undefined}
                  >
                    {isToastSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Send Toast"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ticket Purchase Modal */}
      {ticketEvent && ticketEvent.tiers.length > 0 && (
        <TicketPurchaseModal
          open={isTicketOpen}
          onOpenChange={setIsTicketOpen}
          tiers={ticketEvent.tiers}
          currency={currency}
          eventId={eventId}
          eventName={name}
          slug={event.slug}
        />
      )}
    </div>
  );
}
