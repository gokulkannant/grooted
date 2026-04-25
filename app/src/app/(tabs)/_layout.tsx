import { Tabs } from "expo-router";
import { StyleSheet, View, type TextStyle, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import {
  FarmIcon,
  MapIcon,
  ScanIcon,
  GardenIcon,
  ProfileIcon,
} from "@/components/icons/TabIcons";

const TAB_ICONS: Record<string, React.FC<{ size?: number; color?: string; strokeWidth?: number }>> = {
  home: FarmIcon,
  map: MapIcon,
  scan: ScanIcon,
  garden: GardenIcon,
  profile: ProfileIcon,
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: colors.onSurface,
        headerTitle: "GROOTED",
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          const IconComponent = TAB_ICONS[route.name];
          if (!IconComponent) return null;

          const isScan = route.name === "scan";

          if (isScan) {
            return (
              <View style={[styles.scanButton, focused && styles.scanButtonActive]}>
                <IconComponent
                  size={26}
                  color={focused ? colors.onPrimary : colors.primary}
                  strokeWidth={2.2}
                />
              </View>
            );
          }

          return (
            <View style={[styles.tabIconBox, focused && styles.tabIconBoxActive]}>
              <IconComponent
                size={22}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Farm" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarLabelStyle: styles.scanLabel,
        }}
      />
      <Tabs.Screen name="garden" options={{ title: "Garden" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    height: 80,
  } as ViewStyle,
  headerTitle: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: -1,
  } as TextStyle,
  tabBar: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 4,
    borderTopColor: colors.border,
    height: 84,
    paddingTop: 6,
    paddingBottom: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  } as ViewStyle,
  tabLabel: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  } as TextStyle,
  tabIconBox: {
    width: 40,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  tabIconBoxActive: {
    backgroundColor: colors.primaryFixed,
    borderWidth: 2.5,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  } as ViewStyle,
  scanButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryFixed,
    borderWidth: 3,
    borderColor: colors.border,
    marginTop: -20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  } as ViewStyle,
  scanButtonActive: {
    backgroundColor: colors.primary,
    shadowOffset: { width: 1, height: 1 },
  } as ViewStyle,
  scanLabel: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 6,
  } as TextStyle,
});
