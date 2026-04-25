import { StyleSheet, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import type { StreakLog } from "@/types/streak";
import { formatDate } from "@/utils/formatters";

type DailyLogCardProps = {
  log: StreakLog;
};

export function DailyLogCard({ log }: DailyLogCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.date}>{formatDate(log.loggedAt)}</Text>
      <Text style={styles.note}>{log.note ?? "Plant care logged."}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 6 },
  date: { color: colors.text, fontWeight: "800" },
  note: { color: "rgba(232,245,233,0.72)" },
});
