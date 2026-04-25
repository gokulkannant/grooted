import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

type StreakCounterProps = {
  count: number;
};

export function StreakCounter({ count }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  count: { color: colors.streak, fontSize: 44, fontWeight: "900" },
  label: { color: colors.text, fontWeight: "800" },
});
