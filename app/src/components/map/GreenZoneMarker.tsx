import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";

type GreenZoneMarkerProps = {
  label: string;
};

export function GreenZoneMarker({ label }: GreenZoneMarkerProps) {
  return (
    <View style={styles.marker}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: { backgroundColor: colors.primaryContainer, borderRadius: 8, borderWidth: 3, borderColor: colors.border, padding: 8 },
  text: { color: colors.onPrimaryContainer, fontWeight: "800" },
});
