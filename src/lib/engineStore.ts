import { create } from 'zustand';

interface EngineState {
  isEngineReady: boolean;
  wasNavigationAttempted: boolean;
  lastRecommendationUrl: string | null;
  setEngineReady: (isReady: boolean) => void;
  setNavigationAttempted: (wasAttempted: boolean) => void;
  setLastRecommendationUrl: (url: string) => void;
  reset: () => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  isEngineReady: false,
  wasNavigationAttempted: false,
  lastRecommendationUrl: null,
  setEngineReady: (isReady) => set({ isEngineReady: isReady }),
  setNavigationAttempted: (wasAttempted) => set({ wasNavigationAttempted: wasAttempted }),
  setLastRecommendationUrl: (url) => set({ lastRecommendationUrl: url }),
  reset: () => set({ wasNavigationAttempted: false, lastRecommendationUrl: null }),
}));
