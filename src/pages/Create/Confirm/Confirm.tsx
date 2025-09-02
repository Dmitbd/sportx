import { Box, Button, Heading, Stack, Text, Alert, Badge, Wrap } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { workoutService } from '@/services';
import { RU, ERRORS } from '@/locales';
import { PageContentWrapper, PageHeader } from '@/components';

// TODO добавить редактирование упражнений/тренировки
// TODO добавить индикатор о генерации плана для пользователя

/**
 * @description Страница подтверждения создания плана тренировок
 * @returns Компонент страницы
 */
export const Confirm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    workoutPlan
  } = useWorkoutStore();

  const handleSave = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await workoutService.saveWorkout(workoutPlan!);
      navigate('/workouts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERRORS.COMMON.ERROR;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [workoutPlan, navigate]);

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
          {RU.ACTIONS.RETRY}
        </Button>

        <Button asChild
          ml={4}
          variant="outline"
        >
          <Link to="/workouts/create">
            {RU.ACTIONS.BACK}
          </Link>
        </Button>
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title={RU.CREATE.TITLES.CONFIRM}
        backButtonConfig={{ to: '/workouts/create' }}
      />

      <PageContentWrapper>
        {workoutPlan && workoutPlan.length && (
          <Stack gap={6}>
            {workoutPlan.map((workout, index) => (
              <Box key={index}>
                <Heading as="h3" size="sm" mb={3}>
                  {workout.name}
                </Heading>

                <Text fontSize="sm" mb={3}>
                  {RU.CREATE.CONTENT.EXERCISES_COUNT(String(workout.exercises.length))}
                </Text>

                <Stack gap={3}>
                  {workout.exercises.map((exercise, exIndex) => (
                    <Box
                      key={exIndex}
                      borderWidth="1px"
                      borderRadius="lg"
                      p={4}
                      borderColor="border.disabled"
                      color="fg.disabled"
                    >
                      <Text fontSize="sm" fontWeight="bold">
                        {exercise.name}
                      </Text>
                      <Text fontSize="sm">
                        {RU.CREATE.CONTENT.SETS_AND_REPS([
                          String(exercise.sets.length),
                          String(exercise.sets[0][1])
                        ])}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {RU.CREATE.LABELS.TECHNIQUE}
                      </Text>
                      <Text fontSize="sm">
                        {exercise.description}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold">
                        {RU.CREATE.LABELS.MUSCLES}
                      </Text>
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
              {RU.ACTIONS.SAVE}
            </Button>
          </Stack>
        )}
      </PageContentWrapper>
    </>
  );
};
