import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { createElement } from "react";

type ExpoRootProps = Parameters<typeof ExpoRoot>[0];

const ctx = (require as NodeRequire & {
  context: (path: string) => unknown;
}).context("./src/app") as ExpoRootProps["context"];

function App() {
  return createElement(ExpoRoot, { context: ctx });
}

registerRootComponent(App);
