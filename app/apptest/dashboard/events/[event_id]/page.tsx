import { Calendar, Gift, Images, MapPin, Shirt, Ticket, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  demoEvents,
  demoGuests,
  demoMoments,
  demoThreadItems,
  demoTicketTiers,
  demoToasts,
} from "@/lib/demo_data";
import { formatCurrency, formatDate } from "@/lib/utils";

type EventPageProps = {
  params: Promise<{ event_id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

const tabs = [
  { value: "toasts", label: "Toasts", icon: Gift },
  { value: "guests", label: "Guests", icon: Users },
  { value: "moments", label: "Moments", icon: Images },
  { value: "pass", label: "Pass", icon: Ticket },
  { value: "thread", label: "Thread", icon: Shirt },
];

export default async function EventPage({ params, searchParams }: EventPageProps) {
  const [{ event_id }, query] = await Promise.all([params, searchParams]);
  const event = demoEvents.find((item) => item.id === event_id);
  const activeTab = query.tab ?? "toasts";

  if (!event) notFound();

  return (
    <main>
      <section
        className="relative min-h-[420px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${event.image_url})` }}
      >
        <div className="absolute inset-0 bg-black/58" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-6 py-10 sm:px-8 lg:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-turquoise">
            {event.type} stage
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">
            {event.name}
          </h1>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-white/82">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-coral" />
              {formatDate(event.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              {event.location}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-line">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/events/${event.id}?tab=${tab.value}`}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-4 text-sm font-black uppercase tracking-[0.18em] transition ${
                activeTab === tab.value
                  ? "border-turquoise text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          ))}
        </div>

        {activeTab === "guests" ? (
          <div className="grid gap-3">
            {demoGuests.map((guest) => (
              <div key={guest.id} className="grid gap-3 rounded-lg border border-line bg-panel p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <h2 className="font-black">{guest.name}</h2>
                  <p className="text-sm text-muted">{guest.email}</p>
                </div>
                <span className="rounded-full border border-line px-3 py-1 text-xs font-black uppercase text-muted">
                  {guest.rsvp_status}
                </span>
              </div>
            ))}
          </div>
        ) : activeTab === "moments" ? (
          <div className="grid gap-5 md:grid-cols-2">
            {demoMoments.map((moment) => (
              <article key={moment.id} className="overflow-hidden rounded-lg border border-line bg-panel shadow-sm">
                <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${moment.image_url})` }} />
                <div className="p-5">
                  <h2 className="font-black">{moment.caption}</h2>
                  <p className="mt-2 text-sm text-muted">
                    {moment.uploader_name} · {moment.reaction_count} reactions
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : activeTab === "pass" ? (
          <div className="grid gap-5 md:grid-cols-2">
            {demoTicketTiers.map((tier) => (
              <article key={tier.id} className="rounded-lg border border-line bg-panel p-5 shadow-sm">
                <h2 className="text-xl font-black">{tier.name}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{tier.description}</p>
                <div className="mt-5 flex items-end justify-between">
                  <p className="text-3xl font-black">{formatCurrency(tier.price)}</p>
                  <p className="text-sm font-bold text-muted">{tier.sold}/{tier.capacity} claimed</p>
                </div>
              </article>
            ))}
          </div>
        ) : activeTab === "thread" ? (
          <div className="grid gap-5 md:grid-cols-2">
            {demoThreadItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-lg border border-line bg-panel shadow-sm">
                <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{item.category}</p>
                  <h2 className="mt-2 text-xl font-black">{item.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                  <p className="mt-4 text-2xl font-black">{formatCurrency(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {demoToasts.map((toast) => (
              <article key={toast.id} className="rounded-lg border border-line bg-panel p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-black">{toast.author_name}</h2>
                  <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-black uppercase text-muted">
                    {toast.contribution_type}
                  </span>
                </div>
                <p className="mt-3 leading-7 text-muted">{toast.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
