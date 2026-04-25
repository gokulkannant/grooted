import * as Notifications from "expo-notifications";

export const NotificationService = {
  scheduleDailyReminder: async () =>
    Notifications.scheduleNotificationAsync({
      content: {
        body: "Log today's plant care to keep your streak alive.",
        title: "Grooted streak check",
      },
      trigger: { hour: 19, minute: 0, repeats: true } as Notifications.NotificationTriggerInput,
    }),
};
