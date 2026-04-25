import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type PressableProps } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = PressableProps & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({ children, variant = "primary", style, ...props }: ButtonProps) {
  return (
    <Pressable style={typeof style === "function" ? style : style} {...props}>
      {({ pressed }) => (
        <View style={styles.container}>
          {variant !== "ghost" && <View style={styles.shadowBlock} />}
          <View
            style={[
              styles.base,
              styles[variant],
              pressed && variant !== "ghost" && styles.pressed,
            ]}
          >
            <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>
              {children}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    marginVertical: spacing.xs,
    position: "relative",
  },
  shadowBlock: {
    position: "absolute",
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: colors.shadow,
    borderRadius: radius.none,
  },
  base: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.none,
    borderWidth: 4,
    borderColor: colors.border,
    transform: [{ translateX: 0 }, { translateY: 0 }],
  },
  pressed: {
    transform: [{ translateX: 6 }, { translateY: 6 }],
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  ghostLabel: {
    color: colors.primaryDark,
  },
  label: {
    color: colors.textLight,
    fontSize: typography.sizes.md,
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontWeight: "800",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
});
