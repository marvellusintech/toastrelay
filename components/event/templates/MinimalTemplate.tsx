// @/components/templates/MinimalTemplate.tsx
"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { TemplateProps } from "./types";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  Users,
  Globe,
  Loader2,
  X,
  ZoomIn,
  CheckCircle2,
  MessageCircle,
  Image as ImageIcon,
  ExternalLink,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RSVPStatus } from "@/types/enum";
import { submitRsvpApi, createToastApi } from "@/lib/api/events";
import TicketPurchaseModal from "@/components/event/TicketPurchaseModal";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitRsvpPayload, CreateToastPayload } from "@/types/payload";

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
      { message: "Please select your attendance status" },
    ),
  })
  .refine(
    (data) =>
      Boolean(data.email && data.email.trim() !== "") ||
      Boolean(data.phone && data.phone.trim() !== ""),
    { message: "Either Email or Phone number must be provided", path: ["email"] },
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
    { message: "Email is required when making a monetary toast", path: ["email"] },
  );

type ToastFormValues = z.infer<typeof toastSchema>;

interface ApiErrorResponse {
  response?: { data?: { message?: string } };
  message?: string;
}

function formatEventTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatEndDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isVideoUrl(url: string): boolean {
  const clean = url.split("?")[0];
  return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(clean);
}

