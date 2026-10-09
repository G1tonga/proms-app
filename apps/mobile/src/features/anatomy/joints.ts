export const JOINT_IDS = ["shoulder", "elbow", "wrist", "hip", "knee", "ankle"] as const;

export type JointId = (typeof JOINT_IDS)[number];

export const SIDES = ["left", "right"] as const;

export type Side = (typeof SIDES)[number];

export type SelectionKey = `${JointId}-${Side}`;

export type Joint = {
  id: JointId;
  label: string;
  description: string;
};

export const JOINTS: readonly Joint[] = [
  { id: "shoulder", label: "Shoulder", description: "Where your arm meets your body" },
  { id: "elbow", label: "Elbow", description: "The bend in the middle of your arm" },
  { id: "wrist", label: "Wrist", description: "Where your hand meets your arm" },
  { id: "hip", label: "Hip", description: "Where your leg meets your body" },
  { id: "knee", label: "Knee", description: "The bend in the middle of your leg" },
  { id: "ankle", label: "Ankle", description: "Where your foot meets your leg" },
];

export function getJoint(id: string): Joint | undefined {
  return JOINTS.find((joint) => joint.id === id);
}

export function selectionKey(jointId: JointId, side: Side): SelectionKey {
  return `${jointId}-${side}`;
}

export function parseSelectionKey(key: string): { jointId: JointId; side: Side } | undefined {
  const [jointPart, sidePart] = key.split("-");
  const joint = getJoint(jointPart);
  const side = SIDES.find((candidate) => candidate === sidePart);
  return joint && side ? { jointId: joint.id, side } : undefined;
}

export function selectionLabel(jointId: JointId, side: Side): string {
  const joint = getJoint(jointId);
  const sideLabel = side === "left" ? "Left" : "Right";
  return `${sideLabel} ${(joint?.label ?? jointId).toLowerCase()}`;
}
