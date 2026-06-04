import { Calendar, Gift, MapPin, Ticket, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandTag } from "@/components/reuseables/brand_tag";
import { demoEvents, demoGuests, demoToasts } from "@/lib/demo_data";
import { formatDate } from "@/lib/utils";

type PublicStagePageProps = {
  params: Promise<{ event_id: string }>;
};

export default async function PublicStagePage({ params }: PublicStagePageProps) {
  const { event_id } = await params;
  const event = demoEvents.find((item) => item.id === event_id);

  if (!event) notFound();

  return (
    <main className="min-h-screen bg-background">
      <section
        className="relative min-h-[78svh] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${event.image_url})` }}
      >
        <div className="absolute inset-0 bg-black/56" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-between px-6 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <Link href="/" aria-label="ToastRelay home">
              <BrandTag className="text-xl" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-black"
            >
              <Users className="h-4 w-4" />
              Host view
            </Link>
          </nav>
          <div className="max-w-3xl pb-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-turquoise">
              You are invited
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight tracking-normal sm:text-7xl">
              {event.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/82">{event.description}</p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm font-bold text-white/85">
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
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-12 sm:px-8 md:grid-cols-3 lg:px-10">
        <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
          <Gift className="h-5 w-5 text-coral" />
          <p className="mt-4 text-3xl font-black">{demoToasts.length}</p>
          <p className="mt-1 text-sm font-bold text-muted">Toasts sent</p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
          <Users className="h-5 w-5 text-turquoise" />
          <p className="mt-4 text-3xl font-black">{demoGuests.length}</p>
          <p className="mt-1 text-sm font-bold text-muted">Guests listed</p>
        </div>
        <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
          <Ticket className="h-5 w-5 text-gold" />
          <p className="mt-4 text-3xl font-black">2</p>
          <p className="mt-1 text-sm font-bold text-muted">Pass tiers</p>
        </div>
      </section>
    </main>
  );
}