function useMounted(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function MinimalTemplate({
  event,
  formattedDate,
  isCoverVideo,
  borderRadiusClass,
  customStyles,
}: TemplateProps) {
  const {
    id: eventId,
    name,
    description,
    coverImage,
    extraMedia = [],
    location,
    host,
    eventType,
    toasts = [],
    moments = [],
    ticketEvent,
    attendanceCount,
    format,
    onlineUrl,
    isExternal,
    externalUrl,
    allowRsvp,
    allowMoments,
    allowToasts,
    currency,
    startDate: eventStartDate,
    endDate: eventEndDate,
    isCustomTheme,
    theme,
    _count,
  } = event;

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const mounted = useMounted();

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isRsvpSubmitted, setIsRsvpSubmitted] = useState(false);
  const [rsvpApiError, setRsvpApiError] = useState<string | null>(null);
  const [isToastModalOpen, setIsToastModalOpen] = useState(false);
  const [isToastSubmitted, setIsToastSubmitted] = useState(false);
  const [toastApiError, setToastApiError] = useState<string | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isTicketSuccess, setIsTicketSuccess] = useState(false);

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

  useEffect(() => {
    const toastParam = searchParams.get("toast");
    const referenceParam =
      searchParams.get("reference") || searchParams.get("trxref");
    if (toastParam === "success") {
      setIsToastModalOpen(true);
      setIsToastSubmitted(true);
    } else if (referenceParam) {
      // Returned from a ticket payment redirect.
      setIsTicketSuccess(true);
      setIsTicketModalOpen(true);
    }

    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.delete("toast");
    updatedParams.delete("reference");
    updatedParams.delete("trxref");
    const newQuery = updatedParams.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
    window.history.replaceState(null, "", newUrl);
  }, [searchParams, pathname]);

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

  const {
    register: registerToast,
    handleSubmit: handleSubmitToast,
    reset: resetToast,
    formState: { errors: toastErrors, isSubmitting: isToastSubmitting },
  } = useForm<ToastFormValues>({
    resolver: zodResolver(toastSchema),
    defaultValues: { authorName: "", email: "", content: "", amount: "", currency: "NGN" },
  });

  const selectedRsvpStatus = watchRsvp("rsvpStatus");

  const primaryButtonStyle: React.CSSProperties =
    isCustomTheme && theme?.primaryColor
      ? { backgroundColor: theme.primaryColor, color: "#fff" }
      : {};

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
      const errorObj = err as ApiErrorResponse;
      setRsvpApiError(
        errorObj.response?.data?.message || errorObj.message || "Failed to submit RSVP.",
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
        currency: parsedAmount && parsedAmount > 0 ? values.currency : undefined,
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
        if ("authorizationUrl" in responseData && responseData.authorizationUrl) {
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
            callback: () => { setIsToastSubmitted(true); },
            onClose: () => { setToastApiError("Payment window closed before completion."); },
          });
          handler.openIframe();
        } else {
          setIsToastSubmitted(true);
        }
      } else {
        setIsToastSubmitted(true);
      }
    } catch (err: unknown) {
      const errorObj = err as ApiErrorResponse;
      setToastApiError(
        errorObj.response?.data?.message || errorObj.message || "Failed to send toast.",
      );
    }
  };

  const handleCloseRsvpModal = () => {
    setIsRsvpModalOpen(false);
    setIsRsvpSubmitted(false);
    setRsvpApiError(null);
    resetRsvp();
  };

  const handleCloseToastModal = () => {
    setIsToastModalOpen(false);
    setIsToastSubmitted(false);
    setToastApiError(null);
    resetToast();
  };

  const approvedMoments = moments.filter((m) => m.status === "APPROVED");

  const formatLabel = (() => {
    switch (format) {
      case "ONLINE":
        return "Online Event";
      case "HYBRID":
        return "Hybrid Event";
      case "PHYSICAL":
      default:
        return null;
    }
  })();

  return (
    <div
      className="min-h-screen px-4 xl:px-0 bg-white text-zinc-900 font-sans"
      style={customStyles}
    >
      <div className=" xl:px-20 pt-10">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="w-5 h-5"
                viewBox="0 0 859 867"
              >
                <path
                  fillRule="evenodd"
                  fill="rgb(255, 255, 255)"
                  d="M854.363,351.300 C680.101,355.561 548.211,457.780 427.319,322.050 C402.012,293.638 377.681,239.638 390.269,175.802 C398.068,117.308 405.870,58.797 413.669,0.304 C484.138,-1.459 592.187,13.495 624.266,47.103 C618.961,78.902 584.713,107.709 567.717,130.952 C528.071,186.196 488.414,241.456 448.768,296.700 C447.747,316.248 448.193,321.888 456.568,333.750 C459.818,335.050 463.069,336.350 466.318,337.650 C500.673,346.151 529.644,302.240 550.167,286.950 C614.510,238.206 678.872,189.447 743.215,140.702 C789.641,167.166 850.305,282.178 854.363,351.300 ZM0.274,386.399 C-1.107,323.152 24.620,264.236 49.023,222.601 C51.623,222.601 54.223,222.601 56.823,222.601 C77.616,241.093 222.695,350.461 245.971,341.550 C251.170,337.000 256.371,332.449 261.571,327.900 C261.681,250.434 147.663,192.355 127.022,127.052 C159.315,80.573 226.799,38.978 288.870,23.704 C297.948,177.379 362.861,288.632 230.371,374.699 C203.076,392.430 154.519,412.337 101.673,401.999 C67.876,396.799 34.070,391.599 0.274,386.399 ZM858.263,495.598 C855.444,583.542 803.896,660.524 760.765,712.045 C758.165,712.045 755.564,712.045 752.965,712.045 C696.122,665.061 632.989,622.941 569.667,583.347 C540.519,565.121 517.520,524.801 474.118,522.897 C466.969,529.397 459.818,535.898 452.668,542.397 C452.836,577.821 576.891,727.539 602.817,758.845 C615.815,773.793 628.818,788.746 641.816,803.694 C637.931,786.479 612.551,867.709 429.269,866.093 C418.870,802.400 408.468,738.688 398.069,674.996 C387.879,622.798 407.871,576.893 425.369,550.197 C520.457,405.124 683.008,494.275 858.263,495.598 ZM0.274,491.698 C51.396,484.284 83.940,479.539 121.172,472.198 C160.738,464.397 194.820,480.403 218.671,489.748 C356.626,543.796 322.770,692.952 304.470,846.593 C302.520,846.593 300.570,846.593 298.620,846.593 C255.370,832.310 146.798,786.985 138.722,745.195 C179.668,689.301 220.625,633.390 261.571,577.497 C273.836,558.450 267.778,534.293 247.921,526.797 C212.556,513.448 103.357,647.451 66.573,655.496 C43.101,660.629 1.041,527.652 0.274,491.698 Z"
                />
              </svg>
            </div>

            <span className="tracking-tighter font-display font-bold text-xl uppercase">
              Toastrelay
            </span>
          </div>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="pt-10 lg:pt-20 max-w-4xl mx-auto">
        {coverImage && (
          <div
            className={`relative overflow-hidden shadow-2xl shadow-black/5 ${borderRadiusClass}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            {isCoverVideo ? (
              <video
                src={getFileUrl(coverImage)}
                className="w-full h-[400px] object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={getFileUrl(coverImage)}
                alt={name}
                className="w-full h-[400px] object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 md:p-12 z-20">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {eventType?.name && (
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider">
                    {eventType.name}
                  </span>
                )}
                {formatLabel && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider">
                    <Globe className="w-3 h-3" />
                    {formatLabel}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight text-white leading-none">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/80">
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                  </span>
                )}
                {mounted && eventStartDate && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatEventTime(eventStartDate)}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="px-4 lg:px-6 py-12 space-y-10">
          {!coverImage && (
            <div className="space-y-4 text-center max-w-2xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {eventType?.name && (
                  <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
                    {eventType.name}
                  </span>
                )}
                {formatLabel && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold uppercase tracking-wider">
                    <Globe className="w-3 h-3" />
                    {formatLabel}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-zinc-900">
                {name}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
                {formattedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                  </span>
                )}
                {mounted && eventStartDate && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatEventTime(eventStartDate)}
                    {eventEndDate && <> — {formatEventTime(eventEndDate)}</>}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </span>
                )}
              </div>
              {host && (
                <p className="text-sm text-zinc-500">
                  Hosted by{" "}
                  <span className="font-medium text-zinc-700">
                    {host.firstName} {host.lastName}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900">Description</h3>
              {description ? (
                <div
                  className="prose max-w-none text-zinc-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className="text-zinc-400 italic">No description provided.</p>
              )}
            </div>

            {/* Online URL */}
            {format !== "PHYSICAL" && onlineUrl && (
              <div className="p-4 border border-zinc-200 rounded-lg bg-zinc-50">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Join Online
                </p>
                <a
                  href={onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  {onlineUrl}
                </a>
              </div>
            )}



            {/* Moments Gallery */}
            {approvedMoments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Moments
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {approvedMoments.map((moment) => (
                    <button
                      type="button"
                      key={moment.id}
                      onClick={() => setSelectedMedia(moment.imageUrl)}
                      className={`group relative overflow-hidden border aspect-square bg-zinc-50 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 ${borderRadiusClass}`}
                    >
                      {isVideoUrl(moment.imageUrl) ? (
                        <video
                          src={getFileUrl(moment.imageUrl)}
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={getFileUrl(moment.imageUrl)}
                          alt={moment.caption || "Moment"}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Media Gallery */}
            {extraMedia.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900">
                  Event Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {extraMedia.map((mediaUrl, idx) => {
                    const fullUrl = getFileUrl(mediaUrl);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedMedia(mediaUrl)}
                        className={`group relative overflow-hidden border aspect-square bg-zinc-50 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400 ${borderRadiusClass}`}
                      >
                        {isVideoUrl(mediaUrl) ? (
                          <div className="relative w-full h-full">
                            <video
                              src={fullUrl}
                              muted
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Video className="w-8 h-8 text-white drop-shadow" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={fullUrl}
                            alt={`Gallery Item ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Toasts */}
            {allowToasts && toasts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Toasts
                </h3>
                <div className="space-y-3">
                  {toasts.map((toast) => (
                    <div
                      key={toast.id}
                      className={`p-4 border border-zinc-100 bg-zinc-50 ${borderRadiusClass}`}
                    >
                      <p className="text-sm text-zinc-700 leading-relaxed">
                        {toast.content}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100">
                        <span className="text-xs text-zinc-400">
                          {toast.author
                            ? `${toast.author.firstName} ${toast.author.lastName}`
                            : "Anonymous"}
                        </span>
                        {toast.amount != null && Number(toast.amount) > 0 && (
                          <span className="text-xs font-semibold text-green-600">
                            {currency === "USD" ? "$" : "₦"}
                            {Number(toast.amount).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div>
            <div
              ref={asideRef}
              className="relative min-h-[200px]"
            >
              <div
                ref={cardRef}
                style={
                  isFixed && fixedWidth
                    ? { position: "fixed", top: "32px", width: `${fixedWidth}px`, zIndex: 30 }
                    : { position: "relative" }
                }
                className={`p-6 border bg-zinc-50 space-y-6 sticky top-6 ${borderRadiusClass}`}
              >
                {/* Date & Time */}
                {formattedDate && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Date &amp; Time
                      </p>
                      <p className="text-sm font-medium text-zinc-700 mt-0.5">
                        {formattedDate}
                      </p>
                      {mounted && eventStartDate && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {formatEventTime(eventStartDate)}
                       
                        </p>
                      )}
                      {mounted && eventEndDate && (
                        <p className="text-xs  text-zinc-400 mt-0.5">
                          Ends <br/> <span className="font-medium text-zinc-700 text-sm">{formatEndDate(eventEndDate)}   {eventEndDate && <span className="font-normal text-zinc-500 text-xs"> <br/> {formatEventTime(eventEndDate)}</span>}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Location */}
                {location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Venue
                      </p>
                      <p className="text-sm font-medium text-zinc-700 mt-0.5">
                        {location}
                      </p>
                    </div>
                  </div>
                )}

                {/* Host */}
                {host && (
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Hosted by
                      </p>
                      <p className="text-sm font-medium text-zinc-700 mt-0.5">
                        {host.firstName} {host.lastName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Attendance */}
                {attendanceCount != null && attendanceCount > 0 && (
                  <div className="text-xs text-zinc-500">
                    <Users className="w-3.5 h-3.5 inline mr-1" />
                    {attendanceCount} attending
                  </div>
                )}

                {/* Ticket Info */}
                {!isExternal && (ticketEvent && ticketEvent.tiers.length > 0 ? (
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Tickets
                    </span>
                    <div className="space-y-2">
                      {ticketEvent.tiers.map((tier) => {
                        const isFree = tier.price === 0;
                        return (
                          <div
                            key={tier.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div>
                              <p className="font-medium text-zinc-900">{tier.name}</p>
                              <p className="text-xs text-zinc-400">
                                {tier.capacity - tier.sold > 0
                                  ? `${Math.max(tier.capacity - tier.sold, 0)} left`
                                  : "Sold out"}
                              </p>
                            </div>
                            <span
                              className={`font-bold ${
                                isFree ? "text-green-600" : "text-zinc-900"
                              }`}
                            >
                              {isFree ? "Free" : `${currency === "USD" ? "$" : "₦"}${tier.price.toLocaleString()}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Admission
                    </span>
                    <p className="text-2xl font-bold text-zinc-900 mt-1">
                      Free
                    </p>
                  </div>
                ))}

                {/* Actions */}
                <div className="space-y-3">
                  {isExternal && externalUrl ? (
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-400 italic text-center">
                        This event continues on an external website.
                      </p>
                      <Button
                        className="w-full font-semibold text-white h-11"
                        variant="secondary"
                        style={primaryButtonStyle}
                        onClick={() => window.open(externalUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" /> Continue
                      </Button>
                    </div>
                  ) : (
                    <Button
                    variant="secondary"
                      className="w-full font-semibold text-white h-11"
                      style={primaryButtonStyle}
                      onClick={() => setIsTicketModalOpen(true)}
                    >
                      <Ticket className="w-4 h-4 mr-2" /> Register Now
                    </Button>
                  )}

                  {allowRsvp && (
                    <Button
                      variant="outline"
                      className="w-full font-semibold h-11"
                      onClick={() => setIsRsvpModalOpen(true)}
                    >
                      RSVP
                    </Button>
                  )}

                  {allowToasts && (
                    <Button
                      variant="outline"
                      className="w-full font-semibold h-11"
                      onClick={() => setIsToastModalOpen(true)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> Send Toast
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedMedia && (
        <div
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl flex items-center justify-center ${borderRadiusClass}`}
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 text-zinc-500 hover:text-zinc-900 bg-white/80 hover:bg-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {isVideoUrl(selectedMedia) ? (
              <video
                src={getFileUrl(selectedMedia)}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] object-contain"
              />
            ) : (
              <img
                src={getFileUrl(selectedMedia)}
                alt="Enlarged view"
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {isRsvpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`relative w-full max-w-md bg-white border p-6 shadow-2xl ${borderRadiusClass}`}
          >
            <button
              type="button"
              onClick={handleCloseRsvpModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isRsvpSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
                <h3 className="text-2xl font-display font-bold text-zinc-900">
                  RSVP Confirmed!
                </h3>
                {selectedRsvpStatus === RSVPStatus.GOING && (
                  <p className="text-green-600 text-sm">
                    Thank you! We look forward to seeing you.
                  </p>
                )}
                {selectedRsvpStatus === RSVPStatus.NOT_GOING && (
                  <p className="text-zinc-500 text-sm">
                    Thank you for letting us know. You&apos;ll be missed!
                  </p>
                )}
                {selectedRsvpStatus === RSVPStatus.MAYBE && (
                  <p className="text-amber-600 text-sm">
                    Thanks! We hope you can make it.
                  </p>
                )}
                <Button
                  onClick={handleCloseRsvpModal}
                  className="mt-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-zinc-900">
                    RSVP
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Let the host know if you&apos;re coming.
                  </p>
                </div>

                {rsvpApiError && (
                  <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {rsvpApiError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmitRsvp(onRsvpSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Will you attend?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { status: RSVPStatus.GOING, label: "Going" },
                        { status: RSVPStatus.NOT_GOING, label: "Can't Go" },
                        { status: RSVPStatus.MAYBE, label: "Maybe" },
                      ].map(({ status, label }) => (
                        <button
                          type="button"
                          key={status}
                          onClick={() => setRsvpValue("rsvpStatus", status as RsvpFormValues["rsvpStatus"])}
                          className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                            selectedRsvpStatus === status
                              ? "bg-zinc-900 border-zinc-900 text-white font-medium"
                              : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Full Name *
                    </label>
                    <input
                      {...registerRsvp("name")}
                      placeholder="Jane Doe"
                      className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                    />
                    {rsvpErrors.name && (
                      <p className="text-xs text-red-500">{rsvpErrors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Email Address
                    </label>
                    <input
                      {...registerRsvp("email")}
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                    />
                    {rsvpErrors.email && (
                      <p className="text-xs text-red-500">{rsvpErrors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Phone Number
                    </label>
                    <input
                      {...registerRsvp("phone")}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                    />
                    {rsvpErrors.phone && (
                      <p className="text-xs text-red-500">{rsvpErrors.phone.message}</p>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 italic">
                    * Either Email or Phone number must be filled.
                  </p>

                  <Button
                    type="submit"
                    disabled={isRsvpSubmitting}
                    style={primaryButtonStyle}
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg"
                  >
                    {isRsvpSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`relative w-full max-w-md bg-white border p-6 shadow-2xl ${borderRadiusClass}`}
          >
            <button
              type="button"
              onClick={handleCloseToastModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isToastSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
                <h3 className="text-2xl font-display font-bold text-zinc-900">
                  Toast Sent!
                </h3>
                <p className="text-zinc-500 text-sm">
                  Your toast has been sent. Thank you for the love!
                </p>
                <Button
                  onClick={handleCloseToastModal}
                  className="mt-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-zinc-900">
                    Send a Toast
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Leave a sweet message with an optional cash gift.
                  </p>
                </div>

                {toastApiError && (
                  <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {toastApiError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmitToast(onToastSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Your Name
                    </label>
                    <input
                      {...registerToast("authorName")}
                      placeholder="Jane Doe (Optional)"
                      className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                    />
                    {toastErrors.authorName && (
                      <p className="text-xs text-red-500">{toastErrors.authorName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Toast Message *
                    </label>
                    <textarea
                      {...registerToast("content")}
                      rows={3}
                      placeholder="Wishing you all the best..."
                      className="w-full p-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-400 resize-none"
                    />
                    {toastErrors.content && (
                      <p className="text-xs text-red-500">{toastErrors.content.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Gift Amount (Optional)
                    </label>
                    <div className="flex gap-2">
                      <select
                        {...registerToast("currency")}
                        className="h-11 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none"
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                      <input
                        {...registerToast("amount")}
                        type="number"
                        placeholder="0.00"
                        className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    {toastErrors.amount && (
                      <p className="text-xs text-red-500">{toastErrors.amount.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-zinc-500">
                      Email Address
                    </label>
                    <input
                      {...registerToast("email")}
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:border-zinc-400"
                    />
                    {toastErrors.email && (
                      <p className="text-xs text-red-500">{toastErrors.email.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isToastSubmitting}
                    style={primaryButtonStyle}
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg"
                  >
                    {isToastSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
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
      {/* Ticket Purchase Modal */}
      {ticketEvent && ticketEvent.tiers.length > 0 && (
        <TicketPurchaseModal
          open={isTicketModalOpen}
          onOpenChange={setIsTicketModalOpen}
          tiers={ticketEvent.tiers}
          currency={currency}
          eventId={eventId}
          eventName={name}
          slug={event.slug}
          success={isTicketSuccess}
        />
      )}
    </div>
  );
}
