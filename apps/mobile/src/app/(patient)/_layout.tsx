import { Stack } from "expo-router";

import { colors } from "@/theme/colors";

export default function PatientLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontFamily: "sans-semibold", color: colors.foreground },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="consent" options={{ title: "Consent" }} />
      <Stack.Screen name="details" options={{ title: "Your details" }} />
      <Stack.Screen name="joints" options={{ title: "Select joint" }} />
      <Stack.Screen name="questionnaire/[jointId]" options={{ title: "Questions" }} />
      <Stack.Screen
        name="receipt"
        options={{ title: "Submitted", headerBackVisible: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
