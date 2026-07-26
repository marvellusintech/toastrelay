import * as React from "react";
import { notFound } from "next/navigation";
import { getEventBySlugApi, recordEventViewApi } from "@/lib/api/events";
import { EventDetails } from "@/types/response";
import EventPageClient from "@/components/event/eventPageClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;

  let eventData: EventDetails | null = null;

  try {
    const response = await getEventBySlugApi(slug);
    if (response.data) {
      eventData = response.data;
      
      // Fire-and-forget or await depending on whether you want to block rendering
      recordEventViewApi(eventData.id).catch((err) =>
        console.error("Failed to record event view:", err)
      );
    }
  } catch (error) {
    console.error("Failed to fetch event by slug:", error);
  }

  if (!eventData) {
    notFound();
  }

  return <EventPageClient event={eventData} />;
}