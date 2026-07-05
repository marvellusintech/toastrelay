"use client";

import { useCallback, useMemo, useState } from "react";

import { EVENT_TABS } from "@/lib/constants";

export type EventTab = (typeof EVENT_TABS)[number];

function isEventTab(value: string): value is EventTab {
  return EVENT_TABS.includes(value as EventTab);
}

export function useEventTabState(initialTab: string = "toasts") {
  const [activeTab, setActiveTabState] = useState<EventTab>(
    isEventTab(initialTab) ? initialTab : "toasts"
  );

  const setActiveTab = useCallback((nextTab: string) => {
    if (isEventTab(nextTab)) {
      setActiveTabState(nextTab);
    }
  }, []);

  const tabs = useMemo(() => [...EVENT_TABS], []);

  return {
    activeTab,
    tabs,
    setActiveTab,
    isActiveTab: (tab: EventTab) => tab === activeTab,
  };
}
