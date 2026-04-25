import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { DailyLogCard } from "@/components/streak/DailyLogCard";
import { StreakCalendar } from "@/components/streak/StreakCalendar";
import { StreakCounter } from "@/components/streak/StreakCounter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useStreakStore } from "@/stores/streakStore";

export default function HomeScreen() {
  const { logs, stats } = useStreakStore();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.hero}>
        <StreakCounter count={stats.current} />
        <StreakCalendar activeDays={Math.min(7, stats.current)} />
        <Link href="/streak/log" asChild>
          <Button>Log daily care</Button>
        </Link>
      </Card>
      <View style={styles.section}>
        <Text style={styles.heading}>Recent activity</Text>
        {logs.length === 0 ? (
          <Text style={styles.muted}>Your plant care logs will appear here.</Text>
        ) : (
          logs.map((log) => <DailyLogCard key={log.id} log={log} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, gap: spacing.lg, padding: spacing.lg },
  heading: { color: colors.text, fontSize: 22, fontWeight: "900" },
  hero: { gap: spacing.lg },
  muted: { color: "rgba(232,245,233,0.7)" },
  section: { gap: spacing.md },
});
