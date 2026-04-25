import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { createElement } from "react";

const ctx = require.context("./src/app");

function App() {
  return createElement(ExpoRoot, { context: ctx });
}

registerRootComponent(App);
