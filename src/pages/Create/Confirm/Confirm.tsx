import { Box, Button, Card, CardBody, Heading, Spinner, Stack, Text, Alert, Badge, Wrap } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useWorkoutStore } from '@/stores/workoutStore';

// TODO добавить редактирование упражнений/тренировки

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
                    {workout.name}
                  </Heading>

                  <Text fontSize="sm" mb={3}>{`Упражнений в тренировке: ${workout.exercises.length}`}</Text>

                  <Stack gap={3}>
                    {workout.exercises.map((exercise, exIndex) => (
                      <Box key={exIndex} borderWidth="1px" borderRadius="lg" p={4} borderColor="border.disabled" color="fg.disabled">
                        <Text fontSize="sm" fontWeight="bold">{exercise.name}</Text>
                        <Text fontSize="sm">
                          {exercise.sets} подходов × {exercise.reps} повторений
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">Техника выполнения</Text>
                        <Text fontSize="sm">{exercise.description}</Text>
                        <Text fontSize="sm" fontWeight="bold">Мышцы</Text>
                        <Wrap>
                          {
                            exercise.muscles.map(item => (
                              <Badge key={item}>{item}</Badge>
                            ))
                          }
                        </Wrap>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}

              <Button asChild colorScheme="green" mt={4}>
                <Link to="/workouts">
                  Сохранить
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
