import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Stack,
  Card,
  Flex,
  Spacer,
  Icon,
  Text,
  Alert,
} from '@chakra-ui/react';
import { HiViewGridAdd } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { workoutService } from '@/services/api/workoutService';
import { LoadingOverlay } from '@/components';
import type { Workout } from '@/types';

export const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await workoutService.getWorkouts();
        setWorkouts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (isLoading) {
    return (
      <Box p={6}>
        <LoadingOverlay isLoading={true}>
          <Box>
            <Flex mb={8} align="center">
              <Heading as="h1" size="xl">Мои тренировки</Heading>
              <Spacer />
            </Flex>
            <Stack gap={4}>
              {[1, 2, 3].map(i => (
                <Card.Root key={i} variant="outline">
                  <Card.Body>
                    <Box>
                      <Heading size="md">Загрузка...</Heading>
                    </Box>
                  </Card.Body>
                </Card.Root>
              ))}
            </Stack>
          </Box>
        </LoadingOverlay>
      </Box>
    );
  }

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
    <Box p={6}>
      <Flex mb={8} align="center">
        <Heading as="h1" size="xl">Мои тренировки</Heading>
        <Spacer />
        <RouterLink to="/workouts/create">
          <Button colorScheme="blue">
            <Icon size="lg" color="pink.700">
              <HiViewGridAdd />
            </Icon>
            Новая тренировка
          </Button>
        </RouterLink>
      </Flex>

      {workouts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color="gray.500" mb={4}>
            У вас пока нет тренировок
          </Text>
          <RouterLink to="/workouts/create">
            <Button colorScheme="blue">
              Создать первую тренировку
            </Button>
          </RouterLink>
        </Box>
      ) : (
        <Stack gap={4}>
          {workouts.map(workout => (
            <Card.Root key={workout.id} variant="outline">
              <Card.Body>
                <Flex align="center">
                  <Box flex="1">
                    <Heading size="md">{workout.title}</Heading>
                    <Text color="gray.600" mt={1}>
                      {workout.exercises.join(', ')}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Создано: {workout.createdAt instanceof Date ? workout.createdAt.toLocaleDateString('ru-RU') : new Date(workout.createdAt).toLocaleDateString('ru-RU')}
                    </Text>
                  </Box>
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </Stack>
      )}
    </Box>
  );
};
