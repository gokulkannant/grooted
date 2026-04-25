import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Grooted</Text>
      <Input autoCapitalize="words" placeholder="Display name" />
      <Input autoCapitalize="none" keyboardType="email-address" placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />
      <Button>Create account</Button>
      <Link href="/login" style={styles.link}>I already have an account</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.lg },
  link: { color: colors.primary, fontWeight: "800", textAlign: "center" },
  title: { color: colors.text, fontSize: 32, fontWeight: "900" },
});
