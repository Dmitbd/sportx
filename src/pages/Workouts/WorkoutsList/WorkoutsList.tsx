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
import { ERRORS, RU } from '@/locales';

export const WorkoutsList = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workoutDate = (createdAt: Date) => (
    createdAt instanceof Date
      ? createdAt.toLocaleDateString('ru-RU')
      : new Date(createdAt).toLocaleDateString('ru-RU')
  );

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await workoutService.getWorkouts();
        setWorkouts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : ERRORS.COMMON.ERROR;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (error) {
    return (
      <Box p={6}>
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>{ERRORS.WORKOUTS.LOAD_ERROR}</Alert.Title>
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
    <LoadingOverlay isLoading={isLoading}>
      <Box p={6}>
        <Flex mb={8} align="center">
          <Heading as="h1" size="xl">{RU.WORKOUTS.TITLES.LIST}</Heading>
          <Spacer />
          <RouterLink to="/workouts/create">
            <Button colorScheme="blue">
              <Icon size="lg" color="pink.700">
                <HiViewGridAdd />
              </Icon>
              {RU.WORKOUTS.TITLES.NEW_WORKOUT}
            </Button>
          </RouterLink>
        </Flex>

        {!isLoading && workouts.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500" mb={4}>
              {RU.WORKOUTS.MESSAGES.NO_WORKOUTS}
            </Text>
          </Box>
        ) : (
          <Stack gap={4}>
            {workouts.map(workout => (
              <RouterLink
                key={workout.id}
                to={`/workouts/${workout.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Card.Root variant="outline">
                  <Card.Body>
                    <Flex align="center">
                      <Box flex="1">
                        <Heading size="md">{workout.title}</Heading>
                        <Text color="gray.600" mt={1}>
                          {workout.exercises.join(', ')}
                        </Text>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          {RU.WORKOUTS.CONTENT.CREATED(workoutDate(workout.createdAt))}
                        </Text>
                      </Box>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </RouterLink>
            ))}
          </Stack>
        )}
      </Box>
    </LoadingOverlay>
  );
};
