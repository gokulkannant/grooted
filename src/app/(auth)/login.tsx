import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useAuthStore } from "@/stores/authStore";

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const demoLogin = () =>
    setSession({
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
      user: { displayName: "Urban Farmer", email: "farmer@grooted.app", id: "demo-user" },
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Input autoCapitalize="none" keyboardType="email-address" placeholder="Email" />
      <Input placeholder="Password" secureTextEntry />
      <Button onPress={demoLogin}>Log in</Button>
      <Link href="/register" style={styles.link}>Create account</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.lg },
  link: { color: colors.primary, fontWeight: "800", textAlign: "center" },
  title: { color: colors.text, fontSize: 32, fontWeight: "900" },
});
