import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Container } from "@chakra-ui/react";

export const App = () => (
  <Container maxW="sm" px={4} py={8}>
    <RouterProvider router={router} />
  </Container>
);
