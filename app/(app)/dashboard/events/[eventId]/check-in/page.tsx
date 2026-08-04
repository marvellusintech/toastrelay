import { notFound } from "next/navigation";
import { getEventByIdApi } from "@/lib/api/events";
import { CheckInClientPage } from "./_components/check-in-client";

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function CheckInPage({ params }: PageProps) {
  const { eventId } = await params;

  let eventName: string | null = null;

  try {
    const response = await getEventByIdApi(eventId);
    if (response.data) {
      eventName = response.data.name;
    }
  } catch {
    // Event fetch failed — we still allow the page to render;
    // the scan endpoint handles its own validation.
  }

  if (!eventName) {
    notFound();
  }

  return <CheckInClientPage eventId={eventId} eventName={eventName} />;
}
