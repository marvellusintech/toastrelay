import { Calendar, MapPin, Radio, Ticket } from "lucide-react";
import Link from "next/link";

import type { EventStage } from "@/lib/types/events";
import { formatDate } from "@/lib/utils";

export function EventCard({ event }: { event: EventStage }) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-panel shadow-sm">
      <div
        className="h-44 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image_url})` }}
      />
      <div className="space-y-5 p-5">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-bold uppercase text-muted">
            <Radio className="h-3.5 w-3.5 text-turquoise" />
            {event.type}
          </div>
          <h2 className="text-xl font-black tracking-normal">{event.name}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{event.description}</p>
        </div>

        <div className="grid gap-2 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4 text-coral" />
            {formatDate(event.date)}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            {event.location}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/events/${event.id}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-bold text-background transition hover:bg-foreground/85"
          >
            <Ticket className="h-4 w-4" />
            Open stage
          </Link>
          <Link
            href={`/stages/${event.id}`}
            className="inline-flex h-10 items-center rounded-md border border-line px-4 text-sm font-bold transition hover:bg-black/5"
          >
            Public view
          </Link>
        </div>
      </div>
    </article>
  );
}
