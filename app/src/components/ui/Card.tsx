import type { ReactNode } from "react";
import { StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";

type CardVariant = "default" | "elevated" | "flat";

type CardProps = ViewProps & {
  children: ReactNode;
  variant?: CardVariant;
};

export function Card({ children, variant = "default", style, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === "elevated" && styles.elevated,
        variant === "flat" && styles.flat,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.md,
  } as ViewStyle,
  elevated: {
    ...shadows.lg,
  } as ViewStyle,
  flat: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    elevation: 0,
  } as ViewStyle,
});
