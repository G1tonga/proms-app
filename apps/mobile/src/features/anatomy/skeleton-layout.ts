import {
  JOINT_IDS,
  SIDES,
  selectionKey,
  type JointId,
  type SelectionKey,
  type Side,
} from "@/features/anatomy/joints";
import type { Gender } from "@/features/patient-intake/patient-details";

export type Vec3 = [number, number, number];

export type JointPoint = {
  key: SelectionKey;
  position: Vec3;
};

export type Segment = {
  id: string;
  from: Vec3;
  to: Vec3;
  radius: number;
};

export type Rib = {
  y: number;
  rx: number;
  rz: number;
};

export type SkeletonLayout = {
  joints: JointPoint[];
  segments: Segment[];
  ribs: Rib[];
  head: { position: Vec3; radius: number };
  centerY: number;
};

type Build = {
  scale: number;
  shoulderX: number;
  elbowX: number;
  wristX: number;
  hipX: number;
  legX: number;
  chest: number;
  headRadius: number;
};

const BUILDS: Record<Gender, Build> = {
  male: {
    scale: 1,
    shoulderX: 0.2,
    elbowX: 0.27,
    wristX: 0.3,
    hipX: 0.09,
    legX: 0.1,
    chest: 1,
    headRadius: 0.105,
  },
  female: {
    scale: 0.94,
    shoulderX: 0.17,
    elbowX: 0.23,
    wristX: 0.26,
    hipX: 0.1,
    legX: 0.095,
    chest: 0.88,
    headRadius: 0.098,
  },
};

const HEIGHTS: Record<JointId, number> = {
  shoulder: 1.45,
  elbow: 1.17,
  wrist: 0.9,
  hip: 0.92,
  knee: 0.5,
  ankle: 0.08,
};

const RIB_LEVELS = [
  { y: 1.38, half: 0.12 },
  { y: 1.32, half: 0.145 },
  { y: 1.26, half: 0.15 },
  { y: 1.2, half: 0.145 },
  { y: 1.14, half: 0.125 },
];

const SIDE_SIGN: Record<Side, number> = { left: 1, right: -1 };

function halfWidth(jointId: JointId, build: Build): number {
  switch (jointId) {
    case "shoulder":
      return build.shoulderX;
    case "elbow":
      return build.elbowX;
    case "wrist":
      return build.wristX;
    case "hip":
      return build.hipX;
    case "knee":
    case "ankle":
      return build.legX;
  }
}

export function buildSkeletonLayout(sex: Gender): SkeletonLayout {
  const build = BUILDS[sex];
  const y = (value: number) => value * build.scale;
  const at = (jointId: JointId, side: Side): Vec3 => [
    SIDE_SIGN[side] * halfWidth(jointId, build),
    y(HEIGHTS[jointId]),
    0,
  ];

  const joints: JointPoint[] = JOINT_IDS.flatMap((jointId) =>
    SIDES.map((side) => ({ key: selectionKey(jointId, side), position: at(jointId, side) })),
  );

  const limbs = SIDES.flatMap((side): Segment[] => {
    const ankle = at("ankle", side);
    return [
      { id: `humerus-${side}`, from: at("shoulder", side), to: at("elbow", side), radius: 0.022 },
      { id: `forearm-${side}`, from: at("elbow", side), to: at("wrist", side), radius: 0.018 },
      { id: `femur-${side}`, from: at("hip", side), to: at("knee", side), radius: 0.03 },
      { id: `tibia-${side}`, from: at("knee", side), to: ankle, radius: 0.024 },
      { id: `foot-${side}`, from: ankle, to: [ankle[0], y(0.03), 0.13], radius: 0.02 },
    ];
  });

  const trunk: Segment[] = [
    { id: "spine", from: [0, y(0.97), 0], to: [0, y(1.52), 0], radius: 0.025 },
    { id: "clavicles", from: at("shoulder", "right"), to: at("shoulder", "left"), radius: 0.015 },
    { id: "pelvis", from: at("hip", "right"), to: at("hip", "left"), radius: 0.04 },
  ];

  const ribs: Rib[] = RIB_LEVELS.map((level) => ({
    y: y(level.y),
    rx: level.half * build.chest,
    rz: level.half * build.chest * 0.65,
  }));

  return {
    joints,
    segments: [...limbs, ...trunk],
    ribs,
    head: { position: [0, y(1.66), 0], radius: build.headRadius },
    centerY: y(0.9),
  };
}
