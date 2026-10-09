import { Canvas } from "@react-three/fiber/native";
import { useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import {
  DEFAULT_VIEW,
  SkeletonScene,
  type TapPoint,
  type ViewState,
} from "@/features/anatomy/components/skeleton-scene";
import type { SelectionKey } from "@/features/anatomy/joints";
import type { Gender } from "@/features/patient-intake/patient-details";

const MAX_PITCH = 0.5;
const MIN_ZOOM = 2.2;
const MAX_ZOOM = 5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

type SkeletonViewerProps = {
  sex: Gender;
  selected: ReadonlySet<SelectionKey>;
  onToggle: (key: SelectionKey) => void;
};

export function SkeletonViewer({ sex, selected, onToggle }: SkeletonViewerProps) {
  const view = useRef<ViewState>({ ...DEFAULT_VIEW });
  const tap = useRef<TapPoint | null>(null);
  const pinchStartZoom = useRef(DEFAULT_VIEW.zoom);

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .runOnJS(true)
      .minDistance(8)
      .onUpdate((event) => {
        view.current.yaw += event.changeX * 0.012;
        view.current.pitch = clamp(
          view.current.pitch + event.changeY * 0.006,
          -MAX_PITCH,
          MAX_PITCH,
        );
      });

    const pinch = Gesture.Pinch()
      .runOnJS(true)
      .onStart(() => {
        pinchStartZoom.current = view.current.zoom;
      })
      .onUpdate((event) => {
        view.current.zoom = clamp(pinchStartZoom.current / event.scale, MIN_ZOOM, MAX_ZOOM);
      });

    const tapGesture = Gesture.Tap()
      .runOnJS(true)
      .maxDistance(10)
      .onEnd((event, success) => {
        if (success) tap.current = { x: event.x, y: event.y };
      });

    return Gesture.Race(tapGesture, Gesture.Simultaneous(pan, pinch));
  }, []);

  const handleReset = () => {
    view.current = { ...DEFAULT_VIEW };
  };

  return (
    <View className="flex-1 overflow-hidden rounded-3xl border border-border bg-card">
      <GestureDetector gesture={gesture}>
        <View className="flex-1">
          <Canvas style={{ flex: 1 }} camera={{ position: [0, 0, DEFAULT_VIEW.zoom], fov: 35 }}>
            <SkeletonScene
              sex={sex}
              selected={selected}
              view={view}
              tap={tap}
              onToggle={onToggle}
            />
          </Canvas>
        </View>
      </GestureDetector>

      <View className="absolute top-3 right-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset view"
          onPress={handleReset}
          className="min-h-11 items-center justify-center rounded-full border border-border bg-card px-4 active:opacity-80"
        >
          <Text className="font-sans-semibold text-base text-primary">Reset view</Text>
        </Pressable>
      </View>

      <View pointerEvents="none" className="absolute inset-x-0 bottom-3 items-center px-4">
        <Text className="text-center font-sans-medium text-sm text-muted-foreground">
          Drag to turn · Pinch to zoom · Tap a dot to select
        </Text>
      </View>
    </View>
  );
}
