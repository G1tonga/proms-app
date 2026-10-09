import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Notice } from "@/components/ui/notice";
import { Screen } from "@/components/ui/screen";
import { getJoint } from "@/features/anatomy/joints";
import { getInstrumentForJoint } from "@/features/instruments/data/mock-instruments";
import { countAnswered, isComplete } from "@/features/instruments/scoring";
import { usePatientSession } from "@/store/patient-session-store";

export default function QuestionnaireScreen() {
  const router = useRouter();
  const { jointId } = useLocalSearchParams<{ jointId: string }>();
  const details = usePatientSession((state) => state.details);
  const selectedJointIds = usePatientSession((state) => state.selectedJointIds);
  const answers = usePatientSession((state) => state.answers);
  const setAnswer = usePatientSession((state) => state.setAnswer);
  const submit = usePatientSession((state) => state.submit);

  if (!details) return <Redirect href="/details" />;

  const joint = getJoint(jointId);
  const instrument = joint ? getInstrumentForJoint(joint.id) : undefined;

  if (!joint || !instrument || !selectedJointIds.includes(joint.id)) {
    return <Redirect href="/joints" />;
  }

  const jointAnswers = answers[joint.id] ?? {};
  const answeredCount = countAnswered(instrument, jointAnswers);
  const complete = isComplete(instrument, jointAnswers);
  const position = selectedJointIds.indexOf(joint.id);
  const nextJointId = selectedJointIds[position + 1];
  const progress = (answeredCount / instrument.questions.length) * 100;

  const handleNext = () => {
    if (nextJointId) {
      router.replace({ pathname: "/questionnaire/[jointId]", params: { jointId: nextJointId } });
      return;
    }
    submit();
    router.replace("/receipt");
  };

  return (
    <Screen
      footer={
        <View className="gap-2">
          {complete ? null : (
            <Text className="helper-text text-center">Answer every question to continue.</Text>
          )}
          <Button
            label={nextJointId ? "Next joint" : "Submit"}
            disabled={!complete}
            onPress={handleNext}
          />
        </View>
      }
    >
      <View className="gap-2">
        <Text className="title">{joint.label}</Text>
        {selectedJointIds.length > 1 ? (
          <Text className="helper-text">
            Joint {position + 1} of {selectedJointIds.length}
          </Text>
        ) : null}
        <Text className="subtitle">How much difficulty do you have with each of these?</Text>
      </View>

      {instrument.simulated ? (
        <Notice message="Practice questions only. This is not a real clinical score." />
      ) : null}

      <View className="gap-2">
        <Text className="helper-text">
          {answeredCount} of {instrument.questions.length} answered
        </Text>
        <View className="progress-track">
          <View className="progress-fill" style={{ width: `${progress}%` }} />
        </View>
      </View>

      {instrument.questions.map((question, index) => (
        <View key={question.id} className="card">
          <Text className="question-title">
            {index + 1}. {question.text}
          </Text>
          <View className="gap-2">
            {instrument.options.map((option) => (
              <ChoiceCard
                key={option.value}
                label={option.label}
                selected={jointAnswers[question.id] === option.value}
                onPress={() => setAnswer(joint.id, question.id, option.value)}
              />
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
