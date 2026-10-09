import { Pressable, Text, View } from "react-native";

type ChoiceCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
  mode?: "radio" | "checkbox";
};

export function ChoiceCard({
  label,
  selected,
  onPress,
  description,
  mode = "radio",
}: ChoiceCardProps) {
  const isCheckbox = mode === "checkbox";

  let mark = null;
  if (selected) {
    mark = isCheckbox ? <Text className="choice-check">✓</Text> : <View className="choice-dot" />;
  }

  return (
    <Pressable
      accessibilityRole={isCheckbox ? "checkbox" : "radio"}
      accessibilityState={isCheckbox ? { checked: selected } : { selected }}
      onPress={onPress}
      className={`choice active:opacity-80 ${selected ? "choice-selected" : ""}`}
    >
      <View
        className={`choice-mark ${isCheckbox ? "choice-mark-square" : ""} ${
          selected ? "choice-mark-selected" : ""
        }`}
      >
        {mark}
      </View>
      <View className="flex-1">
        <Text className={selected ? "choice-text choice-text-selected" : "choice-text"}>
          {label}
        </Text>
        {description ? <Text className="choice-description">{description}</Text> : null}
      </View>
    </Pressable>
  );
}
