import { create } from "zustand";

import { parseSelectionKey, type SelectionKey } from "@/features/anatomy/joints";
import { getInstrumentForJoint } from "@/features/instruments/data/mock-instruments";
import { calculateScore } from "@/features/instruments/scoring";
import type { Answers, ScoreResult } from "@/features/instruments/types";
import type { PatientDetails } from "@/features/patient-intake/patient-details";

type Submission = {
  submittedAt: string;
  results: ScoreResult[];
};

type SessionData = {
  consentAcceptedAt: string | null;
  details: PatientDetails | null;
  selectedKeys: SelectionKey[];
  answers: Partial<Record<SelectionKey, Answers>>;
  submission: Submission | null;
};

type SessionActions = {
  acceptConsent: () => void;
  setDetails: (details: PatientDetails) => void;
  toggleJoint: (key: SelectionKey) => void;
  setAnswer: (key: SelectionKey, questionId: string, value: number) => void;
  submit: () => void;
  reset: () => void;
};

const initialState: SessionData = {
  consentAcceptedAt: null,
  details: null,
  selectedKeys: [],
  answers: {},
  submission: null,
};

export const usePatientSession = create<SessionData & SessionActions>((set, get) => ({
  ...initialState,

  acceptConsent: () => set({ consentAcceptedAt: new Date().toISOString() }),

  setDetails: (details) => set({ details }),

  toggleJoint: (key) =>
    set((state) => ({
      selectedKeys: state.selectedKeys.includes(key)
        ? state.selectedKeys.filter((selectedKey) => selectedKey !== key)
        : [...state.selectedKeys, key],
    })),

  setAnswer: (key, questionId, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [key]: { ...state.answers[key], [questionId]: value },
      },
    })),

  submit: () => {
    const { selectedKeys, answers } = get();
    const results = selectedKeys.flatMap((key) => {
      const selection = parseSelectionKey(key);
      const instrument = selection ? getInstrumentForJoint(selection.jointId) : undefined;
      return selection && instrument
        ? [calculateScore(instrument, answers[key] ?? {}, selection.side)]
        : [];
    });
    set({ submission: { submittedAt: new Date().toISOString(), results } });
  },

  reset: () => set(initialState),
}));
