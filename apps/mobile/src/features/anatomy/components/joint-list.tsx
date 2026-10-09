import { ScrollView } from "react-native";

import { ChoiceCard } from "@/components/ui/choice-card";
import {
  JOINTS,
  SIDES,
  selectionKey,
  selectionLabel,
  type SelectionKey,
} from "@/features/anatomy/joints";

type JointListProps = {
  selected: ReadonlySet<SelectionKey>;
  onToggle: (key: SelectionKey) => void;
};

export function JointList({ selected, onToggle }: JointListProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {JOINTS.flatMap((joint) =>
        SIDES.map((side) => {
          const key = selectionKey(joint.id, side);
          return (
            <ChoiceCard
              key={key}
              mode="checkbox"
              label={selectionLabel(joint.id, side)}
              description={joint.description}
              selected={selected.has(key)}
              onPress={() => onToggle(key)}
            />
          );
        }),
      )}
    </ScrollView>
  );
}
