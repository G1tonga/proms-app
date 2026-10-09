import type { Side } from "@/features/anatomy/joints";
import type { Answers, Instrument, ScoreResult } from "@/features/instruments/types";

export function countAnswered(instrument: Instrument, answers: Answers): number {
  return instrument.questions.filter((question) => answers[question.id] !== undefined).length;
}

export function isComplete(instrument: Instrument, answers: Answers): boolean {
  return countAnswered(instrument, answers) === instrument.questions.length;
}

export function calculateScore(instrument: Instrument, answers: Answers, side: Side): ScoreResult {
  if (!isComplete(instrument, answers)) {
    throw new Error(`All questions must be answered for ${instrument.id}`);
  }

  const maxPerQuestion = Math.max(...instrument.options.map((option) => option.value));
  const max = maxPerQuestion * instrument.questions.length;
  const raw = instrument.questions.reduce((total, question) => total + answers[question.id], 0);
  const score = Math.round((1 - raw / max) * 100);

  return { instrumentId: instrument.id, jointId: instrument.jointId, side, raw, max, score };
}
