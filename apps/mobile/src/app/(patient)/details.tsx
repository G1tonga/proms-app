import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Screen } from "@/components/ui/screen";
import { TextField } from "@/components/ui/text-field";
import { GENDER_OPTIONS, type Gender } from "@/features/patient-intake/patient-details";
import { type DetailsErrors, validateDetails } from "@/features/patient-intake/validation";
import { usePatientSession } from "@/store/patient-session-store";

export default function DetailsScreen() {
  const router = useRouter();
  const consentAcceptedAt = usePatientSession((state) => state.consentAcceptedAt);
  const savedDetails = usePatientSession((state) => state.details);
  const setDetails = usePatientSession((state) => state.setDetails);

  const [patientId, setPatientId] = useState(savedDetails?.patientId ?? "");
  const [age, setAge] = useState(savedDetails ? String(savedDetails.age) : "");
  const [gender, setGender] = useState<Gender | null>(savedDetails?.gender ?? null);
  const [errors, setErrors] = useState<DetailsErrors>({});

  if (!consentAcceptedAt) return <Redirect href="/consent" />;

  const handleContinue = () => {
    const nextErrors = validateDetails({ patientId, age, gender });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || gender === null) return;

    setDetails({ patientId: patientId.trim(), age: Number(age), gender });
    router.push("/joints");
  };

  return (
    <Screen footer={<Button label="Continue" onPress={handleContinue} />}>
      <View className="gap-2">
        <Text className="title">Your details</Text>
        <Text className="subtitle">Please fill in all three fields.</Text>
      </View>

      <TextField
        label="Patient ID"
        value={patientId}
        onChangeText={setPatientId}
        error={errors.patientId}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={30}
      />

      <TextField
        label="Age (years)"
        value={age}
        onChangeText={setAge}
        error={errors.age}
        keyboardType="number-pad"
        maxLength={3}
      />

      <View className="field">
        <Text className="field-label">Gender</Text>
        {GENDER_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            selected={gender === option.value}
            onPress={() => setGender(option.value)}
          />
        ))}
        {errors.gender ? <Text className="field-error">{errors.gender}</Text> : null}
      </View>
    </Screen>
  );
}
