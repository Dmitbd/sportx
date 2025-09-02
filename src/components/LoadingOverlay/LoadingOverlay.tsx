import { Box, Center, Spinner } from "@chakra-ui/react";
import type { FC } from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
};

/**
 * @description Компонент для отображения overlay при загрузке данных
 * @param isLoading Флаг, указывающий на загрузку данных
 * @param children Дочерние элементы, которые будут отображаться поверх overlay
 * @returns Компонент с overlay, который отображается при загрузке данных
 */
export const LoadingOverlay: FC<LoadingOverlayProps> = ({
  isLoading,
  children
}) => {
  return (
    <Box>
      {children}
      {
        isLoading && (
          <Box pos="absolute" inset="0" bg="bg/80" pt={80}>
            <Center h="full">
              <Spinner size='lg' animationDuration="0.8s"/>
            </Center>
          </Box>
        )
      }
    </Box>
  );
};
