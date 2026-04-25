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
  icon?: ReactNode;
};

const variantStyles: Record<ButtonVariant, { bg: string; text: string }> = {
  primary: { bg: colors.primary, text: colors.onPrimary },
  secondary: { bg: colors.secondary, text: colors.onSecondary },
  accent: { bg: colors.primaryFixed, text: colors.onPrimaryFixed },
  ghost: { bg: "transparent", text: colors.primary },
};

export function Button({ children, variant = "primary", icon, style, ...props }: ButtonProps) {
  const v = variantStyles[variant];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg },
        variant !== "ghost" && shadows.lg,
        variant !== "ghost" && {
          borderWidth: 4,
          borderColor: colors.border,
        },
        pressed && variant !== "ghost" && styles.pressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...props}
    >
      {icon}
      <Text
        style={[
          styles.label,
          { color: v.text },
          variant === "ghost" && styles.ghostLabel,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  } as ViewStyle,
  pressed: {
    transform: [{ translateX: 6 }, { translateY: 6 }],
    ...shadows.pressed,
  } as ViewStyle,
  label: {
    fontSize: typography.sizes.md,
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  } as TextStyle,
  ghostLabel: {
    textTransform: "none",
    letterSpacing: 0,
  } as TextStyle,
});
