"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils/helpers";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface BottomNavProps {
  items: Array<{ icon: LucideIcon; label: string; path: string }>;
}

export function MobileBottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  function isPathActive(path: string): boolean {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  // Only the most specific matching route should appear active (e.g. being on
  // /dashboard/events/create highlights "Create Event", not "Dashboard").
  const activePath =
    items
      .filter((item) => isPathActive(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0]?.path ?? null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-100 bg-white px-4 py-2 md:hidden">
      <nav className="flex items-center justify-between">
        {items.map((item) => {
          const active = item.path === activePath;
          return (
            <Link
              key={item.label}
              href={item.path}
              aria-label={item.label}
              className={`flex h-12 w-12 flex-col items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <item.icon className="h-6 w-6" />
            </Link>
          );
        })}

        <Link href="/dashboard/settings" aria-label="Go to profile">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback>
              {getInitials(user?.firstName ?? "T", user?.lastName ?? "R")}
            </AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </div>
  );
}
