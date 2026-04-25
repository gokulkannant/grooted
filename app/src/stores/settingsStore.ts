import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorageAdapter } from "@/stores/secureStorage";

type ThemeMode = "system" | "light" | "dark";

type SettingsState = {
  language: "en" | "hi";
  theme: ThemeMode;
  setLanguage: (language: SettingsState["language"]) => void;
  setTheme: (theme: ThemeMode) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: "en",
      theme: "system",
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "grooted-settings",
      storage: createJSONStorage(() => secureStorageAdapter),
    },
  ),
);
