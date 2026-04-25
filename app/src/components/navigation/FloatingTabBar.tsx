import { type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import {
  FarmIcon,
  MapIcon,
  ScanIcon,
  GardenIcon,
  ProfileIcon,
} from "@/components/icons/TabIcons";

const TAB_ICONS: Record<
  string,
  React.FC<{ size?: number; color?: string; strokeWidth?: number }>
> = {
  home: FarmIcon,
  map: MapIcon,
  scan: ScanIcon,
  garden: GardenIcon,
  profile: ProfileIcon,
};

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 12);

  // Check if the focused screen wants to hide the tab bar
  const focusedRoute = state.routes[state.index];
  const focusedOptions = descriptors[focusedRoute.key]?.options;
  // biome-ignore lint: any is fine for custom options
  const isHidden = (focusedOptions as any)?.tabBarVisible === false;

  if (isHidden) return null;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.tabBarLabel ?? options.title ?? route.name) as string;
          const isFocused = state.index === index;
          const IconComponent = TAB_ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                {IconComponent && (
                  <IconComponent
                    size={20}
                    color={isFocused ? "#FFFFFF" : colors.outline}
                    strokeWidth={isFocused ? 2.2 : 1.8}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isFocused && styles.labelActive,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
  } as ViewStyle,
  bar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    height: 64,
    alignItems: "center",
    paddingHorizontal: 6,
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  } as ViewStyle,
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  } as ViewStyle,
  iconWrap: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  iconWrapActive: {
    backgroundColor: colors.primary,
    borderRadius: 16,
  } as ViewStyle,
  label: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 10,
    fontWeight: typography.weights.medium,
    color: colors.outline,
  } as TextStyle,
  labelActive: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,
});
