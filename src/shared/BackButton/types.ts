import type { ButtonVariant } from "node_modules/@chakra-ui/react/dist/types/styled-system/generated/recipes.gen";

export interface BackButtonProps {
  to?: string;
  ariaLabel?: string;
  variant?: ButtonVariant['variant'];
  size?: ButtonVariant['size'];
}
