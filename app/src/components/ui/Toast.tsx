import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  return (
    <View style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.onSurface, fontWeight: "700" },
  toast: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: colors.border,
    padding: spacing.md,
  },
});
