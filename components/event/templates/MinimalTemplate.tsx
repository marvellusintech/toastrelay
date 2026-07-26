// @/components/templates/MinimalTemplate.tsx
"use client";

import * as React from "react";
import { TemplateProps } from "./types";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MinimalTemplate({
  event,
  formattedDate,
  isCoverVideo,
  borderRadiusClass,
  customStyles,
}: TemplateProps) {
  const { name, description, coverImage, extraMedia = [], location, isCustomTheme, theme } = event;

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

            {extraMedia.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-zinc-900">Event Gallery</h3>
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
                <p className="text-2xl font-bold text-zinc-900 mt-1">Free / Paid</p>
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