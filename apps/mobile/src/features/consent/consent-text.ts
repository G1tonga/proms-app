export const CONSENT_TITLE = "Your privacy and consent";

export const CONSENT_DRAFT_NOTICE =
  "Draft wording only. The final text must be approved before real patients use this app.";

export const CONSENT_SECTIONS: readonly { heading: string; body: string }[] = [
  {
    heading: "What this app is for",
    body: "This app lets you record how your injured joint is recovering by answering short questions. Your care team can use your answers to follow your progress over time.",
  },
  {
    heading: "What we ask",
    body: "Your Patient ID, age and gender, the joint you are recovering, and your answers to the questions.",
  },
  {
    heading: "Your privacy",
    body: "Your information is kept confidential and is only used for this pilot and your care.",
  },
  {
    heading: "Your choice",
    body: "Taking part is voluntary. If you do not agree, the app will close and nothing will be recorded.",
  },
];
