import { create } from 'zustand';

interface EngineState {
  isEngineReady: boolean;
  isWaking: boolean;
  wasNavigationAttempted: boolean;
  lastRecommendationUrl: string | null;
  setEngineReady: (isReady: boolean) => void;
  setWaking: (isWaking: boolean) => void;
  setNavigationAttempted: (wasAttempted: boolean) => void;
  setLastRecommendationUrl: (url: string) => void;
  reset: () => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  isEngineReady: false,
  isWaking: false,
  wasNavigationAttempted: false,
  lastRecommendationUrl: null,
  setEngineReady: (isReady) => set({ isEngineReady: isReady }),
  setWaking: (isWaking) => set({ isWaking }),
  setNavigationAttempted: (wasAttempted) => set({ wasNavigationAttempted: wasAttempted }),
  setLastRecommendationUrl: (url) => set({ lastRecommendationUrl: url }),
  reset: () => set({ wasNavigationAttempted: false, lastRecommendationUrl: null }),
}));
