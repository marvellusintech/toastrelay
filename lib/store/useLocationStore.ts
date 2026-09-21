import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserCoordinates } from "@/lib/utils/location";

interface LocationState {
  userLocation: UserCoordinates | null;
  isLocationSortActive: boolean;
  isBannerDismissed: boolean;
  setUserLocation: (coords: UserCoordinates | null) => void;
  setIsLocationSortActive: (active: boolean) => void;
  setIsBannerDismissed: (dismissed: boolean) => void;
  resetLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      userLocation: null,
      isLocationSortActive: false,
      isBannerDismissed: false,

      setUserLocation: (coords) =>
        set({
          userLocation: coords,
          isLocationSortActive: Boolean(coords),
          isBannerDismissed: Boolean(coords),
        }),

      setIsLocationSortActive: (active) =>
        set({
          isLocationSortActive: active,
        }),

      setIsBannerDismissed: (dismissed) =>
        set({
          isBannerDismissed: dismissed,
        }),

      resetLocation: () =>
        set({
          isLocationSortActive: false,
          isBannerDismissed: false,
        }),
    }),
    {
      name: "toastrelay_location_preference",
    },
  ),
);

