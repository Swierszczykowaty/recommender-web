import { create } from "zustand";

interface BackgroundStore {
  dynamicColors: string[] | null;
  setDynamicColors: (colors: string[] | null) => void;
}

export const useBackgroundStore = create<BackgroundStore>((set) => ({
  dynamicColors: null,
  setDynamicColors: (colors) => set({ dynamicColors: colors }),
}));
