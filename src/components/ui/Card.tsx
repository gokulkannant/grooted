import type { ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type CardProps = ViewProps & {
  children: ReactNode;
};

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: "rgba(232,245,233,0.08)",
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
});
