"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "./layouts/navbar";
import { TooltipProvider } from "./ui/tooltip";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./layouts/appSidebar";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { getUserApi } from "@/lib/api/user";
import { User } from "@/types/response";

const NO_SIDEBAR_ROUTES = ["/events"];

export function MarketingAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const pathname = usePathname();

  useEffect(() => {
    async function fetchUserSession() {
      if (isAuthenticated && !user) {
        try {
          const response = await getUserApi();

          if (response.data) {
            setAuth(response.data);
          }
        } catch (error) {
          // logout();
        }
      }
    }

    fetchUserSession();
  }, [isAuthenticated, user, setAuth, logout]);

  const hideSidebar = NO_SIDEBAR_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  return (
    <>
      {!isAuthenticated && <Navbar />}
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-1 w-full">
            {/* Sidebar stays on the left on desktop*/}
            {isAuthenticated && !hideSidebar && <AppSidebar />}

            {children}
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
