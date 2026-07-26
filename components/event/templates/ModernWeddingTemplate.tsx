// @/components/templates/ModernWeddingTemplate.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { TemplateProps } from "./types";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import {
  Calendar,
  MapPin,
  Ticket,
  Heart,
  Sparkles,
  Clock,
  CheckCircle2,
  Loader2,
  X,
  GlassWater,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RSVPStatus } from "@/types/enum";
import { submitRsvpApi, createToastApi } from "@/lib/api/events";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitRsvpPayload, CreateToastPayload } from "@/types/payload";

// Declare Paystack Pop object for TypeScript
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
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .min(7, "Invalid phone number")
      .optional()
      .or(z.literal("")),
    rsvpStatus: z.enum(
      [RSVPStatus.GOING, RSVPStatus.NOT_GOING, RSVPStatus.MAYBE] as const,
      {
        message: "Please select your attendance status",
      },
    ),
  })
  .refine(
    (data) =>
      Boolean(data.email && data.email.trim() !== "") ||
      Boolean(data.phone && data.phone.trim() !== ""),
    {
      message: "Either Email or Phone number must be provided",
      path: ["email"],
    },
  );

type RsvpFormValues = z.infer<typeof rsvpSchema>;

const toastSchema = z
  .object({
    authorName: z.string().optional(),
    email: z
      .email("Valid email is required for receipt")
      .optional()
      .or(z.literal("")),
    content: z.string().min(3, "Please write a toast message"),
    amount: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
        "Amount must be a valid non-negative number",
      ),
    currency: z.string(),
  })
  .refine(
    (data) => {
      const numAmount = Number(data.amount || 0);
      if (numAmount > 0) {
        return Boolean(data.email && data.email.trim() !== "");
      }
      return true;
    },
    {
      message: "Email is required when making a monetary toast",
      path: ["email"],
    },
  );

