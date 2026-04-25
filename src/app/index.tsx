import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grooted</Text>
      <Text style={styles.copy}>Grow real plants, hold your streak, and claim your neighborhood.</Text>
      <Link href="/login" asChild>
        <Button>Start farming</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, gap: spacing.lg, justifyContent: "center", padding: spacing.lg },
  copy: { color: "rgba(232,245,233,0.72)", fontSize: 18 },
  title: { color: colors.text, fontSize: 48, fontWeight: "900" },
});
