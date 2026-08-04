import * as React from "react";
import { notFound } from "next/navigation";
import { getEventByIdApi } from "@/lib/api/events";
import { EventDetails } from "@/types/response";
import { EventDetailsPage } from "@/components/event/event-details-page";

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function DashboardEventPage({ params }: PageProps) {
  const { eventId } = await params;

  let eventData: EventDetails | null = null;

  try {
    const response = await getEventByIdApi(eventId);
    if (response.data) {
      eventData = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch event by ID:", error);
  }

  if (!eventData) {
    notFound();
  }

  return <EventDetailsPage event={eventData} />;
}
