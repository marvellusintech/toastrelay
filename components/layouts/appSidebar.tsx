"use strict";

import {
  Compass,
  Home,
  LayoutGrid,
  PlusSquare,
  Bell,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mockCurrentUser } from "@/lib/mock_data";
import { MobileBottomNav } from "./mobileBottomNav";
import Link from "next/link";

const navigationItems = [
  { icon: Home, label: "Home", active: true, path: "/" },
  // { icon: LayoutGrid, label: "Explore" },
  { icon: PlusSquare, label: "Create Event", path: "/dashboard/events/create" },
  { icon: Bell, label: "Notifications", path: "/" },
  { icon: MessageSquare, label: "Messages", path: "/" },
];

export function AppSidebar() {
  return (
    <div>
      <Sidebar
        collapsible="icon"
        className="border-r border-neutral-100 bg-white "
      >
        {/* --- Top Branding Logo --- */}
        <SidebarHeader className="flex items-center justify-center py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black transition hover:bg-primary-300 cursor-pointer">
            <Compass className="h-6 w-6" />
          </div>
        </SidebarHeader>

        {/* --- Core Navigation Items --- */}
        <SidebarContent className="px-2 mt-6">
          <SidebarMenu className="gap-6 flex flex-col items-center">
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.path}>
                <SidebarMenuButton
                  tooltip={item.label}
                  className={`flex !h-10 !w-10 w-full items-center justify-center rounded-full transition-colors ${
                    item.active
                      ? "bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <item.icon className="!h-5 !w-5" />
                  <span className="group-data-[collapsible=icon]:hidden ml-3 text-sm font-semibold">
                    {item.label}
                  </span>
                </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        {/* --- Bottom Profile / Action Utility --- */}
        <SidebarFooter className="flex flex-col items-center gap-4 pb-6">
          <SidebarMenu className="flex flex-col items-center">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Settings"
                className="!h-12 !w-12  text-neutral-500 hover:bg-neutral-100 rounded-xl"
              >
                <Settings className="!h-6 !w-6 " />
                <span className="group-data-[collapsible=icon]:hidden ml-3 text-sm font-medium">
                  Settings
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <img
            src={mockCurrentUser.photoUrl || ""}
            alt={mockCurrentUser.firstName || ""}
            className="h-8 w-8 rounded-full border border-neutral-200 object-cover cursor-pointer hover:opacity-80 transition"
          />
        </SidebarFooter>
      </Sidebar>

      <MobileBottomNav items={navigationItems} />
    </div>
  );
}
