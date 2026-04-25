import { StyleSheet, View } from "react-native";

type SkeletonProps = {
  height?: number;
  width?: number | `${number}%`;
};

export function Skeleton({ height = 16, width = "100%" }: SkeletonProps) {
  return <View style={[styles.skeleton, { height, width }]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "rgba(232,245,233,0.12)",
    borderRadius: 8,
  },
});
