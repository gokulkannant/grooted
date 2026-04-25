import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { Ranking } from "@/types/leaderboard";

type RankCardProps = {
  ranking: Ranking;
};

export function RankCard({ ranking }: RankCardProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>#{ranking.rank}</Text>
      <Text style={styles.name}>{ranking.displayName}</Text>
      <Text style={styles.points}>{ranking.points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { color: colors.text, flex: 1, fontWeight: "800" },
  points: { color: colors.accent, fontWeight: "900" },
  rank: { color: colors.text, width: 48 },
  row: { alignItems: "center", flexDirection: "row", paddingVertical: 12 },
});
