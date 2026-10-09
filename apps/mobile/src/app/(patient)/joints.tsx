import { Redirect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Screen } from "@/components/ui/screen";
import { JointList } from "@/features/anatomy/components/joint-list";
import { SkeletonViewer } from "@/features/anatomy/components/skeleton-viewer";
import { parseSelectionKey, selectionLabel } from "@/features/anatomy/joints";
import { usePatientSession } from "@/store/patient-session-store";

type Mode = "model" | "list";

const MODES: readonly { value: Mode; label: string }[] = [
  { value: "model", label: "Body model" },
  { value: "list", label: "List" },
];

export default function JointsScreen() {
  const router = useRouter();
  const details = usePatientSession((state) => state.details);
  const selectedKeys = usePatientSession((state) => state.selectedKeys);
  const toggleJoint = usePatientSession((state) => state.toggleJoint);
  const [mode, setMode] = useState<Mode>("model");
  const selected = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  if (!details) return <Redirect href="/details" />;

  const handleContinue = () => {
    const [first] = selectedKeys;
    if (!first) return;
    router.push({ pathname: "/questionnaire/[selection]", params: { selection: first } });
  };

  return (
    <Screen
      scrollable={false}
      footer={
        <Button label="Continue" disabled={selectedKeys.length === 0} onPress={handleContinue} />
      }
    >
      <View className="gap-1">
        <Text className="title">Select your injured joint</Text>
        <Text className="subtitle">
          {mode === "model"
            ? "Turn the body and tap each joint you are recovering from."
            : "Tick each joint you are recovering from."}
        </Text>
      </View>

      <View className="flex-row rounded-2xl bg-muted p-1">
        {MODES.map((option) => {
          const active = mode === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setMode(option.value)}
              className={`min-h-11 flex-1 items-center justify-center rounded-xl ${
                active ? "bg-card" : ""
              }`}
            >
              <Text
                className={`font-sans-semibold text-base ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {mode === "model" ? (
        <SkeletonViewer sex={details.gender} selected={selected} onToggle={toggleJoint} />
      ) : (
        <JointList selected={selected} onToggle={toggleJoint} />
      )}

      {selectedKeys.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {selectedKeys.map((key) => {
            const selection = parseSelectionKey(key);
            if (!selection) return null;
            const label = selectionLabel(selection.jointId, selection.side);
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${label}`}
                onPress={() => toggleJoint(key)}
                className="min-h-11 flex-row items-center gap-2 rounded-full bg-primary px-4 active:opacity-80"
              >
                <Text className="font-sans-semibold text-base text-primary-foreground">
                  {label}
                </Text>
                <Text className="font-sans-bold text-base text-primary-foreground">✕</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </Screen>
  );
}
