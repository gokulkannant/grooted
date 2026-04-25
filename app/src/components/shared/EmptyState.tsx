import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type EmptyStateProps = {
  title: string;
  body?: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { color: colors.onSurfaceVariant, textAlign: "center" },
  container: { alignItems: "center", gap: spacing.sm, padding: spacing.lg },
  title: { color: colors.onSurface, fontSize: 20, fontWeight: "800", textAlign: "center" },
});
