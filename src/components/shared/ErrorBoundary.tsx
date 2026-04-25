import type { ReactNode } from "react";
import { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { ErrorBoundaryHelper } from "@/lib/errorHandler";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    ErrorBoundaryHelper.capture(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Something went wrong.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: colors.background, flex: 1, justifyContent: "center" },
  text: { color: colors.text, fontSize: 18, fontWeight: "700" },
});
