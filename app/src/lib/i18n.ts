import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import { useSettingsStore } from "@/stores/settingsStore";

const dictionaries = { en, hi };

export const t = (key: keyof typeof en) => {
  const language = useSettingsStore.getState().language;
  return dictionaries[language][key] ?? en[key];
};
