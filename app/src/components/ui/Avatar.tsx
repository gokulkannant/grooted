import { Image, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { shadows } from "@/constants/layout";
import { typography } from "@/constants/typography";

type AvatarProps = {
  name: string;
  uri?: string;
  size?: number;
};

export function Avatar({ name, uri, size = 44 }: AvatarProps) {
  const initials = name.slice(0, 2).toUpperCase();
  const borderRadius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.avatar, { height: size, width: size, borderRadius }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { height: size, width: size, borderRadius }]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    ...shadows.md,
  } as ViewStyle,
  fallback: {
    alignItems: "center",
    backgroundColor: colors.primary,
    justifyContent: "center",
    ...shadows.md,
  } as ViewStyle,
  initials: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontWeight: typography.weights.bold,
    color: colors.onPrimary,
  } as TextStyle,
});
