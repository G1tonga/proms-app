import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  topInset?: boolean;
};

export function Screen({ children, footer, topInset = false }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="screen" style={{ paddingTop: topInset ? insets.top : 0 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
      >
        <View className="screen-content">{children}</View>
      </ScrollView>
      {footer ? (
        <View className="screen-footer" style={{ paddingBottom: insets.bottom + 16 }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}
