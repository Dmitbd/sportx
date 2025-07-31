import { Input, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <Stack gap="4">
      <Input placeholder="login" variant="outline" />
      <Input placeholder="password" variant="outline" />
      <Input placeholder="password" variant="outline" />
      <Link to={'/auth/login'}>login</Link>
    </Stack>
  )
};
