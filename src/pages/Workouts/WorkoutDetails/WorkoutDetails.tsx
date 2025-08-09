import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Alert } from '@chakra-ui/react';
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
      <Box mt={4}>
        <Heading as="h3" size="md" mb={2}>Упражнения:</Heading>
        {training.exercises.map((ex, idx) => (
          <Box key={idx} mb={3} p={3} borderWidth={1} borderRadius="md">
            <Text fontWeight="bold">{ex.name}</Text>
            <Text color="gray.600">{ex.description}</Text>
            <Text>Подходы: {ex.sets}, Повторения: {ex.reps}</Text>
            <Text color="gray.500">Мышцы: {ex.muscles.join(', ')}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
