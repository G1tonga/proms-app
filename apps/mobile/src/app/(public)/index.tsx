import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen
      topInset
      footer={<Button label="Get started" onPress={() => router.push("/consent")} />}
    >
      <View className="flex-1 justify-center gap-4">
        <Text className="title">Welcome</Text>
        <Text className="subtitle">
          Track your recovery by answering a few short questions about your injured joint. It only
          takes a few minutes.
        </Text>
      </View>
    </Screen>
  );
}
