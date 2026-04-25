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
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 8,
  },
});
