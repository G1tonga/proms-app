import { Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({ label, onPress, variant = "primary", disabled = false }: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`${isPrimary ? "btn-primary" : "btn-secondary"} active:opacity-80 ${
        disabled ? "btn-disabled" : ""
      }`}
    >
      <Text className={isPrimary ? "btn-primary-text" : "btn-secondary-text"}>{label}</Text>
    </Pressable>
  );
}
