import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor="rgba(232,245,233,0.56)"
      style={[styles.input, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: "rgba(232,245,233,0.12)",
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
});
