import { Alert, Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { ERRORS, RU } from "@/locales";
import { useCallback, useState } from "react";
import { authService } from "@/services";
import { LoadingOverlay, PageContentWrapper } from "@/components";

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
      const errorMessage = err instanceof Error ? err.message : ERRORS.COMMON.ERROR;
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
      <LoadingOverlay isLoading={isLoading}>
        <Stack gap={10}>
          <Box>
            <Heading size="lg" mb={2}>
              {RU.AUTH.TITLES.REGISTER}
            </Heading>
            <Text color="gray.600">
              {RU.AUTH.CONTENT.REGISTER_DESCRIPTION}
            </Text>
          </Box>

          <Stack gap={6}>
            <Input
              name='email'
              value={formData.email}
              placeholder={RU.AUTH.LABELS.EMAIL}
              variant="outline"
              onChange={handleFormChange}
            />
            <Input
              name='password'
              value={formData.password}
              placeholder={RU.AUTH.LABELS.PASSWORD}
              variant="outline"
              onChange={handleFormChange}
            />
            <Input
              name='confirmPassword'
              value={formData.confirmPassword}
              placeholder={RU.AUTH.LABELS.CONFIRM_PASSWORD}
              variant="outline"
              onChange={handleFormChange}
            />
          </Stack>

          <Stack gap={6}>
            <Button
              onClick={onSubmitForm}
            >
              {RU.ACTIONS.REGISTER}
            </Button>
            <Button asChild>
              <Link to={'/auth/login'}>
                {RU.ACTIONS.LOGIN}
              </Link>
            </Button>
          </Stack>
        </Stack>
      </LoadingOverlay>
    </PageContentWrapper>
  )
};
