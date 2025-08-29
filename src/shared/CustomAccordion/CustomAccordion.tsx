import { Box } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";

/**
 * Кастомный аккордеон компонент в стиле Chakra UI
 * 
 * @description
 * Альтернатива Accordion из Chakra UI, оптимизированная для сложных многоуровневых конструкций.
 * 
 * @performance
 * - Рендерится быстрее чем Chakra UI Accordion
 * - Мгновенный отклик на клики пользователя без задержек
 * - Отсутствие сложной логики управления состоянием из библиотеки
 * - Минимальные ре-рендеры благодаря простой структуре
 * - Прямое управление состоянием без промежуточных обработчиков
 * 
 * @usage
 * Рекомендуется использовать в сложных иерархических структурах (деревья, многоуровневые меню)
 * где важна скорость отклика и плавность анимаций.
 * 
 * @example
 * ```tsx
 * <CustomAccordion
 *   title={<CustomCheckbox checked={isSelected} onChange={handleChange} label="Группа" />}
 *   isOpen={isOpen}
 *   onToggle={handleToggle}
 * >
 *   <Stack gap={2}>
 *     <CustomCheckbox checked={isSubSelected} onChange={handleSubChange} label="Подгруппа" />
 *   </Stack>
 * </CustomAccordion>
 * ```
 */
export const CustomAccordion = ({
  children,
  title,
  isOpen,
  onToggle
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <Box
    border="1px solid"
    borderColor="gray.200"
    borderRadius="lg"
    overflow="hidden"
    bg="white"
  >
    <Box
      p={2}
      cursor="pointer"
      onClick={onToggle}
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottom={isOpen ? "1px solid" : "none"}
      borderBottomColor="gray.200"
    >
      <Box flex="1">
        {title}
      </Box>
      <Box
        transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
        transition="transform 0.2s"
        color="gray.500"
        ml={2}
        flexShrink={0}
      >
        <LuChevronDown size={18} />
      </Box>
    </Box>
    {isOpen && (
      <Box p={4} bg="white">
        {children}
      </Box>
    )}
  </Box>
);
