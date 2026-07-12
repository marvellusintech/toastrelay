"use strict";

import {
  Compass,
  Home,
  LayoutGrid,
  PlusSquare,
  Bell,
  MessageSquare,
  Settings,
  LayoutDashboard,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils/helpers";
import { useAuthStore } from "@/lib/store/useAuthStore";

const navigationItems = [
  { icon: Home, label: "Home", active: true, path: "/" },
    { icon: PlusSquare, label: "Create Event", path: "/dashboard/events/create" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },

  // { icon: Bell, label: "Notifications", path: "/" },
  // { icon: MessageSquare, label: "Messages", path: "/" },
];

export function AppSidebar() {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      <Sidebar
        collapsible="icon"
        className="border-r border-neutral-100 bg-white "
      >
        {/* --- Top Branding Logo --- */}
        <SidebarHeader className="flex items-center justify-center py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-black transition hover:bg-primary-300 cursor-pointer">
            {/* <Compass className="h-6 w-6" /> */}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
                className="w-8 h-8"
              viewBox="0 0 859 867"
            >
              <path
                fill-rule="evenodd"
                fill="rgb(0, 0, 0)"
                d="M854.363,351.300 C680.101,355.561 548.211,457.780 427.319,322.050 C402.012,293.638 377.681,239.638 390.269,175.802 C398.068,117.308 405.870,58.797 413.669,0.304 C484.138,-1.459 592.187,13.495 624.266,47.103 C618.961,78.902 584.713,107.709 567.717,130.952 C528.071,186.196 488.414,241.456 448.768,296.700 C447.747,316.248 448.193,321.888 456.568,333.750 C459.818,335.050 463.069,336.350 466.318,337.650 C500.673,346.151 529.644,302.240 550.167,286.950 C614.510,238.206 678.872,189.447 743.215,140.702 C789.641,167.166 850.305,282.178 854.363,351.300 ZM0.274,386.399 C-1.107,323.152 24.620,264.236 49.023,222.601 C51.623,222.601 54.223,222.601 56.823,222.601 C77.616,241.093 222.695,350.461 245.971,341.550 C251.170,337.000 256.371,332.449 261.571,327.900 C261.681,250.434 147.663,192.355 127.022,127.052 C159.315,80.573 226.799,38.978 288.870,23.704 C297.948,177.379 362.861,288.632 230.371,374.699 C203.076,392.430 154.519,412.337 101.673,401.999 C67.876,396.799 34.070,391.599 0.274,386.399 ZM858.263,495.598 C855.444,583.542 803.896,660.524 760.765,712.045 C758.165,712.045 755.564,712.045 752.965,712.045 C696.122,665.061 632.989,622.941 569.667,583.347 C540.519,565.121 517.520,524.801 474.118,522.897 C466.969,529.397 459.818,535.898 452.668,542.397 C452.836,577.821 576.891,727.539 602.817,758.845 C615.815,773.793 628.818,788.746 641.816,803.694 C637.931,786.479 612.551,867.709 429.269,866.093 C418.870,802.400 408.468,738.688 398.069,674.996 C387.879,622.798 407.871,576.893 425.369,550.197 C520.457,405.124 683.008,494.275 858.263,495.598 ZM0.274,491.698 C51.396,484.284 83.940,479.539 121.172,472.198 C160.738,464.397 194.820,480.403 218.671,489.748 C356.626,543.796 322.770,692.952 304.470,846.593 C302.520,846.593 300.570,846.593 298.620,846.593 C255.370,832.310 146.798,786.985 138.722,745.195 C179.668,689.301 220.625,633.390 261.571,577.497 C273.836,558.450 267.778,534.293 247.921,526.797 C212.556,513.448 103.357,647.451 66.573,655.496 C43.101,660.629 1.041,527.652 0.274,491.698 Z"
              />
            </svg>
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

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {getInitials(user?.firstName ?? "T", user?.lastName ?? "R")}
            </AvatarFallback>
          </Avatar>
        </SidebarFooter>
      </Sidebar>

      <MobileBottomNav items={navigationItems} />
    </div>
  );
}
