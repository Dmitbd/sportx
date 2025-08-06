import { Box, Button, Card, CardBody, Heading, Spinner, Stack, Text, Alert } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useWorkoutStore } from '@/stores/workoutStore';

export const Confirm = () => {
  const {
    workoutPlan,
    isLoading,
    error,
  } = useWorkoutStore();

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Генерируем ваш персональный план тренировок...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title> {error}</Alert.Title>
        </Alert.Root>

        <Button
          colorScheme="blue"
          // onClick={generateWorkoutPlan}
          loading={isLoading}
        >
          Попробовать снова
        </Button>

        <Button asChild
          ml={4}
          variant="outline"
        >
          <Link to="/workouts/create">
            Вернуться назад
          </Link>
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Card.Root>
        <CardBody>
          <Heading as="h2" size="md" mb={6}>
            Ваш план тренировок готов!
          </Heading>

          {!isLoading && workoutPlan && workoutPlan.length > 0 ? (
            <Stack gap={6}>
              {workoutPlan.map((workout, index) => (
                <Box key={index} borderWidth="1px" borderRadius="lg" p={4}>
                  <Heading as="h3" size="sm" mb={3}>
                    {workout.name || `Тренировка ${index + 1}`}
                  </Heading>

                  <Stack gap={3}>
                    {workout.exercises.map((exercise, exIndex) => (
                      <Box key={exIndex}>
                        <Text fontWeight="bold">{exercise.name || `Упражнение ${exIndex + 1}`}</Text>
                        <Text fontSize="sm">{exercise.description || 'Описание отсутствует'}</Text>
                        <Text fontSize="sm">
                          {exercise.sets} подходов × {exercise.reps} повторений
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}

              <Button asChild colorScheme="green" mt={4}>
                <Link to="/workouts">
                  Начать тренировки
                </Link>
              </Button>
            </Stack>
          ) : (
            <Text>Не удалось сгенерировать план тренировок</Text>
          )}
        </CardBody>
      </Card.Root>
    </Box>
  );
};
