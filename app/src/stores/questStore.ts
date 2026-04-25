import { create } from "zustand";
import { buildDailyQuests } from "@/constants/quests";
import type { ActiveQuest, QuestProfile } from "@/types/quest";

type QuestState = {
  activeQuests: ActiveQuest[];
  completedQuestIds: string[];
  profile: QuestProfile;
  refreshDailyQuests: () => void;
  completeQuest: (instanceId: string) => void;
  setQuestProfile: (profile: Partial<QuestProfile>) => void;
  reset: () => void;
};

const initialProfile: QuestProfile = {
  level: 1,
  plotClass: "nano",
  averageHealthScore: 80,
};

function hasFreshQuests(quests: ActiveQuest[]): boolean {
  if (quests.length === 0) return false;
  return quests.every((quest) => new Date(quest.expiresAt).getTime() > Date.now());
}

export const useQuestStore = create<QuestState>((set, get) => ({
  activeQuests: buildDailyQuests(initialProfile),
  completedQuestIds: [],
  profile: initialProfile,
  refreshDailyQuests: () => {
    const { activeQuests, profile } = get();

    if (hasFreshQuests(activeQuests)) return;

    set({
      activeQuests: buildDailyQuests(profile),
      completedQuestIds: [],
    });
  },
  completeQuest: (instanceId) =>
    set((state) => ({
      completedQuestIds: state.completedQuestIds.includes(instanceId)
        ? state.completedQuestIds
        : [...state.completedQuestIds, instanceId],
    })),
  setQuestProfile: (profileUpdate) =>
    set((state) => {
      const profile = { ...state.profile, ...profileUpdate };

      return {
        profile,
        activeQuests: buildDailyQuests(profile),
        completedQuestIds: [],
      };
    }),
  reset: () =>
    set({
      activeQuests: buildDailyQuests(initialProfile),
      completedQuestIds: [],
      profile: initialProfile,
    }),
}));