type ToastFormValues = z.infer<typeof toastSchema>;

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function ModernWeddingTemplate({
  event,
  formattedDate,
  isCoverVideo,
  borderRadiusClass: defaultBorderRadiusClass,
}: TemplateProps) {
  const {
    id: eventId,
    name,
    description,
    coverImage,
    extraMedia = [],
    location,
    host,
    isCustomTheme = false,
    theme,
  } = event;

  const searchParams = useSearchParams();
  const pathname = usePathname();

  // RSVP States
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [rsvpApiError, setRsvpApiError] = useState<string | null>(null);

  // Toast States
  const [isToastModalOpen, setIsToastModalOpen] = useState(false);
  const [isToastSubmitted, setIsToastSubmitted] = useState(false);
  const [toastApiError, setToastApiError] = useState<string | null>(null);

  // Lightbox Media Preview State
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Sticky Sidebar Fallback logic
  const asideRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [fixedWidth, setFixedWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (!asideRef.current || !cardRef.current) return;

      const asideRect = asideRef.current.getBoundingClientRect();
      if (window.innerWidth >= 1024 && asideRect.top <= 32) {
        setIsFixed(true);
        setFixedWidth(asideRect.width);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Handle returning from payment redirect
  useEffect(() => {
    const toastParam = searchParams.get("toast");
    const referenceParam =
      searchParams.get("reference") || searchParams.get("trxref");

    if (toastParam === "success" || referenceParam) {
      setIsToastModalOpen(true);
      setIsToastSubmitted(true);

      const updatedParams = new URLSearchParams(searchParams.toString());
      updatedParams.delete("toast");
      updatedParams.delete("reference");
      updatedParams.delete("trxref");

      const newQuery = updatedParams.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams, pathname]);

  // RSVP Form Hook
  const {
    register: registerRsvp,
    handleSubmit: handleSubmitRsvp,
    setValue: setRsvpValue,
    watch: watchRsvp,
    reset: resetRsvp,
    formState: { errors: rsvpErrors, isSubmitting: isRsvpSubmitting },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rsvpStatus: RSVPStatus.GOING,
    },
  });

  const {
    register: registerToast,
    handleSubmit: handleSubmitToast,
    reset: resetToast,
    formState: { errors: toastErrors, isSubmitting: isToastSubmitting },
  } = useForm<ToastFormValues>({
    resolver: zodResolver(toastSchema),
    defaultValues: {
      authorName: "",
      email: "",
      content: "",
      amount: "",
      currency: "NGN",
    },
  });

  const selectedRsvpStatus = watchRsvp("rsvpStatus");

  // Dynamic Border Radius Resolution strictly from event
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
    return defaultBorderRadiusClass || "rounded-xl";
  };

  const activeBorderRadiusClass = getBorderRadiusClass();

  // Custom theme styles extracted directly from event
  const customStyles: React.CSSProperties =
    isCustomTheme && theme
      ? {
          ...(theme.backgroundColor && {
            backgroundColor: theme.backgroundColor,
          }),
          // ...(theme.textColor && { color: theme.textColor }),
          // ...(theme.fontStyle && { fontFamily: theme.fontStyle }),
        }
      : {};

  const primaryButtonStyle: React.CSSProperties =
    isCustomTheme && theme?.primaryColor
      ? { backgroundColor: theme.backgroundColor, color: theme.primaryColor }
      : {};

  const accentTextStyle: React.CSSProperties =
    isCustomTheme && theme?.backgroundColor
      ? { color: theme.backgroundColor }
      : isCustomTheme && theme?.primaryColor
        ? { color: theme.primaryColor }
        : {};

  // RSVP Submit Handler
  const onRsvpSubmit: SubmitHandler<RsvpFormValues> = async (values) => {
    setRsvpApiError(null);
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
      console.error("RSVP Submission Error:", err);
      const errorObj = err as ApiErrorResponse;
      setRsvpApiError(
        errorObj.response?.data?.message ||
          errorObj.message ||
          "Failed to submit RSVP. Please try again.",
      );
    }
  };

  const onToastSubmit: SubmitHandler<ToastFormValues> = async (values) => {
    setToastApiError(null);
    try {
      const parsedAmount = values.amount ? Number(values.amount) : undefined;

      const payload: CreateToastPayload = {
        eventId,
        content: values.content,
        authorName: values.authorName || undefined,
        amount: parsedAmount && parsedAmount > 0 ? parsedAmount : undefined,
        email: values.email || undefined,
        currency:
          parsedAmount && parsedAmount > 0 ? values.currency : undefined,
        callbackUrl: `${window.location.origin}${window.location.pathname}?toast=success`,
      };

      const res = await createToastApi(payload);

      const responseData = res.data?.data;
      if (
        responseData &&
        "paymentId" in responseData &&
        "reference" in responseData &&
        responseData.reference
      ) {
        if (
          "authorizationUrl" in responseData &&
          responseData.authorizationUrl
        ) {
          window.location.href = responseData.authorizationUrl;
          return;
        }

        if (window.PaystackPop) {
          const handler = window.PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
            email: values.email,
            amount: Number(responseData.amount) * 100,
            currency: responseData.currency || values.currency,
            ref: responseData.reference,
            callback: () => {
              setIsToastSubmitted(true);
            },
            onClose: () => {
              setToastApiError("Payment window closed before completion.");
            },
          });
          handler.openIframe();
        } else {
          setIsToastSubmitted(true);
        }
      } else {
        setIsToastSubmitted(true);
      }
    } catch (err: unknown) {
      console.error("Toast Submission Error:", err);
      const errorObj = err as ApiErrorResponse;
      setToastApiError(
        errorObj.response?.data?.message ||
          errorObj.message ||
          "Failed to send toast. Please try again.",
      );
    }
  };

  const handleCloseRsvpModal = (): void => {
    setIsRsvpModalOpen(false);
    setIsRsvpSubmitted(false);
    setRsvpApiError(null);
    resetRsvp();
  };

  const handleCloseToastModal = (): void => {
    setIsToastModalOpen(false);
    setIsToastSubmitted(false);
    setToastApiError(null);
    resetToast();
  };

  return (
    <div
      className="min-h-screen bg-stone-950 text-stone-100 font-serif selection:bg-rose-900 selection:text-white"
    >
      {/* Immersive Hero Header */}
      <section className="relative w-full h-[85vh] max-h-[900px] flex items-center justify-center overflow-hidden bg-stone-900">
        {isCoverVideo && coverImage ? (
          <video
            src={getFileUrl(coverImage)}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
          />
        ) : coverImage ? (
          <img
            src={getFileUrl(coverImage)}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-stone-950/40 to-stone-950" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-stone-800 text-rose-300 text-xs tracking-widest uppercase font-sans backdrop-blur-md">
            <Sparkles
              className="w-3.5 h-3.5 text-rose-400"
              style={accentTextStyle}
            />
            <span style={accentTextStyle}>We Are Getting Married</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-50 leading-[1.15]">
            {name}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm sm:text-base text-stone-300 font-sans pt-2">
            {formattedDate && (
              <span className="flex items-center gap-2">
                <Calendar
                  className="w-4 h-4 text-rose-400"
                  style={accentTextStyle}
                />
                {formattedDate}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-2">
                <MapPin
                  className="w-4 h-4 text-rose-400"
                  style={accentTextStyle}
                />
                {location}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 font-sans relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Story & Gallery */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-4">
              <div
                className="flex items-center gap-2 text-rose-400 font-serif text-sm tracking-widest uppercase"
                style={accentTextStyle}
              >
                <Heart className="w-4 h-4 fill-rose-400/20" />
                <span>Our Story</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-serif text-stone-100"
                style={{
                  color:
                    isCustomTheme && theme?.primaryColor
                      ? theme.primaryColor
                      : undefined,
                }}
              >
                Join Us in Celebrating
              </h2>
              {description ? (
                <div
                  className="prose prose-invert prose-stone max-w-none text-stone-300 leading-relaxed text-base whitespace-pre-line"
                  style={{
                    color:
                      isCustomTheme && theme?.primaryColor
                        ? theme.primaryColor
                        : undefined,
                  }}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className="text-stone-500 italic">
                  Details for this celebration will be updated soon.
                </p>
              )}
            </section>

            {extraMedia.length > 0 && (
              <section className="space-y-6 pt-6 border-t border-stone-800">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-stone-100">
                    Gallery
                  </h3>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">
                    Highlights & Photography
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {extraMedia.map((mediaUrl: string, idx: number) => {
                    const cleanUrl = mediaUrl.split("?")[0];
                    const isVideo = /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(
                      cleanUrl,
                    );
                    const fullUrl = getFileUrl(mediaUrl);

                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedMedia(mediaUrl)}
                        className={`group relative overflow-hidden border border-stone-800 bg-stone-900 aspect-square text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 ${activeBorderRadiusClass}`}
                      >
                        {isVideo ? (
                          <video
                            src={fullUrl}
                            muted
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                          />
                        ) : (
                          <img
                            src={fullUrl}
                            alt={`Gallery item ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}

                        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar CTA Cards */}
          <aside
            ref={asideRef}
            className="lg:col-span-1 relative min-h-[300px]"
          >
            <div
              ref={cardRef}
              style={{
                ...(isFixed && fixedWidth
                  ? {
                      position: "fixed",
                      top: "32px",
                      width: `${fixedWidth}px`,
                      zIndex: 30,
                    }
                  : { position: "relative" }),
              }}
              className={`p-6 bg-stone-900/90 border border-stone-800/80 backdrop-blur-md space-y-6 ${activeBorderRadiusClass}`}
            >
              <div className="space-y-1 border-b border-stone-800 pb-4">
                <span
                  className="text-xs font-semibold text-rose-400 uppercase tracking-widest"
                  style={accentTextStyle}
                >
                  Event Details
                </span>
                <h4 className="text-lg font-serif text-stone-100">
                  RSVP & Actions
                </h4>
              </div>

              <div className="space-y-4 text-sm text-stone-300">
                {formattedDate && (
                  <div className="flex items-start gap-3">
                    <Clock
                      className="w-4 h-4 text-rose-400 shrink-0 mt-0.5"
                      style={accentTextStyle}
                    />
                    <div>
                      <p className="font-medium text-stone-200"  style={{
                  color:
                    isCustomTheme && theme?.primaryColor
                      ? theme.primaryColor
                      : undefined,
                }}>Date & Time</p>
                      <p className="text-xs text-stone-400 mt-0.5" >
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="w-4 h-4 text-rose-400 shrink-0 mt-0.5"
                      style={accentTextStyle}
                    />
                    <div>
                      <p className="font-medium text-stone-200">Venue</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {location}
                      </p>
                    </div>
                  </div>
                )}

                {host && (
                  <div className="flex items-start gap-3 border-t border-stone-800/60 pt-3">
                    <Heart
                      className="w-4 h-4 text-rose-400 shrink-0 mt-0.5"
                      style={accentTextStyle}
                    />
                    <div>
                      <p className="font-medium text-stone-200">Hosted by</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {host.firstName} {host.lastName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => setIsRsvpModalOpen(true)}
                  style={primaryButtonStyle}
                  className="w-full font-sans font-medium bg-rose-600 text-white hover:bg-rose-500 h-11 rounded-lg transition-colors shadow-lg shadow-rose-950/40"
                >
                  <Ticket className="w-4 h-4 mr-2" /> RSVP Now
                </Button>

                <Button
                  onClick={() => setIsToastModalOpen(true)}
                  variant="outline"
                  className="w-full font-sans font-medium border-stone-700 bg-stone-800/50 text-stone-200 hover:bg-stone-800 hover:text-white h-11 rounded-lg transition-colors"
                >
                  <GlassWater
                    className="w-4 h-4 mr-2 text-rose-400"
                    style={accentTextStyle}
                  />{" "}
                  Toast the Couple
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-4xl max-h-[90vh] overflow-hidden border border-stone-800 bg-stone-900/90 shadow-2xl flex items-center justify-center ${activeBorderRadiusClass}`}
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 text-stone-300 hover:text-white bg-stone-950/70 hover:bg-stone-900 rounded-full border border-stone-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(
              selectedMedia.split("?")[0],
            ) ? (
              <video
                src={getFileUrl(selectedMedia)}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] object-contain"
              />
            ) : (
              <img
                src={getFileUrl(selectedMedia)}
                alt="Enlarged gallery view"
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {isRsvpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-md bg-stone-900 border border-stone-800 p-6 shadow-2xl font-sans text-stone-100 ${activeBorderRadiusClass}`}
          >
            <button
              type="button"
              onClick={handleCloseRsvpModal}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isRsvpSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2
                  className="w-14 h-14 text-rose-500 mx-auto animate-bounce"
                  style={accentTextStyle}
                />
                <h3 className="text-2xl font-serif text-stone-100">
                  RSVP Confirmed!
                </h3>
                {selectedRsvpStatus === RSVPStatus.GOING && (
                  <p className="text-emerald-400 text-sm mt-3">
                    Thank you for responding. We look forward to seeing you at
                    our event!
                  </p>
                )}

                {selectedRsvpStatus === RSVPStatus.NOT_GOING && (
                  <p className="text-stone-400 text-sm mt-3">
                    Thank you for letting us know! You’ll be missed, but we
                    appreciate your warm thoughts.
                  </p>
                )}

                {selectedRsvpStatus === RSVPStatus.MAYBE && (
                  <p className="text-amber-400 text-sm mt-3">
                    Thanks for updating your status! We’ve noted your response
                    and hope you can make it.
                  </p>
                )}
                <Button
                  onClick={handleCloseRsvpModal}
                  className="mt-4 bg-stone-800 hover:bg-stone-700 text-stone-200"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-stone-100">
                    Confirm Attendance
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Please provide your details below to RSVP.
                  </p>
                </div>

                {rsvpApiError && (
                  <div className="p-3 text-xs bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg">
                    {rsvpApiError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmitRsvp(onRsvpSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Will you attend?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRsvpValue("rsvpStatus", RSVPStatus.GOING)
                        }
                        style={
                          selectedRsvpStatus === RSVPStatus.GOING
                            ? primaryButtonStyle
                            : {}
                        }
                        className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                          selectedRsvpStatus === RSVPStatus.GOING
                            ? "bg-rose-600 border-rose-500 text-white font-medium"
                            : "bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800"
                        }`}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRsvpValue("rsvpStatus", RSVPStatus.NOT_GOING)
                        }
                        style={
                          selectedRsvpStatus === RSVPStatus.NOT_GOING
                            ? primaryButtonStyle
                            : {}
                        }
                        className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                          selectedRsvpStatus === RSVPStatus.NOT_GOING
                            ? "bg-rose-600 border-rose-500 text-white font-medium"
                            : "bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800"
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Full Name *
                    </label>
                    <input
                      {...registerRsvp("name")}
                      placeholder="Jane Doe"
                      className="w-full h-11 px-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500"
                    />
                    {rsvpErrors.name && (
                      <p className="text-xs text-rose-400">
                        {rsvpErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Email Address
                    </label>
                    <input
                      {...registerRsvp("email")}
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full h-11 px-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500"
                    />
                    {rsvpErrors.email && (
                      <p className="text-xs text-rose-400">
                        {rsvpErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Phone Number
                    </label>
                    <input
                      {...registerRsvp("phone")}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-11 px-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500"
                    />
                    {rsvpErrors.phone && (
                      <p className="text-xs text-rose-400">
                        {rsvpErrors.phone.message}
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-500 italic">
                    * Either Email or Phone number must be filled.
                  </p>

                  <Button
                    type="submit"
                    disabled={isRsvpSubmitting}
                    style={primaryButtonStyle}
                    className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg"
                  >
                    {isRsvpSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Submitting...
                      </>
                    ) : (
                      "Submit RSVP"
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Modal */}
      {isToastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-md bg-stone-900 border border-stone-800 p-6 shadow-2xl font-sans text-stone-100 ${activeBorderRadiusClass}`}
          >
            <button
              type="button"
              onClick={handleCloseToastModal}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isToastSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <GlassWater
                  className="w-14 h-14 text-rose-400 mx-auto animate-bounce"
                  style={accentTextStyle}
                />
                <h3 className="text-2xl font-serif text-stone-100">
                  Toast Sent!
                </h3>
                <p className="text-stone-300 text-sm mt-2">
                  Thank you for your warm wish and contribution to the couple!
                </p>
                <Button
                  onClick={handleCloseToastModal}
                  className="mt-4 bg-stone-800 hover:bg-stone-700 text-stone-200"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div
                    className="flex items-center gap-2 text-rose-400 font-serif text-xs tracking-widest uppercase"
                    style={accentTextStyle}
                  >
                    <GlassWater className="w-4 h-4" />
                    <span>Send a Toast</span>
                  </div>
                  <h3 className="text-2xl font-serif text-stone-100">
                    Celebrate the Couple
                  </h3>
                  <p className="text-xs text-stone-400">
                    Leave a sweet message, with an optional cash gift attached.
                  </p>
                </div>

                {toastApiError && (
                  <div className="p-3 text-xs bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg">
                    {toastApiError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmitToast(onToastSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Your Name
                    </label>
                    <input
                      {...registerToast("authorName")}
                      placeholder="Jane Doe (Optional)"
                      className="w-full h-11 px-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500"
                    />
                    {toastErrors.authorName && (
                      <p className="text-xs text-rose-400">
                        {toastErrors.authorName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Toast Message *
                    </label>
                    <textarea
                      {...registerToast("content")}
                      rows={3}
                      placeholder="Wishing you a lifetime of happiness..."
                      className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500 resize-none"
                    />
                    {toastErrors.content && (
                      <p className="text-xs text-rose-400">
                        {toastErrors.content.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Gift Amount (Optional)
                    </label>
                    <div className="flex gap-2">
                      <select
                        {...registerToast("currency")}
                        className="h-11 px-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500"
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>

                      <input
                        {...registerToast("amount")}
                        type="number"
                        placeholder="0.00"
                        className="w-full h-11 px-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    {toastErrors.amount && (
                      <p className="text-xs text-rose-400">
                        {toastErrors.amount.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-stone-300">
                      Email Address
                    </label>
                    <input
                      {...registerToast("email")}
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full h-11 px-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-rose-500"
                    />
                    {toastErrors.email && (
                      <p className="text-xs text-rose-400">
                        {toastErrors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isToastSubmitting}
                    style={primaryButtonStyle}
                    className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg"
                  >
                    {isToastSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      "Send Toast"
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
