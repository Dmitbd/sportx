export interface CustomCheckboxProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
};
