import type { JointId } from "@/features/anatomy/joints";

export type ResponseOption = {
  value: number;
  label: string;
};

export type Question = {
  id: string;
  text: string;
};

export type Instrument = {
  id: string;
  jointId: JointId;
  name: string;
  simulated: boolean;
  options: readonly ResponseOption[];
  questions: readonly Question[];
};

export type Answers = Record<string, number>;

export type ScoreResult = {
  instrumentId: string;
  jointId: JointId;
  raw: number;
  max: number;
  score: number;
};
