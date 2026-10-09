import { useFrame, useThree } from "@react-three/fiber/native";
import { type RefObject, useMemo, useRef } from "react";
import { type Group, Quaternion, Raycaster, Vector2, Vector3 } from "three";

import type { SelectionKey } from "@/features/anatomy/joints";
import { buildSkeletonLayout, type Segment } from "@/features/anatomy/skeleton-layout";
import type { Gender } from "@/features/patient-intake/patient-details";

export type ViewState = {
  yaw: number;
  pitch: number;
  zoom: number;
};

export type TapPoint = {
  x: number;
  y: number;
};

export const DEFAULT_VIEW: ViewState = { yaw: 0, pitch: 0, zoom: 3.4 };

const BONE_COLOR = "#e9e2cf";
const IDLE_COLOR = "#0f9b8e";
const SELECTED_COLOR = "#f59e0b";
const PICK_RADIUS = 0.1;
const DEPTH_BIAS = 0.15;
const UP = new Vector3(0, 1, 0);

function Bone({ segment }: { segment: Segment }) {
  const { position, quaternion, length } = useMemo(() => {
    const from = new Vector3(...segment.from);
    const to = new Vector3(...segment.to);
    const direction = to.clone().sub(from);
    const boneLength = direction.length();
    return {
      position: from.clone().add(to).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(UP, direction.normalize()),
      length: boneLength,
    };
  }, [segment]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <capsuleGeometry
        args={[segment.radius, Math.max(length - segment.radius * 2, 0.001), 4, 12]}
      />
      <meshStandardMaterial color={BONE_COLOR} roughness={0.6} />
    </mesh>
  );
}

type SkeletonSceneProps = {
  sex: Gender;
  selected: ReadonlySet<SelectionKey>;
  view: RefObject<ViewState>;
  tap: RefObject<TapPoint | null>;
  onToggle: (key: SelectionKey) => void;
};

export function SkeletonScene({ sex, selected, view, tap, onToggle }: SkeletonSceneProps) {
  const layout = useMemo(() => buildSkeletonLayout(sex), [sex]);
  const { camera, size } = useThree();
  const turntable = useRef<Group>(null);
  const model = useRef<Group>(null);
  const scratch = useMemo(
    () => ({
      raycaster: new Raycaster(),
      ndc: new Vector2(),
      world: new Vector3(),
      local: new Vector3(),
    }),
    [],
  );

  useFrame(() => {
    const turntableGroup = turntable.current;
    const modelGroup = model.current;
    if (!turntableGroup || !modelGroup) return;

    turntableGroup.rotation.y = view.current.yaw;
    turntableGroup.rotation.x = view.current.pitch;
    camera.position.set(0, 0, view.current.zoom);
    camera.lookAt(0, 0, 0);

    const point = tap.current;
    if (!point) return;
    tap.current = null;

    camera.updateMatrixWorld();
    modelGroup.updateWorldMatrix(true, true);
    scratch.ndc.set((point.x / size.width) * 2 - 1, -(point.y / size.height) * 2 + 1);
    scratch.raycaster.setFromCamera(scratch.ndc, camera);

    let best: { key: SelectionKey; score: number } | null = null;
    for (const joint of layout.joints) {
      scratch.world.set(...joint.position).applyMatrix4(modelGroup.matrixWorld);
      const distance = scratch.raycaster.ray.distanceToPoint(scratch.world);
      if (distance > PICK_RADIUS) continue;
      const depth = scratch.local.copy(scratch.world).applyMatrix4(camera.matrixWorldInverse).z;
      const score = distance - DEPTH_BIAS * depth;
      if (!best || score < best.score) best = { key: joint.key, score };
    }

    if (best) onToggle(best.key);
  });

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[2, 3, 4]} intensity={2.2} />
      <group ref={turntable}>
        <group ref={model} position={[0, -layout.centerY, 0]}>
          <mesh position={layout.head.position}>
            <sphereGeometry args={[layout.head.radius, 24, 24]} />
            <meshStandardMaterial color={BONE_COLOR} roughness={0.6} />
          </mesh>

          {layout.segments.map((segment) => (
            <Bone key={segment.id} segment={segment} />
          ))}

          {layout.ribs.map((rib) => (
            <mesh
              key={rib.y}
              position={[0, rib.y, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[rib.rx, rib.rz, rib.rx]}
            >
              <torusGeometry args={[1, 0.09, 8, 28]} />
              <meshStandardMaterial color={BONE_COLOR} roughness={0.6} />
            </mesh>
          ))}

          {layout.joints.map((joint) => {
            const isSelected = selected.has(joint.key);
            const color = isSelected ? SELECTED_COLOR : IDLE_COLOR;
            return (
              <mesh key={joint.key} position={joint.position} scale={isSelected ? 1.35 : 1}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={isSelected ? 0.9 : 0.5}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </>
  );
}
