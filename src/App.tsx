import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Box } from "@chakra-ui/react";

export const App = () => (
  <Box p={4}>
    <RouterProvider router={router} />
  </Box>
);
