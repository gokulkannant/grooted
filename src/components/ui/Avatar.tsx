import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

type AvatarProps = {
  name: string;
  uri?: string;
  size?: number;
};

export function Avatar({ name, uri, size = 44 }: AvatarProps) {
  const initials = name.slice(0, 2).toUpperCase();
  if (uri) return <Image source={{ uri }} style={[styles.avatar, { height: size, width: size }]} />;
  return (
    <View style={[styles.avatar, styles.fallback, { height: size, width: size }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 999,
  },
  fallback: {
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    justifyContent: "center",
  },
  initials: {
    color: colors.text,
    fontWeight: "800",
  },
});
