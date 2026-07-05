"use client";

import React, { useState } from "react";
import { Navbar } from "./layouts/navbar";
import { TooltipProvider } from "./ui/tooltip";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./layouts/appSidebar";
import { usePathname } from "next/navigation";

    const NO_SIDEBAR_ROUTES = ["/events",];

export function MarketingAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Your client-side state stays safe here
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const pathname = usePathname();
  
  // const hideSidebar = NO_SIDEBAR_ROUTES.includes(pathname);

  const hideSidebar = NO_SIDEBAR_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  return (
    <>
      {!isAuthenticated && <Navbar />}
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-1 w-full">
            {/* Sidebar stays on the left on desktop*/}
            {isAuthenticated && !hideSidebar &&<AppSidebar  />}

            {children}
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
