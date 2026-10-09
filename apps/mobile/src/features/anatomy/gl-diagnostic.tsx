import { ScrollView, Text } from "react-native";

function attempt(label: string, load: () => unknown) {
  try {
    load();
    return `${label}: ok`;
  } catch (error) {
    const stack = error instanceof Error ? (error.stack ?? error.message) : String(error);
    return `${label}: FAILED\n${stack.split("\n").slice(0, 8).join("\n")}`;
  }
}

const results = [
  attempt("three", () => require("three")),
  attempt("expo-asset", () => require("expo-asset")),
  attempt("expo-file-system", () => require("expo-file-system")),
  attempt("expo-gl", () => require("expo-gl")),
  attempt("fiber/native", () => require("@react-three/fiber/native")),
];

export function GlDiagnostic() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 64 }}>
      <Text selectable style={{ fontSize: 12 }}>
        {results.join("\n\n")}
      </Text>
    </ScrollView>
  );
}
