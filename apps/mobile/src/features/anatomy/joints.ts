export const JOINT_IDS = ["shoulder", "elbow", "wrist", "hip", "knee", "ankle"] as const;

export type JointId = (typeof JOINT_IDS)[number];

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
