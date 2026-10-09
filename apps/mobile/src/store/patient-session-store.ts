import { create } from "zustand";

import type { JointId } from "@/features/anatomy/joints";
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
  selectedJointIds: JointId[];
  answers: Partial<Record<JointId, Answers>>;
  submission: Submission | null;
};

type SessionActions = {
  acceptConsent: () => void;
  setDetails: (details: PatientDetails) => void;
  toggleJoint: (jointId: JointId) => void;
  setAnswer: (jointId: JointId, questionId: string, value: number) => void;
  submit: () => void;
  reset: () => void;
};

const initialState: SessionData = {
  consentAcceptedAt: null,
  details: null,
  selectedJointIds: [],
  answers: {},
  submission: null,
};

export const usePatientSession = create<SessionData & SessionActions>((set, get) => ({
  ...initialState,

  acceptConsent: () => set({ consentAcceptedAt: new Date().toISOString() }),

  setDetails: (details) => set({ details }),

  toggleJoint: (jointId) =>
    set((state) => ({
      selectedJointIds: state.selectedJointIds.includes(jointId)
        ? state.selectedJointIds.filter((id) => id !== jointId)
        : [...state.selectedJointIds, jointId],
    })),

  setAnswer: (jointId, questionId, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [jointId]: { ...state.answers[jointId], [questionId]: value },
      },
    })),

  submit: () => {
    const { selectedJointIds, answers } = get();
    const results = selectedJointIds.flatMap((jointId) => {
      const instrument = getInstrumentForJoint(jointId);
      return instrument ? [calculateScore(instrument, answers[jointId] ?? {})] : [];
    });
    set({ submission: { submittedAt: new Date().toISOString(), results } });
  },

  reset: () => set(initialState),
}));
