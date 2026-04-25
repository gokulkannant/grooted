import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";

type ButtonProps = PressableProps & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
  primary: { bg: colors.primary, text: colors.onPrimary },
  secondary: { bg: colors.secondary, text: colors.onSecondary },
  accent: { bg: colors.primaryContainer, text: colors.primary },
  ghost: { bg: "transparent", text: colors.primary },
};

export function Button({ children, variant = "primary", style, ...props }: ButtonProps) {
  const v = variantStyles[variant];

  return (
    <Pressable
      style={(state) => [
        styles.base,
        { backgroundColor: v.bg },
        variant !== "ghost" && shadows.lg,
        variant !== "ghost" && {
          borderWidth: 4,
          borderColor: colors.border,
        },
        state.pressed && variant !== "ghost" && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <Text style={[styles.label, { color: v.text }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: radius.md,
  } as ViewStyle,
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  } as ViewStyle,
  label: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
  } as TextStyle,
});
