"use client";

import * as React from "react";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventDetails } from "@/types/response";

interface EventPageClientProps {
  event: EventDetails;
}

export default function EventPageClient({ event }: EventPageClientProps) {
  const {
    name,
    description,
    coverImage,
    extraMedia = [],
    startDate,
    location,
    template,
    isCustomTheme,
    theme,
  } = event;

  const templateId = template?.id;

  const formattedDate = startDate
    ? new Date(startDate).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  const isCoverVideo = React.useMemo(() => {
    if (!coverImage) return false;
    const cleanUrl = coverImage.split("?")[0];
    return /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(cleanUrl);
  }, [coverImage]);

  const getBorderRadiusClass = (radius?: string) => {
    switch (radius) {
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
  };

const borderRadiusClass = getBorderRadiusClass(theme?.borderRadius as string | undefined);

  const customStyles = isCustomTheme
    ? ({
        backgroundColor: theme?.backgroundColor || "#ffffff",
        "--primary-color": theme?.primaryColor || "#09090b",
      } as React.CSSProperties)
    : {};

  const renderTemplateLayout = () => {
    switch (templateId) {
      case "tpl_dark":
        return (
          <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800">
            <div className="relative w-full h-[60vh] max-h-[600px] overflow-hidden bg-zinc-900">
              {isCoverVideo && coverImage ? (
                <video
                  src={getFileUrl(coverImage)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-80"
                />
              ) : coverImage ? (
                <img
                  src={getFileUrl(coverImage)}
                  alt={name}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-10 left-0 right-0 max-w-5xl mx-auto px-6 space-y-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Featured Event
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                  {name}
                </h1>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold border-b border-zinc-800 pb-2">
                    About Event
                  </h3>
                  {description ? (
                    <div
                      className="prose prose-invert max-w-none text-zinc-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  ) : (
                    <p className="text-zinc-500 italic">No description provided.</p>
                  )}
                </div>

                {extraMedia.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold border-b border-zinc-800 pb-2">
                      Gallery
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {extraMedia.map((mediaUrl, idx) => (
                        <div
                          key={idx}
                          className={`overflow-hidden border border-zinc-800 aspect-square bg-zinc-900 ${borderRadiusClass}`}
                        >
                          <img
                            src={getFileUrl(mediaUrl)}
                            alt="Gallery Item"
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div
                  className={`p-6 bg-zinc-900 border border-zinc-800 space-y-6 ${borderRadiusClass}`}
                >
                  <div className="space-y-3 text-sm text-zinc-400">
                    {formattedDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-zinc-200" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                    {location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-zinc-200" />
                        <span>{location}</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full font-semibold bg-white text-zinc-950 hover:bg-zinc-200 h-12">
                    <Ticket className="w-4 h-4 mr-2" /> Get Tickets
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "tpl_minimal":
      default:
        return (
          <div
            className="min-h-screen bg-white text-zinc-900 font-sans"
            style={customStyles}
          >
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
              <div className="space-y-4 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
                  {name}
                </h1>
                <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
                  {formattedDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formattedDate}
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

              {coverImage && (
                <div
                  className={`w-full h-[400px] overflow-hidden shadow-sm border bg-zinc-100 ${borderRadiusClass}`}
                >
                  {isCoverVideo ? (
                    <video
                      src={getFileUrl(coverImage)}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getFileUrl(coverImage)}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-zinc-900">
                      Description
                    </h3>
                    {description ? (
                      <div
                        className="prose max-w-none text-zinc-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    ) : (
                      <p className="text-zinc-400 italic">No description provided.</p>
                    )}
                  </div>

                  {extraMedia.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-zinc-900">
                        Event Gallery
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {extraMedia.map((mediaUrl, idx) => (
                          <div
                            key={idx}
                            className={`overflow-hidden border aspect-square bg-zinc-50 ${borderRadiusClass}`}
                          >
                            <img
                              src={getFileUrl(mediaUrl)}
                              alt="Gallery Item"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div
                    className={`p-6 border bg-zinc-50 space-y-6 sticky top-6 ${borderRadiusClass}`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Admission
                      </span>
                      <p className="text-2xl font-bold text-zinc-900 mt-1">
                        Free / Paid
                      </p>
                    </div>
                    <Button
                      className="w-full font-semibold text-white h-11"
                      style={{
                        backgroundColor: isCustomTheme
                          ? theme?.primaryColor
                          : "#09090b",
                      }}
                    >
                      <Ticket className="w-4 h-4 mr-2" /> Register Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return <div className="w-full">{renderTemplateLayout()}</div>;
}