import { Settings2 } from "lucide-react";
import { notFound } from "next/navigation";

import { demoEvents } from "@/lib/demo_data";

type EditEventPageProps = {
  params: Promise<{ event_id: string }>;
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { event_id } = await params;
  const event = demoEvents.find((item) => item.id === event_id);

  if (!event) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="border-b border-line pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-muted">Edit stage</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">{event.name}</h1>
      </div>
      <section className="mt-8 rounded-lg border border-line bg-panel p-6 shadow-sm">
        <Settings2 className="h-6 w-6 text-coral" />
        <h2 className="mt-4 text-xl font-black">Stage settings</h2>
        <p className="mt-3 leading-7 text-muted">
          This route is reserved for the edit form, media upload flow, template selection,
          theme controls, guest circle linking, and thread item management.
        </p>
      </section>
    </main>
  );
}
