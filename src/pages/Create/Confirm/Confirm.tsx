import { Box, Button, Card, CardBody, Heading, Stack, Text, Alert, Badge, Wrap } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';

// TODO добавить редактирование упражнений/тренировки
// TODO добавить индикатор о генерации плана для пользователя

/**
 * @description Страница подтверждения создания плана тренировок
 * @returns Компонент страницы
 */
export const Confirm = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);

  const {
    workoutPlan,
    error,
    saveWorkoutPlan,
  } = useWorkoutStore();

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    await saveWorkoutPlan();
    navigate('/workouts');
  }, [saveWorkoutPlan, navigate]);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    }
  }, []);

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
    <LoadingOverlay isLoading={isLoading}>
      <Box maxW="md" mx="auto" mt={10}>
        <Card.Root>
          <CardBody>
            <Heading as="h2" size="md" mb={6}>
              Ваш план тренировок готов!
            </Heading>
            {workoutPlan && workoutPlan.length && (
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

                <Button
                  colorScheme="green"
                  mt={4}
                  onClick={handleSave}
                  loading={isLoading}
                >
                  Сохранить
                </Button>
              </Stack>
            )}
          </CardBody>
        </Card.Root>
      </Box>
    </LoadingOverlay>
  );
};
