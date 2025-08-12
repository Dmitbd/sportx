import { IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import type { BackButtonProps } from "./types";

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
