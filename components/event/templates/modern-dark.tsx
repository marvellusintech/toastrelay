import React from "react";
import { EventTemplateProps } from "./type";
import { Calendar, MapPin } from "lucide-react";

export function ModernDarkTemplate({
  event,
  activeTab,
  setActiveTab,
  children,
}: EventTemplateProps) {
  // Pull theme variables based on the custom toggle state
  const activeTheme = event.isCustomTheme ? event.theme : event.template.theme;

  const primaryColor = (activeTheme?.primaryColor as string) || "#22d3ee";
  const bgColor = (activeTheme?.backgroundColor as string) || "#000000";
  const fontFamily = (activeTheme?.fontFamily as string) || "inherit";

  return (
    <div
      className="min-h-screen text-white selection:bg-[var(--theme-primary)]/20 transition-colors duration-300"
      style={
        {
          backgroundColor: bgColor,
          fontFamily: fontFamily,
          "--theme-primary": primaryColor,
        } as React.CSSProperties
      }
    >
      {/* Banner Backdrop */}
      <div className="relative h-[80vh] flex items-end p-8 md:p-24 overflow-hidden">
        {event.coverImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={event.coverImage}
              alt={event.name}
              className="w-full h-full object-cover opacity-60 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-4xl space-y-6">
          <span
            className="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-black"
            style={{ backgroundColor: primaryColor }}
          >
            {event.eventType.name}
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            {event.name}
          </h1>
          {event.description && (
            <p className="text-white/60 text-lg max-w-xl font-light">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-widest text-white/80 pt-4">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
              {new Date(event.startDate).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </span>
            {event.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Header */}
      <div className="sticky top-0 z-50 bg-black backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-4">
          {(["toasts", "moments", "thread"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "text-black font-black"
                    : "text-white/40 hover:text-white"
                }`}
                style={isActive ? { backgroundColor: primaryColor } : {}}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Container */}
      <main className="max-w-7xl mx-auto px-6 py-16" >{children}</main>
    </div>
  );
}
