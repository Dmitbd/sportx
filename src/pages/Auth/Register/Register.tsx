import { Button, Heading, Input, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RU } from "@/locales";

export const Register = () => {
  return (
    <Stack gap="4">
      <Heading>{RU.AUTH.TITLES.REGISTER}</Heading>
      
      <Input placeholder={RU.AUTH.LABELS.EMAIL} variant="outline" />
      <Input placeholder={RU.AUTH.LABELS.PASSWORD} variant="outline" />
      <Input placeholder={RU.AUTH.LABELS.CONFIRM_PASSWORD} variant="outline" />

      <Button asChild>
        <Link to={'/auth/login'}>
          {RU.ACTIONS.REGISTER}
        </Link>
      </Button>
    </Stack>
  )
};
