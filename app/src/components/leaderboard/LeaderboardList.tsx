import { View } from "react-native";
import type { Ranking } from "@/types/leaderboard";
import { RankCard } from "@/components/leaderboard/RankCard";

type LeaderboardListProps = {
  rankings: Ranking[];
};

export function LeaderboardList({ rankings }: LeaderboardListProps) {
  return (
    <View>
      {rankings.map((ranking) => (
        <RankCard key={ranking.userId} ranking={ranking} />
      ))}
    </View>
  );
}
