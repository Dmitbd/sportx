import { useAuthStore } from "@/stores/authStore";
import { Button, Input, Stack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const login = useAuthStore(state => state.login);

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

  const onSubmitForm = useCallback(() => login(formData.email, formData.password), [formData, login]);

  return (
    <Stack gap="4">
      <Input name="email" placeholder="login" variant="outline" value={formData.email} onChange={handleFormChange} />
      <Input name="password" placeholder="password" variant="outline" value={formData.password} onChange={handleFormChange} />
      <Button onClick={onSubmitForm}>login</Button>
      <Link to={'/auth/register'}>register</Link>
    </Stack>
  )
};
