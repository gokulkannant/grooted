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
      <View style={[styles.ring, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
        <Image source={{ uri }} style={{ height: size, width: size, borderRadius }} />
      </View>
    );
  }

  return (
    <View style={[styles.ring, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
      <View style={[styles.fallback, { height: size, width: size, borderRadius }]}>
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 4,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainerLowest,
    ...shadows.md,
  } as ViewStyle,
  fallback: {
    alignItems: "center",
    backgroundColor: colors.primaryContainer,
    justifyContent: "center",
  } as ViewStyle,
  initials: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontWeight: typography.weights.extrabold,
    color: colors.onPrimaryContainer,
  } as TextStyle,
});
