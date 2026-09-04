// app/(dashboard)/events/[eventId]/setup/_components/step-review.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { type WizardFormValues } from "@/validations/event.schema";
import { Button } from "@/components/ui/button";
import { publishEventApi } from "@/lib/api/events";
import { getTemplateComponent } from "@/components/event/templates";
import type { EventDetails } from "@/types/response";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import { ArrowLeft } from "lucide-react";

function isVideoUrl(url: string): boolean {
  const clean = url.split("?")[0];
  return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(clean);
}

function buildPreviewEvent(values: WizardFormValues, eventData: EventDetails): EventDetails {
  const isCoverVideo = values.coverImage ? isVideoUrl(values.coverImage) : false;
  const borderRadius = values.theme?.borderRadius || "md";

  return {
    ...eventData,
    name: values.name || eventData.name,
    description: values.description || eventData.description,
    coverImage: values.coverImage || eventData.coverImage,
    extraMedia: values.extraMedia ?? eventData.extraMedia ?? [],
    startDate: values.startDate || eventData.startDate,
    endDate: values.endDate || eventData.endDate,
    location: values.location || eventData.location,
    isExternal: values.isExternal,
    externalUrl: values.externalUrl || eventData.externalUrl,
    format: values.format || eventData.format,
    onlineUrl: values.onlineUrl || eventData.onlineUrl,
    allowRsvp: values.allowRsvp,
    allowMoments: values.allowMoments,
    allowToasts: values.allowToasts,
    eventTypeId: values.eventTypeId || eventData.eventTypeId,
    templateId: values.templateId || eventData.templateId,
    isCustomTheme: values.isCustomTheme,
    theme: values.isCustomTheme
      ? {
          primaryColor: values.theme?.primaryColor || eventData.theme?.primaryColor || "#09090b",
          backgroundColor: values.theme?.backgroundColor || eventData.theme?.backgroundColor || "#ffffff",
          borderRadius: values.theme?.borderRadius || "md",
        }
      : eventData.theme,
    host: eventData.host,
    eventType: eventData.eventType,
    toasts: eventData.toasts ?? [],
    moments: eventData.moments ?? [],
    ticketEvent: eventData.ticketEvent,
    attendanceCount: eventData.attendanceCount,
    guests: eventData.guests ?? [],
    circles: eventData.circles ?? [],
    attendance: eventData.attendance ?? [],
    thread: eventData.thread,
    status: eventData.status,
    slug: values.slug || eventData.slug,
    createdAt: eventData.createdAt,
    updatedAt: eventData.updatedAt,
    isPublic: values.isPublic,
    currency: eventData.currency,
    claimStatus: eventData.claimStatus,
    createdByUserId: eventData.createdByUserId,
    hostId: eventData.hostId,
    _count: eventData._count ?? { guests: 0, views: 0 },
  } as EventDetails;
}

export function StepReview({ eventId, eventData }: { eventId: string; eventData: EventDetails }) {
  const router = useRouter();
  const { getValues } = useFormContext<WizardFormValues>();
  const [publishing, setPublishing] = useState(false);

  const values = getValues();
  const previewEvent = buildPreviewEvent(values, eventData);

  const TemplateComponent = getTemplateComponent(values.templateId);

  const formattedDate = previewEvent.startDate
    ? new Date(previewEvent.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  const isCoverVideo = previewEvent.coverImage
    ? isVideoUrl(previewEvent.coverImage)
    : false;

  const borderRadius = values.theme?.borderRadius || "md";
  const borderRadiusClass = (() => {
    switch (borderRadius) {
      case "none": return "rounded-none";
      case "sm": return "rounded-sm";
      case "lg": return "rounded-2xl";
      case "full": return "rounded-full";
      default: return "rounded-lg";
    }
  })();

  const customStyles: React.CSSProperties =
    values.isCustomTheme && values.theme
      ? ({
          backgroundColor: values.theme.backgroundColor || "#ffffff",
          "--primary-color": values.theme.primaryColor || "#09090b",
        } as React.CSSProperties)
      : {};

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await publishEventApi(eventId);
      router.push(`/dashboard/events/${eventId}`);
      router.refresh();
    } catch (error) {
      console.error("Publish error:", error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Preview & Launch</h2>
        <p className="text-sm text-zinc-500">
          This is how your event will appear to guests. Review it below, then publish when ready.
        </p>
      </div>

      {/* Preview Container */}
      <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-300" />
            <div className="w-3 h-3 rounded-full bg-zinc-300" />
            <div className="w-3 h-3 rounded-full bg-zinc-300" />
          </div>
          <span className="text-xs text-zinc-400 font-mono ml-2">
            {`toastrelay.com/events/${values.slug || "event-preview"}`}
          </span>
        </div>
        <div className="max-h-[600px] overflow-y-auto px-2">
          {React.createElement(TemplateComponent, {
            event: previewEvent,
            formattedDate,
            isCoverVideo,
            borderRadiusClass,
            customStyles,
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          disabled={publishing}
          onClick={() => router.push("?step=contributions")}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="button"
          disabled={publishing}
          onClick={handlePublish}
          variant="secondary"
          className="flex-1 lg:flex-initial"
        >
          {publishing ? "Publishing..." : "Publish Event Live"}
        </Button>
      </div>
    </div>
  );
}
