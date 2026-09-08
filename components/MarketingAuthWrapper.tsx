"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { Navbar } from "./layouts/navbar";
import { Footer } from "./layouts/footer";
import { TooltipProvider } from "./ui/tooltip";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./layouts/appSidebar";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { getUserApi } from "@/lib/api/user";

const NO_SIDEBAR_ROUTES = ["/events"];
const emptySubscribe = () => () => {};

export function MarketingAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  // Track whether we've hydrated on the client. During SSR `document` is
  // undefined, so the auth store initializes as unauthenticated and would
  // briefly flash the navbar. We wait until mount before deciding what to show.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const pathname = usePathname();

  useEffect(() => {
    async function fetchUserSession() {
      if (isAuthenticated && !user) {
        try {
          const response = await getUserApi();

          if (response.data) {
            setAuth(response.data);
          }
        } catch {
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
      {mounted && !isAuthenticated && <Navbar />}
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-1 w-full flex-col min-h-screen">
            <div className="flex flex-1 w-full">
              {/* Sidebar stays on the left on desktop*/}
              {mounted && isAuthenticated && !hideSidebar && <AppSidebar />}

              <div className="flex-1 flex flex-col w-full min-w-0">
                {children}
              </div>
            </div>
            {mounted && !isAuthenticated && <Footer />}
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
