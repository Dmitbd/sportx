import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Stack, Card, Flex, Text, Alert } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { workoutService } from '@/services/api/workoutService';
import { LoadingOverlay, PageContentWrapper, PageHeader } from '@/components';
import type { Workout } from '@/types';
import { CgAddR } from "react-icons/cg";
import { RU, ERRORS } from '@/locales';

const { ACTIONS, WORKOUTS } = RU;
const {
  COMMON: COMMON_ERRORS,
  WORKOUTS: WORKOUTS_ERRORS
} = ERRORS;

export const WorkoutsList = () => {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const workoutDate = (createdAt: Date) => (
    createdAt instanceof Date
      ? createdAt.toLocaleDateString('ru-RU')
      : new Date(createdAt).toLocaleDateString('ru-RU')
  );

  const pageHeaderActions = useMemo(() => (
    [
      {
        label: ACTIONS.DELETE,
        onClick: () => navigate('/workouts/create'),
        icon: <CgAddR />
      }
    ]
  ), [navigate]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setError(null);
        const data = await workoutService.getWorkouts();
        setWorkouts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : COMMON_ERRORS.ERROR;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (!isLoading && error) {
    return (
      <Box p={6}>
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>{WORKOUTS_ERRORS.LOAD_ERROR}</Alert.Title>
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
  };

  if (!isLoading && workouts.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500" mb={4}>
          {WORKOUTS.MESSAGES.NO_WORKOUTS}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title={WORKOUTS.TITLES.LIST}
        actions={pageHeaderActions}
        hasShowBackButton={false}
        disabled={isLoading}
      />

      <PageContentWrapper>
        <LoadingOverlay isLoading={isLoading}>
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
                          {WORKOUTS.CONTENT.CREATED(workoutDate(workout.createdAt))}
                        </Text>
                      </Box>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </RouterLink>
            ))}
          </Stack>
        </LoadingOverlay>
      </PageContentWrapper>
    </>
  );
};
