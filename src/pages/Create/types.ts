type EquipmentUnit = [count: number, weight: number]

interface EquipmentItem {
  name: string;
  units: EquipmentUnit[];
}

type MuscleSubGroups = {
  name: string;
  parts: string[];
}

type MuscleGroups = {
  name: string;
  groups: MuscleSubGroups[];
}

export type {
  EquipmentUnit,
  EquipmentItem,
  MuscleGroups
};
