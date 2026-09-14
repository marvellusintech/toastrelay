"use client";

import { useEffect, useState } from "react";
import DiscoveryPage from "@/components/DiscoveryMasonry";
import LandingPage from "@/components/LandingPage";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface HomeViewProps {
  initialIsAuthenticated: boolean;
}

export function HomeView({ initialIsAuthenticated }: HomeViewProps) {
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);

  useEffect(() => {
    setIsAuthenticated(storeIsAuthenticated);
  }, [storeIsAuthenticated]);

  return isAuthenticated ? <DiscoveryPage /> : <LandingPage />;
}

