import { Text, View } from "react-native";

type NoticeProps = {
  message: string;
};

export function Notice({ message }: NoticeProps) {
  return (
    <View accessibilityRole="alert" className="notice">
      <Text className="notice-text">{message}</Text>
    </View>
  );
}
