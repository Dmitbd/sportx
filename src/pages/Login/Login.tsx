import { LoadingOverlay } from "@/components";
import { authService } from "@/services";
import { useAuthStore } from "@/stores/authStore";
import { Alert, Box, Button, Input, Stack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

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
      const errorMessage = err instanceof Error ? err.message : 'Ошибка';
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
          <Alert.Title>Ошибка загрузки тренировок</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
        <Button
          colorScheme="blue"
          // TODO: передавать метод загрузки, а не reload
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Stack gap="4">
        <Input
          name="email"
          placeholder="login"
          variant="outline"
          value={formData.email}
          onChange={handleFormChange}
        />
        <Input
          name="password"
          placeholder="password"
          variant="outline"
          value={formData.password}
          onChange={handleFormChange}
        />
        <Button
          loading={isLoading}
          onClick={onSubmitForm}
        >
          login
        </Button>
        <Button
          loading={isLoading}
          asChild
        >
          <Link to={'/auth/register'}>register</Link>
        </Button>
      </Stack>
    </LoadingOverlay>
  )
};
