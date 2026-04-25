import { StyleSheet, Text } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type OfflineBannerProps = {
  visible: boolean;
};

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;
  return <Text style={styles.banner}>Offline mode</Text>;
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warning,
    color: colors.textLight,
    fontWeight: "800",
    padding: spacing.sm,
    textAlign: "center",
  },
});
