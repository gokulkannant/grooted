import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useSettingsStore } from "@/stores/settingsStore";

export default function SettingsScreen() {
  const { language, setLanguage, setTheme, theme } = useSettingsStore();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Language</Text>
        <Text style={styles.muted}>{language.toUpperCase()}</Text>
        <Button onPress={() => setLanguage(language === "en" ? "hi" : "en")}>Toggle language</Button>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.title}>Theme</Text>
        <Text style={styles.muted}>{theme}</Text>
        <Button onPress={() => setTheme(theme === "dark" ? "system" : "dark")}>Toggle theme</Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  container: { backgroundColor: colors.background, flex: 1, gap: spacing.md, padding: spacing.lg },
  muted: { color: colors.onSurfaceVariant },
  title: { color: colors.onSurface, fontSize: 20, fontWeight: "900" },
});
