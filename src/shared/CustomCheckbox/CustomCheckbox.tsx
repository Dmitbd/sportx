import { HStack, Box, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { LuCheck } from "react-icons/lu";
import type { CustomCheckboxProps } from "./types";

/**
 * Кастомный чекбокс компонент в стиле Chakra UI
 * 
 * @description
 * Альтернатива Checkbox из Chakra UI, оптимизированная для сложных многоуровневых конструкций.
 * 
 * @performance
 * - Рендерится быстрее чем Chakra UI Checkbox
 * - Мгновенный отклик на клики пользователя без задержек
 * - Минимальные ре-рендеры благодаря простой структуре
 * - Отсутствие сложной логики обработки событий из библиотеки
 * 
 * @usage
 * Рекомендуется использовать в сложных иерархических структурах (аккордеоны, деревья, списки)
 * где важна скорость отклика и плавность взаимодействия.
 * 
 * @example
 * ```tsx
 * <CustomCheckbox
 *   checked={isSelected}
 *   onChange={handleChange}
 *   label="Опция"
 *   onClick={(e) => e.stopPropagation()}
 * />
 * ```
 */
export const CustomCheckbox: FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  onClick
}) => (
  <HStack
    w="full"
    cursor="pointer"
    onClick={onClick}
    gap={3}
    py="0.5"
    px="0.5"
    borderRadius="md"
  >
    <Box
      w="16px"
      h="16px"
      border="2px solid"
      borderColor={checked ? "black" : "gray.300"}
      bg={checked ? "black" : "white"}
      borderRadius="sm"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      {checked && (
        <LuCheck size={12} color="white" />
      )}
    </Box>
    <Text
      fontSize="sm"
      fontWeight="medium"
      color={checked ? "gray.900" : "gray.700"}
      flex="1"
    >
      {label}
    </Text>
  </HStack>
);
