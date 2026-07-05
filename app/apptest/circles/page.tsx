import { CircleUserRound, MailPlus, UsersRound } from "lucide-react";

const circles = [
  { name: "Family", count: 32 },
  { name: "Friends", count: 48 },
  { name: "VIP", count: 12 },
];

export default function CirclesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-muted">Audience groups</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">Circles</h1>
        </div>
        <button className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-black text-background transition hover:bg-foreground/85">
          <MailPlus className="h-4 w-4" />
          Add member
        </button>
      </div>

      <section className="grid gap-5 py-8 md:grid-cols-3">
        {circles.map((circle) => (
          <article key={circle.name} className="rounded-lg border border-line bg-panel p-5 shadow-sm">
            <CircleUserRound className="h-6 w-6 text-turquoise" />
            <h2 className="mt-4 text-2xl font-black">{circle.name}</h2>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-muted">
              <UsersRound className="h-4 w-4 text-coral" />
              {circle.count} members
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
