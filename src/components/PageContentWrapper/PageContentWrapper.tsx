import { Container } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";

/** Компонент для обертки основного контента страницы по принципу body */
export const PageContentWrapper: FC<PropsWithChildren> = ({ children }) => (
  <Container maxW="sm" pt="80px" pb={4}>
    {children}
  </Container>
);
