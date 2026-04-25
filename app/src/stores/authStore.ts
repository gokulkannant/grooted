import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TokenManager } from "@/services/TokenManager";
import { useGardenStore } from "@/stores/gardenStore";
import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { useMapStore } from "@/stores/mapStore";
import { secureStorageAdapter } from "@/stores/secureStorage";
import { useStreakStore } from "@/stores/streakStore";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  hasHydrated: boolean;
  lastActivityAt: number | null;
  setSession: (session: { user: User; accessToken: string; refreshToken: string }) => void;
  refreshSession: () => Promise<void>;
  touchSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  clearAuth: () => void;
};

const resetDomainStores = () => {
  useGardenStore.getState().reset();
  useStreakStore.getState().reset();
  useMapStore.getState().reset();
  useLeaderboardStore.getState().reset();
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isRefreshing: false,
      hasHydrated: false,
      lastActivityAt: null,
      setSession: ({ user, accessToken, refreshToken }) => {
        TokenManager.revive();
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          lastActivityAt: Date.now(),
        });
      },
      refreshSession: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) return;
        set({ isRefreshing: true });
        try {
          const session = await TokenManager.refresh(refreshToken);
          set({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            isAuthenticated: true,
            lastActivityAt: Date.now(),
          });
        } finally {
          set({ isRefreshing: false });
        }
      },
      touchSession: () => set({ lastActivityAt: Date.now() }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      clearAuth: () => {
        TokenManager.invalidate();
        resetDomainStores();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isRefreshing: false,
          lastActivityAt: null,
        });
      },
    }),
    {
      name: "grooted-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.accessToken && state.refreshToken && state.user) {
          TokenManager.revive();
          useAuthStore.setState({ isAuthenticated: true });
        }
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        lastActivityAt: state.lastActivityAt,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      storage: createJSONStorage(() => secureStorageAdapter),
    },
  ),
);
