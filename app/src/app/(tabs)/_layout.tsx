import { Tabs } from "expo-router";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { spacing } from "@/constants/layout";
import { FarmIcon } from "@/components/icons/TabIcons";
import { FloatingTabBar } from "@/components/navigation/FloatingTabBar";

export const TAB_BAR_SPACE = Platform.OS === "ios" ? 100 : 88;

function HeaderBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.headerLeft}>
        <View style={styles.logoBadge}>
          <FarmIcon size={20} color="#FFFFFF" strokeWidth={2.2} />
        </View>
        <Text style={styles.headerTitle}>GROOTED</Text>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={({ route }) => ({
        header: route.name !== "map" ? () => <HeaderBar /> : undefined,
        headerShown: route.name !== "map",
        headerShadowVisible: false,
        tabBarStyle: { display: "none" as const },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="scan" options={{ title: "Scan" }} />
      <Tabs.Screen name="garden" options={{ title: "Garden" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: colors.background,
    paddingBottom: 10,
    paddingHorizontal: spacing.gutter,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as ViewStyle,
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  } as ViewStyle,
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  headerTitle: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: 18,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    letterSpacing: 0.5,
  } as TextStyle,
});
