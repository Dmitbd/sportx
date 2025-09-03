import { Box, RadioGroup, Text } from "@chakra-ui/react";
import type { FC } from "react";
import type { ExperienceItemProps } from "./types";

/** Переиспользуемый компонент для отображения уровня опыта */
export const ExperienceItem: FC<ExperienceItemProps> = ({
  title,
  description
}) => {
  return (
    <RadioGroup.Item value={title}>
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemIndicator />
      <RadioGroup.ItemText>
        <Box>
          <Text fontWeight="bold">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
        </Box>
      </RadioGroup.ItemText>
    </RadioGroup.Item>
  );
};
