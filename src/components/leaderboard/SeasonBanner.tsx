import { StyleSheet, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import type { Season } from "@/types/leaderboard";

type SeasonBannerProps = {
  season?: Season;
};

export function SeasonBanner({ season }: SeasonBannerProps) {
  return (
    <Card>
      <Text style={styles.title}>{season?.name ?? "Spring Claim Season"}</Text>
      <Text style={styles.text}>Compete for neighborhood farm points.</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  text: { color: "rgba(232,245,233,0.72)" },
  title: { color: colors.text, fontSize: 20, fontWeight: "900" },
});
