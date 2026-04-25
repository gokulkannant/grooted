import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useStreakStore } from "@/stores/streakStore";

export default function StreakLogScreen() {
  const router = useRouter();
  const addLog = useStreakStore((state) => state.addLog);
  const save = () => {
    addLog({
      id: `log-${Date.now().toString()}`,
      loggedAt: new Date().toISOString(),
      note: "Daily care completed.",
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily log</Text>
      <Text style={styles.copy}>Capture a photo or video after watering, pruning, or checking your plant.</Text>
      <Button onPress={save}>Complete log</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, gap: spacing.md, padding: spacing.lg },
  copy: { color: colors.onSurfaceVariant, fontSize: 16 },
  title: { color: colors.onSurface, fontSize: 28, fontWeight: "900" },
});
