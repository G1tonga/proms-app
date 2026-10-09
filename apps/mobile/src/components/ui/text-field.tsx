import { Text, TextInput, type TextInputProps, View } from "react-native";

import { colors } from "@/theme/colors";

type TextFieldProps = Pick<
  TextInputProps,
  "autoCapitalize" | "autoCorrect" | "keyboardType" | "maxLength" | "placeholder"
> & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
};

export function TextField({ label, value, onChangeText, error, ...inputProps }: TextFieldProps) {
  return (
    <View className="field">
      <Text className="field-label">{label}</Text>
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        className={error ? "input input-error" : "input"}
        onChangeText={onChangeText}
        placeholderTextColor={colors.mutedForeground}
        value={value}
      />
      {error ? <Text className="field-error">{error}</Text> : null}
    </View>
  );
}
