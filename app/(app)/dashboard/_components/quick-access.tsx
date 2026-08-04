import { CircleUserRound, QrCode } from "lucide-react";
import Link from "next/link";

const items = [
  {
    href: "/dashboard/passes",
    label: "My passes",
    description: "View your QR passes and tickets",
    icon: QrCode,
  },
  {
    href: "/dashboard/circles",
    label: "Circles",
    description: "Create and manage circles for private events",
    icon: CircleUserRound,
  },
];

export function QuickAccess() {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-start gap-4 rounded-2xl border border-line bg-panel p-5 transition hover:border-turquoise hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
            <item.icon className="h-5 w-5 text-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground group-hover:text-turquoise">
              {item.label}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
