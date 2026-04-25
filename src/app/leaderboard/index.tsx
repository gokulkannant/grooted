import { ScrollView, StyleSheet } from "react-native";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { SeasonBanner } from "@/components/leaderboard/SeasonBanner";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useLeaderboardStore } from "@/stores/leaderboardStore";

const demoRankings = [
  { displayName: "Urban Farmer", points: 920, rank: 1, userId: "demo-user" },
  { displayName: "Balcony Botanist", points: 760, rank: 2, userId: "demo-two" },
  { displayName: "Compost Captain", points: 640, rank: 3, userId: "demo-three" },
];

export default function LeaderboardScreen() {
  const { rankings, season } = useLeaderboardStore();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SeasonBanner season={season} />
      <LeaderboardList rankings={rankings.length ? rankings : demoRankings} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1, gap: spacing.lg, padding: spacing.lg },
});
