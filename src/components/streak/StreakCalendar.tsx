import { StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";

type StreakCalendarProps = {
  activeDays: number;
};

export function StreakCalendar({ activeDays }: StreakCalendarProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 7 }).map((_, index) => (
        <View key={`${index.toString()}`} style={[styles.day, index < activeDays && styles.active]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  active: { backgroundColor: colors.streak },
  day: { backgroundColor: "rgba(232,245,233,0.12)", borderRadius: 8, flex: 1, height: 36 },
  row: { flexDirection: "row", gap: 8 },
});
