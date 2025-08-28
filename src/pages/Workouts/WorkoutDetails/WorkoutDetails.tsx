import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Heading, Text, Spinner, Alert, Badge, Stack, HStack, Card, Collapsible, Button, Editable, ActionBar, Portal, IconButton, Dialog, Center } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { workoutService } from '@/services/api/workoutService';
import type { Training, UpdateWorkoutSets } from '@/types';
import { filter, isDeepEqual, isNullish, map, pipe } from 'remeda';
import { BackButton } from '@/shared';
import { LoadingOverlay } from '@/components';
import { ERRORS, RU } from '@/locales';

/**
 * TODO:
 * валидация чисел и отрицательных значений
 * фиксированный размер инпутов что бы не прыгали
 * кг"/"повт." внутри превью
 * при изменении и "отмене" повторный ввод не вызывает экшн бар
 * вынести одинаковый код в функции
 * вынести большие функции в utils
 * подсказку успеха убрать в Toast
 */

export const WorkoutDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialTraining, setInitialTraining] = useState<Training | null>(null);
  const [training, setTraining] = useState<Training | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // принудительный ключ для компонента Editable.Root из-за его специфичного обновления
  const [forceUpdate, setForceUpdate] = useState(0);

  const hasChanges = useMemo(() => (
    !isDeepEqual(initialTraining?.exercises, training?.exercises)
  ), [initialTraining?.exercises, training?.exercises]);

  const handleChange = useCallback(({
    exerciseName,
    setIndex,
    field,
    value
  }: {
    exerciseName: string,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  }) => {
    setTraining(prev => {
      if (isNullish(prev)) {
        return prev
      };

      return {
        ...prev,
        exercises: prev.exercises.map(exercise => {
          if (exercise.name === exerciseName) {
            const newSets = exercise.sets.map((set, index) => {
              if (index === setIndex) {
                const fieldIndex = field === 'weight' ? 0 : 1;
                const newSet = [...set];
                newSet[fieldIndex] = Number(value);
                return newSet;
              }
              return set;
            });
            return { ...exercise, sets: newSets };
          }
          return exercise;
        })
      };
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (isNullish(id) || isNullish(training) || isNullish(initialTraining)) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Находим только измененные упражнения
      const changedExercises = pipe(
        training.exercises,
        filter((exercise, index) => {
          const initialExercise = initialTraining.exercises[index];
          // Проверяем имя и sets
          return exercise.name !== initialExercise.name ||
            !isDeepEqual(exercise.sets, initialExercise.sets);
        }),
        map(exercise => ({
          name: exercise.name,
          sets: exercise.sets
        }))
      );

      // Если нет изменений, выходим
      if (changedExercises.length === 0) {
        setSaveSuccess(ERRORS.COMMON.NO_CHANGES);
        return;
      }

      const payload: UpdateWorkoutSets = {
        exercises: changedExercises
      };

      const resp = await workoutService.updateWorkoutSets(id, payload);

      if (resp?.exercises?.length) {
        // Обновляем локальное состояние
        setTraining(prev => {
          if (isNullish(prev)) {
            return prev;
          }

          const updatesMap = new Map(resp.exercises.map(exercise => [exercise.name, exercise.sets]));

          return {
            ...prev,
            exercises: map(
              prev.exercises,
              exercise => updatesMap.has(exercise.name) ? { ...exercise, sets: updatesMap.get(exercise.name)! } : exercise
            )
          };
        });

        // Обновляем initialTraining
        setInitialTraining(prev => {
          if (isNullish(prev)) {
            return prev;
          }

          const updatesMap = new Map(resp.exercises.map(exercise => [exercise.name, exercise.sets]));

          return {
            ...prev,
            exercises: map(
              prev.exercises,
              exercise => updatesMap.has(exercise.name) ? { ...exercise, sets: updatesMap.get(exercise.name)! } : exercise
            )
          };
        });
      }

      setSaveSuccess(ERRORS.COMMON.CHANGES_SAVED);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERRORS.WORKOUTS.SAVE_ERROR;
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, [id, training, initialTraining]);

  const handleCancel = useCallback(() => {
    if (initialTraining) {
      setTraining(initialTraining);
    }

    setSaveSuccess(null);

    // Принудительный перерендер
    setForceUpdate(prev => prev + 1);
  }, [initialTraining]);

  const handleDelete = useCallback(async () => {
    if (isNullish(id)) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      await workoutService.deleteWorkout(id);

      navigate('/workouts');
    } catch (error) {
      const message = error instanceof Error ? error.message : ERRORS.WORKOUTS.DELETE_ERROR;
      setError(message);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }, [id, navigate]);

  const onDeleteDialogOpenChange = useCallback(({ open }: { open: boolean }) => {
    if (isDeleting) {
      return;
    }

    setIsDeleteDialogOpen(open);
  }, [isDeleting]);

  useEffect(() => {
    if (isNullish(id)) {
      return;
    };

    const fetchWorkout = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await workoutService.getWorkout(id);
        setInitialTraining(data);
        setTraining(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : ERRORS.WORKOUTS.LOAD_ERROR;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  // TODO: подумать как отображать загрузку деталей тренировки
  if (isLoading) {
    return (
      <Box pos="absolute" inset="0" bg="bg/80">
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert.Root status="error">
        {error}
      </Alert.Root>
    );
  }

  if (!training) {
    return (
      <Alert.Root status="error">
        {ERRORS.WORKOUTS.NOT_FOUND}
      </Alert.Root>
    );
  }

  return (
    <LoadingOverlay isLoading={isDeleting}>
      <Box p={6}>
        <BackButton
          variant="plain"
          ariaLabel={RU.ACTIONS.BACK}
        />

        <HStack justify="space-between" align="center" mb={4}>
          <Heading
            as="h2"
            size="lg"
          >
            {training.name}
          </Heading>

          <IconButton
            aria-label={RU.ACTIONS.DELETE}
            variant="ghost"
            colorScheme="red"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>

        <Stack gap={4} mt={4}>
          {training.exercises.map((exercise, exerciseIndex) => (
            <Card.Root
              key={`${exercise.name}-${exerciseIndex}`}
              flexDirection="row"
              overflow="hidden"
              maxW="xl"
            >
              <Box flex="1">
                <Card.Body>
                  <Card.Title mb="2">{exercise.name}</Card.Title>

                  <HStack mt="2" gap="2" wrap="wrap">
                    {exercise.muscles.map((muscle) => (
                      <Badge key={muscle} colorPalette="purple" variant="subtle">
                        {muscle}
                      </Badge>
                    ))}
                  </HStack>

                  <Box mt="4">
                    <Heading as="h4" size="sm" mb={2}>
                      {RU.WORKOUTS.PLURALIZATION.SETS_COUNT}
                    </Heading>
                    <Stack gap={2}>
                      {exercise.sets.map((set, setIndex) => (
                        <HStack
                          key={setIndex}
                          justify="space-between"
                          align="center"
                        >
                          <Text minW="80px">
                            {RU.WORKOUTS.PLURALIZATION.SETS_COUNT} {setIndex + 1}
                          </Text>
                          <HStack gap={6} align="center">
                            <HStack gap={2} align="center">
                              <Text color="gray.600">
                                {RU.WORKOUTS.LABELS.WEIGHT}
                              </Text>
                              <Editable.Root
                                key={`${exercise.name}-${setIndex}-weight-${forceUpdate}`}
                                textAlign="start"
                                value={String(set[0])}
                                onValueChange={({ value }) => handleChange({
                                  exerciseName: exercise.name,
                                  setIndex,
                                  field: 'weight',
                                  value
                                })}
                                maxW="40px"
                              >
                                <Editable.Preview width='40px' />
                                <Editable.Input />
                              </Editable.Root>
                            </HStack>
                            <HStack gap={2} align="center">
                              <Text color="gray.600">
                                {RU.WORKOUTS.PLURALIZATION.REPS_COUNT}:
                              </Text>
                              <Editable.Root
                                key={`${exercise.name}-${setIndex}-reps-${forceUpdate}`}
                                textAlign="start"
                                value={String(set[1])}
                                onValueChange={({ value }) => handleChange({
                                  exerciseName: exercise.name,
                                  setIndex,
                                  field: 'reps',
                                  value
                                })}
                                maxW="40px"
                              >
                                <Editable.Preview width='40px' />
                                <Editable.Input />
                              </Editable.Root>
                            </HStack>
                          </HStack>
                        </HStack>
                      ))}
                    </Stack>
                  </Box>
                </Card.Body>

                <Card.Footer>
                  <Collapsible.Root>
                    <Collapsible.Trigger paddingY="3">
                      {RU.WORKOUTS.LABELS.TECHNIQUE}
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      <Box padding="4" borderWidth="1px">
                        <Text color="gray.600">{exercise.description}</Text>
                      </Box>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </Card.Footer>
              </Box>
            </Card.Root>
          ))}
        </Stack>

        <ActionBar.Root open={hasChanges}>
          <Portal>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <Text>Есть несохраненные изменения</Text>
                <ActionBar.Separator />
                <HStack gap={2}>
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                    {RU.ACTIONS.CANCEL}
                  </Button>
                  <Button colorScheme="blue" size="sm" onClick={handleSave} disabled={isSaving} loading={isSaving}>
                    {RU.ACTIONS.SAVE}
                  </Button>
                </HStack>
                {saveSuccess && (
                  <Badge ml={3} colorPalette="green" variant="subtle">{saveSuccess}</Badge>
                )}
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>

        <Dialog.Root
          open={isDeleteDialogOpen}
          onOpenChange={onDeleteDialogOpenChange}
        >
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{RU.ACTIONS.DELETE}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>{RU.WORKOUTS.MESSAGES.DELETE_CONFIRM(training.name)}</Text>
                <Text>Это действие нельзя отменить.</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={2}>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    {RU.ACTIONS.CANCEL}
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    loading={isDeleting}
                  >
                    {RU.ACTIONS.DELETE}
                  </Button>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Box>
    </LoadingOverlay>
  );
};
