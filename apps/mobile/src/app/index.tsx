import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="screen items-center justify-center gap-6 px-6">
      <Text className="title">PROMs</Text>
      <Text className="subtitle text-center">Patient Recovery Outcome Measures</Text>
      <Pressable className="btn-primary w-full">
        <Text className="btn-primary-text">Get started</Text>
      </Pressable>
    </View>
  );
}