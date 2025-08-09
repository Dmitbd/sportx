import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Alert, Badge, Stack, HStack, Card, Collapsible } from '@chakra-ui/react';
import { workoutService } from '@/services/api/workoutService';
import type { Training } from '@/types';

export const WorkoutDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchWorkout = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await workoutService.getWorkout(id);
        setTraining(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  if (isLoading) {
    return <Spinner size="xl" />;
  }
  if (error) {
    return <Alert.Root status="error">{error}</Alert.Root>;
  }
  if (!training) {
    return <Text>Тренировка не найдена</Text>;
  }

  return (
    <Box p={6}>
      <Heading as="h2" size="lg">{training.name}</Heading>

      <Stack gap={4} mt={4}>
        {training.exercises.map((ex, idx) => (
          <Card.Root key={`${ex.name}-${idx}`} flexDirection="row" overflow="hidden" maxW="xl">
            {/* Без изображения, как просили */}
            <Box flex="1">
              <Card.Body>
                <Card.Title mb="2">{ex.name}</Card.Title>

                <HStack mt="2" gap="2" wrap="wrap">
                  {ex.muscles.map((muscle) => (
                    <Badge key={muscle} colorPalette="purple" variant="subtle">
                      {muscle}
                    </Badge>
                  ))}
                </HStack>

                <Box mt="4">
                  <Heading as="h4" size="sm" mb={2}>Подходы</Heading>
                  <Stack gap={2}>
                    {Array.from({ length: ex.sets }, (_, i) => (
                      <HStack key={i} justify="space-between" align="center">
                        <Text>Подход {i + 1}</Text>
                        <HStack gap={6}>
                          <Text color="gray.600">Вес: —</Text>
                          <Text color="gray.600">Повторения: {ex.reps}</Text>
                        </HStack>
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              </Card.Body>

              <Card.Footer>
                <Collapsible.Root>
                  <Collapsible.Trigger paddingY="3">
                    Описание
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <Box padding="4" borderWidth="1px">
                      <Text color="gray.600">{ex.description}</Text>
                    </Box>
                  </Collapsible.Content>
                </Collapsible.Root>
              </Card.Footer>
            </Box>
          </Card.Root>
        ))}
      </Stack>
    </Box>
  );
};
