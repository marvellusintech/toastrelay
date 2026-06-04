"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useEvent } from "@/hooks/use-event-queries";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ThreadView } from "@/components/event/thread-view";
import { mockEventDetails, mockCurrentUser } from "@/lib/mock_data";

// Import your Structural Layout Components
import { ModernDarkTemplate } from "@/components/event/templates/modern-dark";
import { EventTemplateProps } from "@/components/event/templates/type";


// 1. Strict mapping definition using your template key IDs
const TEMPLATE_MAP: Record<string, React.ComponentType<EventTemplateProps>> = {
  "modern-dark": ModernDarkTemplate,
  // "minimal-light": MinimalLightTemplate, 🔥 Easily scalable!
};

export default function EventPage() {
  // const { id } = useParams() as { id: string };
  // const { data: eventData, isLoading, error } = useEvent(id); // Returns EventDetails type
  // const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"toasts" | "moments" | "thread">("toasts");

  // if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Stage™...</div>;
  // if (error || !eventData) return <div className="min-h-screen bg-black flex items-center justify-center text-red-400">Stage unavailable.</div>;

  // 2. Safely look up chosen template by ID or string slug name configuration
  const eventData = mockEventDetails;
  const user = mockCurrentUser;
  const SelectedTemplate = TEMPLATE_MAP[eventData.template.id] || ModernDarkTemplate;

  return (
    <SelectedTemplate 
      event={eventData} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {/* 3. Centralized child content rendering */}
      {activeTab === "thread" && (
        eventData.thread ? (
          <ThreadView
            thread={eventData.thread}
            user={user}
            hasAccess={eventData.thread.accessType?.id !== "acc_circle_only" || 
    eventData.circles.some(eventCircle => 
      eventData.thread?.allowedCircles.some(allowed => allowed.id === eventCircle.id)
    )}
            onPurchase={(item) => console.log("Initiating purchase for ID:", item.id)}
          />
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold">No Threads Yet</h3>
          </div>
        )
      )}

      {activeTab === "toasts" && (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-xs uppercase tracking-widest">Toasts Component Area</p>
        </div>
      )}

      {activeTab === "moments" && (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-xs uppercase tracking-widest">Moments Component Area</p>
        </div>
      )}
    </SelectedTemplate>
  );
}