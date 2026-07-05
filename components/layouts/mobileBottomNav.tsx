// components/mobile-bottom-nav.tsx
"use strict";

import { mockCurrentUser } from "@/lib/mock_data";
import { LucideIcon, Settings } from "lucide-react";

// Pass navigationItems in as a prop or export it from your sidebar file
interface BottomNavProps {
  items: Array<{ icon: LucideIcon; label: string; active?: boolean }>;
}

export function MobileBottomNav({ items }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-100 bg-white px-4 py-2 md:hidden">
      <nav className="flex items-center justify-between">
        {items.map((item) => (
          <button
            key={item.label}
            className={`flex h-12 w-12 flex-col items-center justify-center rounded-full transition-colors ${
              item.active ? "text-neutral-900" : "text-neutral-400"
            }`}
          >
            <item.icon className="h-6 w-6" />
            {/* <span className="text-[10px] font-medium mt-0.5">{item.label}</span> */}
          </button>
        ))}

        {/* Optional: Include the profile pic in the bottom bar like Instagram does */}
        <div className="flex h-12 w-12 items-center justify-center">
          <img
            src={mockCurrentUser.photoUrl || ""}
            alt={mockCurrentUser.firstName || ""}
            className="h-6 w-6 rounded-full border border-neutral-200 object-cover"
          />
        </div>
      </nav>
    </div>
  );
}