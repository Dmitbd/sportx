import { IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import type { ButtonVariant } from "node_modules/@chakra-ui/react/dist/types/styled-system/generated/recipes.gen";

interface BackButtonProps {
  to?: string;
  ariaLabel?: string;
  variant?: ButtonVariant['variant'];
  size?: ButtonVariant['size'];
}

/**
 * @description Переиспользуемый компонент кнопки "Назад" с иконкой
 * @param to - путь для навигации (по умолчанию '/workouts')
 * @param ariaLabel - текст для screen readers
 * @param variant - вариант кнопки
 * @param size - размер кнопки
 * @returns Компонент кнопки
 */
export const BackButton = ({
  to = '/workouts',
  ariaLabel = 'Назад',
  variant = 'plain',
  size = 'md',
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <IconButton
      aria-label={ariaLabel}
      variant={variant}
      size={size}
      onClick={handleBack}
    >
      <GoChevronLeft />
    </IconButton>
  );
};
