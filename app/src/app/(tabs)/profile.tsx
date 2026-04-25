import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useAuthStore } from "@/stores/authStore";
import { useStreakStore } from "@/stores/streakStore";

export default function ProfileScreen() {
  const { clearAuth, user } = useAuthStore();
  const stats = useStreakStore((state) => state.stats);
  const name = user?.displayName ?? "Urban Farmer";

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Avatar name={name} size={72} uri={user?.avatarUrl} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.muted}>{stats.longest} day best streak</Text>
        <Badge label="Seed Scout" tone="gold" />
      </Card>
      <Link href="/leaderboard" asChild>
        <Button variant="secondary">Season leaderboard</Button>
      </Link>
      <Link href="/settings" asChild>
        <Button variant="ghost">Settings</Button>
      </Link>
      <Button onPress={clearAuth} variant="ghost">Log out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", gap: spacing.sm },
  container: { backgroundColor: colors.background, flex: 1, gap: spacing.md, padding: spacing.lg },
  muted: { color: "rgba(232,245,233,0.72)" },
  name: { color: colors.text, fontSize: 24, fontWeight: "900" },
});
