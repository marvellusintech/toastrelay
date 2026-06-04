import { CalendarPlus, CircleUserRound, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { BrandTag } from "@/components/reuseables/brand_tag";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/events/new", label: "New stage", icon: CalendarPlus },
  { href: "/circles", label: "Circles", icon: CircleUserRound },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-line bg-background/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link href="/dashboard" className="inline-flex items-center">
            <BrandTag className="text-xl" />
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-bold text-muted transition hover:bg-black/[0.04] hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
