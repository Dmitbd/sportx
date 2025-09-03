import { IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import type { BackButtonProps } from "./types";
import type { FC } from "react";
import { RU } from "@/locales";

const { ACTIONS: { BACK } } = RU;

/**
 * @description Переиспользуемый компонент кнопки "Назад" с иконкой
 * @param to - путь для навигации (по умолчанию '/workouts')
 * @param ariaLabel - текст для screen readers
 * @param variant - вариант кнопки
 * @param size - размер кнопки
 * @returns Компонент кнопки
 */
export const BackButton: FC<BackButtonProps> = ({
  to = '/workouts',
  ariaLabel = BACK,
  variant = 'plain',
  size = 'md',
  disabled = false
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
      disabled={disabled}
    >
      <GoChevronLeft />
    </IconButton>
  );
};
