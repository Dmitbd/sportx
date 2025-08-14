type EquipmentUnit = [count: number, weight: number]

interface EquipmentItem {
  name: string;
  units: EquipmentUnit[];
}

type MusclePart = string;

type MuscleSubGroup = {
  [muscleName: string]: MusclePart[];
}

type MuscleGroup = {
  [groupName: string]: MuscleSubGroup;
}

export type {
  EquipmentUnit,
  EquipmentItem,
  MuscleGroup
};
