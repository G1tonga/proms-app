import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Notice } from "@/components/ui/notice";
import { Screen } from "@/components/ui/screen";
import { parseSelectionKey, selectionKey, selectionLabel } from "@/features/anatomy/joints";
import { getInstrumentForJoint } from "@/features/instruments/data/mock-instruments";
import { countAnswered, isComplete } from "@/features/instruments/scoring";
import { usePatientSession } from "@/store/patient-session-store";

export default function QuestionnaireScreen() {
  const router = useRouter();
  const { selection } = useLocalSearchParams<{ selection: string }>();
  const details = usePatientSession((state) => state.details);
  const selectedKeys = usePatientSession((state) => state.selectedKeys);
  const answers = usePatientSession((state) => state.answers);
  const setAnswer = usePatientSession((state) => state.setAnswer);
  const submit = usePatientSession((state) => state.submit);

  if (!details) return <Redirect href="/details" />;

  const parsed = parseSelectionKey(selection);
  const instrument = parsed ? getInstrumentForJoint(parsed.jointId) : undefined;

  if (!parsed || !instrument) return <Redirect href="/joints" />;

  const key = selectionKey(parsed.jointId, parsed.side);
  if (!selectedKeys.includes(key)) return <Redirect href="/joints" />;

  const title = selectionLabel(parsed.jointId, parsed.side);
  const keyAnswers = answers[key] ?? {};
  const answeredCount = countAnswered(instrument, keyAnswers);
  const complete = isComplete(instrument, keyAnswers);
  const position = selectedKeys.indexOf(key);
  const nextKey = selectedKeys[position + 1];
  const progress = (answeredCount / instrument.questions.length) * 100;

  const handleNext = () => {
    if (nextKey) {
      router.replace({ pathname: "/questionnaire/[selection]", params: { selection: nextKey } });
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
            label={nextKey ? "Next joint" : "Submit"}
            disabled={!complete}
            onPress={handleNext}
          />
        </View>
      }
    >
      <View className="gap-2">
        <Text className="title">{title}</Text>
        {selectedKeys.length > 1 ? (
          <Text className="helper-text">
            Joint {position + 1} of {selectedKeys.length}
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
                selected={keyAnswers[question.id] === option.value}
                onPress={() => setAnswer(key, question.id, option.value)}
              />
            ))}
          </View>
        </View>
      ))}
    </Screen>
  );
}
