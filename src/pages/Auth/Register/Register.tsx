import { Alert, Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { authService } from "@/services";
import { PageContentWrapper } from "@/components";
import { LinkButton } from "@/shared";
import { RU, ERRORS } from "@/locales";

const { AUTH, ACTIONS } = RU;
const { COMMON: { ERROR } } = ERRORS;

export const Register = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ email: string, password: string, confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: ''
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
      await authService.register(formData);
      navigate('/auth/login')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formData, setIsLoading, setError, navigate]);

  if (error) {
    return (
      <Box p={6}>
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>
            {ERROR}
          </Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
        <Button
          colorScheme="blue"
          // TODO: передавать метод загрузки, а не reload
          onClick={() => window.location.reload()}
        >
          {ACTIONS.RETRY}
        </Button>
      </Box>
    );
  }

  return (
    <PageContentWrapper>
      <Stack gap={10}>
        <Box>
          <Heading size="lg" mb={2}>
            {AUTH.TITLES.REGISTER}
          </Heading>
          <Text color="gray.600">
            {AUTH.CONTENT.REGISTER_DESCRIPTION}
          </Text>
        </Box>

        <Stack gap={6}>
          <Input
            name='email'
            value={formData.email}
            placeholder={AUTH.LABELS.EMAIL}
            variant="outline"
            onChange={handleFormChange}
            disabled={isLoading}
          />
          <Input
            name='password'
            value={formData.password}
            placeholder={AUTH.LABELS.PASSWORD}
            variant="outline"
            onChange={handleFormChange}
            disabled={isLoading}
          />
          <Input
            name='confirmPassword'
            value={formData.confirmPassword}
            placeholder={AUTH.LABELS.CONFIRM_PASSWORD}
            variant="outline"
            onChange={handleFormChange}
            disabled={isLoading}
          />
        </Stack>

        <Stack gap={6}>
          <Button
            onClick={onSubmitForm}
            loading={isLoading}
          >
            {ACTIONS.REGISTER}
          </Button>
          <LinkButton
            label={ACTIONS.AUTH}
            to='/auth/login'
            disabled={isLoading}
          />
        </Stack>
      </Stack>
    </PageContentWrapper>
  )
};
