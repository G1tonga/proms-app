import type { JointId } from "@/features/anatomy/joints";
import type { Instrument } from "@/features/instruments/types";

const MOCK_SCALE: Instrument["options"] = [
  { value: 0, label: "No difficulty" },
  { value: 1, label: "Mild difficulty" },
  { value: 2, label: "Moderate difficulty" },
  { value: 3, label: "Severe difficulty" },
  { value: 4, label: "Unable to do" },
];

function createMockInstrument(
  jointId: JointId,
  name: string,
  questions: readonly string[],
): Instrument {
  return {
    id: `mock-${jointId}`,
    jointId,
    name,
    simulated: true,
    options: MOCK_SCALE,
    questions: questions.map((text, index) => ({ id: `${jointId}-q${index + 1}`, text })),
  };
}

export const MOCK_INSTRUMENTS: readonly Instrument[] = [
  createMockInstrument("shoulder", "Practice shoulder questions", [
    "Lifting a cup to your mouth",
    "Combing or brushing your hair",
    "Reaching a high shelf",
    "Putting on a shirt or coat",
    "Carrying a bag of groceries",
    "Sleeping on the affected side",
  ]),
  createMockInstrument("elbow", "Practice elbow questions", [
    "Opening a jar",
    "Turning a door handle",
    "Carrying a full plate",
    "Pushing yourself up from a chair",
    "Writing or typing",
    "Straightening your arm fully",
  ]),
  createMockInstrument("wrist", "Practice wrist questions", [
    "Turning a key in a lock",
    "Wringing out a cloth",
    "Using a phone or keyboard",
    "Pouring a drink from a bottle",
    "Lifting a pan",
    "Gripping a pen",
  ]),
  createMockInstrument("hip", "Practice hip questions", [
    "Walking on flat ground",
    "Climbing stairs",
    "Getting in and out of a car",
    "Putting on socks or shoes",
    "Standing for 15 minutes",
    "Getting up from a low chair",
  ]),
  createMockInstrument("knee", "Practice knee questions", [
    "Walking on flat ground",
    "Going up and down stairs",
    "Kneeling",
    "Squatting",
    "Getting out of a chair",
    "Standing for 15 minutes",
  ]),
  createMockInstrument("ankle", "Practice ankle questions", [
    "Walking on uneven ground",
    "Standing on tiptoe",
    "Walking up a slope",
    "Going down stairs",
    "Walking for 15 minutes",
    "Running or jogging a short distance",
  ]),
];

export function getInstrumentForJoint(jointId: JointId): Instrument | undefined {
  return MOCK_INSTRUMENTS.find((instrument) => instrument.jointId === jointId);
}
