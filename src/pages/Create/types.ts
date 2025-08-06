export type EquipmentUnit = [count: number, weight: number];

export interface EquipmentItem {
  name: string;
  units: EquipmentUnit[];
}
