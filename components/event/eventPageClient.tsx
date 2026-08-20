// @/components/eventPageClient.tsx
"use client";

import * as React from "react";
import { EventDetails } from "@/types/response";
import { getTemplateComponent } from "@/components/event/templates";
import {Footer} from "../layouts/footer";
;

interface EventPageClientProps {
  event: EventDetails;
}

export default function EventPageClient({ event }: EventPageClientProps) {
  const { coverImage, startDate, templateId, isCustomTheme, theme } = event;

  const formattedDate = React.useMemo(() => {
    return startDate
      ? new Date(startDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;
  }, [startDate]);

  const isCoverVideo = React.useMemo(() => {
    if (!coverImage) return false;
    const cleanUrl = coverImage.split("?")[0];
    return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(cleanUrl);
  }, [coverImage]);

  const borderRadiusClass = React.useMemo(() => {
    switch (theme?.borderRadius) {
      case "none":
        return "rounded-none";
      case "sm":
        return "rounded-sm";
      case "lg":
        return "rounded-2xl";
      case "full":
        return "rounded-full";
      default:
        return "rounded-lg";
    }
  }, [theme?.borderRadius]);

  const customStyles = React.useMemo<React.CSSProperties>(() => {
    if (!isCustomTheme) return {};
    return {
      backgroundColor: theme?.backgroundColor || "#ffffff",
      "--primary-color": theme?.primaryColor || "#09090b",
    };
  }, [isCustomTheme, theme]);

  // Retrieve the component reference
  const TemplateComponent = getTemplateComponent(templateId);

  return (
    <>
      {React.createElement(TemplateComponent, {
        event,
        formattedDate,
        isCoverVideo,
        borderRadiusClass,
        customStyles,
      })}
      <div className="relative z-[999]">
        <Footer />
      </div>
    </>
  );
}