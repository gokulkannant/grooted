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
  text: { color: colors.text },
  toast: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
