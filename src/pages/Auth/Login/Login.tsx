import { PageContentWrapper } from "@/components";
import { authService } from "@/services";
import { useAuthStore } from "@/stores/authStore";
import { Alert, Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { RU, ERRORS } from '@/locales';
import { LinkButton } from "@/shared";

export const Login = () => {
  const { setUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ email: string, password: string }>({
    email: '',
    password: ''
  });

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const onSubmitForm = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await authService.login(formData);
      setUser(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERRORS.COMMON.ERROR;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formData, setUser, setIsLoading, setError]);

  if (error) {
    return (
      <Box p={6}>
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>
            {ERRORS.COMMON.ERROR}
          </Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
        <Button
          colorScheme="blue"
          // TODO: передавать метод загрузки, а не reload
          onClick={() => window.location.reload()}
        >
          {RU.ACTIONS.RETRY}
        </Button>
      </Box>
    );
  }

  return (
    <PageContentWrapper>
      <Stack gap={10}>
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            {RU.AUTH.TITLES.LOGIN}
          </Heading>
          <Text color="gray.600">
            {RU.AUTH.CONTENT.LOGIN_DESCRIPTION}
          </Text>
        </Box>

        <Stack gap={6}>
          <Input
            name="email"
            placeholder={RU.AUTH.LABELS.EMAIL}
            variant="outline"
            value={formData.email}
            onChange={handleFormChange}
            disabled={isLoading}
          />
          <Input
            name="password"
            placeholder={RU.AUTH.LABELS.PASSWORD}
            variant="outline"
            value={formData.password}
            onChange={handleFormChange}
            disabled={isLoading}
          />
          <Button
            loading={isLoading}
            onClick={onSubmitForm}
          >
            {RU.ACTIONS.LOGIN}
          </Button>
          <LinkButton
            label={RU.ACTIONS.REGISTER}
            to='/auth/register'
            disabled={isLoading}
          />
        </Stack>
      </Stack>
    </PageContentWrapper >
  )
};
