import { StyleSheet, TextInput, type TextInputProps, type TextStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.outline}
      style={[styles.input, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 4,
    color: colors.onSurface,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    minHeight: 52,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  } as TextStyle,
});
