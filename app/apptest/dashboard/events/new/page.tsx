import { CalendarPlus, ImagePlus, Shirt, Sparkles, Users } from "lucide-react";

export default function NewEventPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="border-b border-line pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-muted">Stage builder</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">Create stage</h1>
      </div>

      <section className="grid gap-5 py-8 md:grid-cols-2">
        {[
          { icon: Sparkles, title: "Event details", text: "Name, date, location, type, and public access." },
          { icon: ImagePlus, title: "Stage media", text: "Background image and event visual identity." },
          { icon: Users, title: "Guest circles", text: "Attach reusable audience groups to the stage." },
          { icon: Shirt, title: "Thread items", text: "Optional style, fabric, or outfit participation." },
        ].map((item) => (
          <article key={item.title} className="rounded-lg border border-line bg-panel p-5 shadow-sm">
            <item.icon className="h-5 w-5 text-coral" />
            <h2 className="mt-4 text-xl font-black">{item.title}</h2>
            <p className="mt-2 leading-7 text-muted">{item.text}</p>
          </article>
        ))}
      </section>

      <div className="rounded-lg border border-dashed border-line bg-panel p-6 text-center">
        <CalendarPlus className="mx-auto h-7 w-7 text-turquoise" />
        <p className="mt-3 font-black">The multi-tab event form is the next implementation slice.</p>
      </div>
    </main>
  );
}
