import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Stack,
  Card,
  Flex,
  Spacer,
  Icon
} from '@chakra-ui/react';
import { HiViewGridAdd } from 'react-icons/hi'

type Workout = {
  id: string;
  title: string;
  exercises: string[];
  createdAt: Date;
};

export const Workouts = () => {
  // Временные данные
  const workouts: Workout[] = [
    {
      id: '1',
      title: 'Силовая тренировка',
      exercises: ['Жим лёжа', 'Приседания', 'Тяга'],
      createdAt: new Date('2023-05-15')
    },
    {
      id: '2',
      title: 'Кардио сессия',
      exercises: ['Бег', 'Велосипед'],
      createdAt: new Date('2023-05-10')
    }
  ];

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

      <Stack gap={4}>
        {workouts.map(workout => (
          <Card.Root key={workout.id} variant="outline">
            <Card.Body>
              <Flex align="center">
                <Box flex="1">
                  <Heading size="md">{workout.title}</Heading>
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>
    </Box>
  );
};
