import { Redirect, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Screen } from "@/components/ui/screen";
import { JOINTS } from "@/features/anatomy/joints";
import { usePatientSession } from "@/store/patient-session-store";

export default function JointsScreen() {
  const router = useRouter();
  const details = usePatientSession((state) => state.details);
  const selectedJointIds = usePatientSession((state) => state.selectedJointIds);
  const toggleJoint = usePatientSession((state) => state.toggleJoint);

  if (!details) return <Redirect href="/details" />;

  const handleContinue = () => {
    router.push({
      pathname: "/questionnaire/[jointId]",
      params: { jointId: selectedJointIds[0] },
    });
  };

  return (
    <Screen
      footer={
        <Button
          label="Continue"
          disabled={selectedJointIds.length === 0}
          onPress={handleContinue}
        />
      }
    >
      <View className="gap-2">
        <Text className="title">Which joint is injured?</Text>
        <Text className="subtitle">Tap every joint you want to report on.</Text>
      </View>

      <View className="gap-3">
        {JOINTS.map((joint) => (
          <ChoiceCard
            key={joint.id}
            mode="checkbox"
            label={joint.label}
            description={joint.description}
            selected={selectedJointIds.includes(joint.id)}
            onPress={() => toggleJoint(joint.id)}
          />
        ))}
      </View>
    </Screen>
  );
}
