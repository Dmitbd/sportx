import { BackButton } from "@/shared";
import { Box, Heading, HStack, IconButton } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";
import type { PageHeaderProps } from "./types";
import { RU } from "@/locales";

/** Обертка для кнопок, что бы все элементы в PageHeader всегда одинаково центрировались */
const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => (
  <Box w={10}>{children}</Box>
);

/** Компонент header для страниц, содержит навигацию, имя страницы и доп. действия */
export const PageHeader: FC<PageHeaderProps> = ({
  title,
  hasShowBackButton = true,
  backButtonConfig,
  actions
}) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <HStack p={2}>
        <ButtonWrapper>
          {
            hasShowBackButton && (
              <BackButton
                variant="plain"
                ariaLabel={RU.ACTIONS.BACK}
                {...backButtonConfig}
              />
            )
          }
        </ButtonWrapper>

        <Heading
          as="h1"
          size="lg"
          mb='3px'
          w='full'
          textAlign='center'
        >
          {title}
        </Heading>

        <ButtonWrapper>
          {
            actions && actions.map(({
              label,
              onClick,
              icon
            }) => (
              <IconButton
                key={label}
                aria-label={label}
                onClick={onClick}
                variant='ghost'
              >
                {icon}
              </IconButton>
            ))
          }
        </ButtonWrapper>
      </HStack>
    </Box>
  );
};
