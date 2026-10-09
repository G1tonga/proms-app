import { useRouter } from "expo-router";
import { BackHandler, Platform, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Screen } from "@/components/ui/screen";
import {
  CONSENT_DRAFT_NOTICE,
  CONSENT_SECTIONS,
  CONSENT_TITLE,
} from "@/features/consent/consent-text";
import { usePatientSession } from "@/store/patient-session-store";

export default function ConsentScreen() {
  const router = useRouter();
  const acceptConsent = usePatientSession((state) => state.acceptConsent);

  const handleAccept = () => {
    acceptConsent();
    router.push("/details");
  };

  const handleDecline = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      router.replace("/");
    }
  };

  return (
    <Screen
      footer={
        <View className="gap-3">
          <Button label="I agree" onPress={handleAccept} />
          <Button label="I do not agree" variant="secondary" onPress={handleDecline} />
        </View>
      }
    >
      <Text className="title">{CONSENT_TITLE}</Text>
      <Notice message={CONSENT_DRAFT_NOTICE} />
      {CONSENT_SECTIONS.map((section) => (
        <View key={section.heading} className="gap-1">
          <Text className="question-title">{section.heading}</Text>
          <Text className="body-text">{section.body}</Text>
        </View>
      ))}
    </Screen>
  );
}
