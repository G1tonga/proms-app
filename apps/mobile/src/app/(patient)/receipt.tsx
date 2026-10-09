import { Redirect, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Screen } from "@/components/ui/screen";
import { selectionLabel } from "@/features/anatomy/joints";
import { usePatientSession } from "@/store/patient-session-store";

export default function ReceiptScreen() {
  const router = useRouter();
  const submission = usePatientSession((state) => state.submission);
  const reset = usePatientSession((state) => state.reset);

  if (!submission) return <Redirect href="/" />;

  const handleDone = () => {
    router.replace("/");
    reset();
  };

  return (
    <Screen footer={<Button label="Done" onPress={handleDone} />}>
      <View className="gap-2">
        <Text className="title">Thank you</Text>
        <Text className="subtitle">Your answers have been recorded.</Text>
        <Text className="helper-text">
          Submitted {new Date(submission.submittedAt).toLocaleString()}
        </Text>
      </View>

      <Notice message="Prototype only: nothing was sent or saved. The scores below are for testing and may not be shown to patients in the final app." />

      {submission.results.map((result) => (
        <View key={`${result.instrumentId}-${result.side}`} className="card">
          <Text className="question-title">{selectionLabel(result.jointId, result.side)}</Text>
          <Text className="score-value">{result.score} / 100</Text>
          <Text className="helper-text">
            Raw {result.raw} of {result.max} (simulated)
          </Text>
        </View>
      ))}
    </Screen>
  );
}
