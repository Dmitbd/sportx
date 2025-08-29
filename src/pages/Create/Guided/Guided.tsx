import { Accordion, Box, Button, Card, CardBody, Heading, HStack, RadioGroup, Stack, Text, VStack, Wrap } from "@chakra-ui/react";
import { useCallback, useState, lazy, Suspense } from "react";
import { EquipmentCard } from "../components";
import { useNavigate } from "react-router-dom";
import type { EquipmentItem } from "../types";
import {
  INITIAL_ITEMS
} from "../constants";
import { useWorkoutStore } from "@/stores/workoutStore";
import { LoadingOverlay } from "@/components";
import { workoutCreate } from "@/services";
import { askAI } from "@/services";
import { BackButton } from "@/shared";
import { RU, ERRORS } from "@/locales";

const MuscleSelection = lazy(() => import("../components/MuscleSelection")
  .then(module => ({ default: module.MuscleSelection })));

/**
 * @description Страница c формой сбора данных для создания плана тренировок
 * @returns Компонент страницы
 */
export const Guided = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [workoutCount, setWorkoutCount] = useState<string | null>(null);

  const [place, setPlace] = useState<string | null>(null);
  const [hasHomeEquipment, setHasHomeEquipment] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(INITIAL_ITEMS);
  const [muscleSelectionType, setMuscleSelectionType] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setWorkoutData, setWorkoutPlan, setError } = useWorkoutStore();

  const handleItemUpdate = useCallback((updatedItem: EquipmentItem) => {
    setEquipmentList(prev =>
      prev.map(item => item.name === updatedItem.name ? updatedItem : item)
    );
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      setWorkoutData({
        gender,
        experience,
        workoutCount,
        place,
        equipment: equipmentList
      });

      const prompt = workoutCreate.generateWorkoutPrompt(
        workoutCount!,
        place!,
        equipmentList
      );

      const aiResponse = await askAI([{ role: 'user', content: prompt }]);

      setWorkoutPlan(aiResponse.workouts);

      navigate('/workouts/create/confirm');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERRORS.COMMON.ERROR;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [gender, experience, workoutCount, place, equipmentList, setWorkoutData, setWorkoutPlan, setError, navigate]);

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Box
        as="main"
        maxW="md"
        mx="auto"
        mt={10}
        position="relative"
      >
        <BackButton
          variant="plain"
          ariaLabel={RU.ACTIONS.BACK}
        />

        <Card.Root>
          <CardBody>
            <Heading
              as="h1"
              size="lg"
              mb={6}
            >
              {RU.CREATE.TITLES.GUIDED}
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack gap={6}>
                <Box as="fieldset">
                  <Heading
                    as="legend"
                    size="md"
                    mb={4}
                  >
                    {RU.CREATE.SECTIONS.GENDER}
                  </Heading>
                  <RadioGroup.Root
                    onValueChange={(e) => setGender(e.value)}
                  >
                    <HStack align="stretch">
                      {RU.CREATE.OPTIONS.GENDERS.map((item) => (
                        <RadioGroup.Item
                          key={item}
                          value={item}
                        >
                          <RadioGroup.ItemHiddenInput />
                          <RadioGroup.ItemIndicator />
                          <RadioGroup.ItemText>
                            {item}
                          </RadioGroup.ItemText>
                        </RadioGroup.Item>
                      ))}
                    </HStack>
                  </RadioGroup.Root>
                </Box>

                {
                  gender && (
                    <Box as="fieldset">
                      <Heading
                        as="legend"
                        size="md"
                        mb={4}
                      >
                        {RU.CREATE.SECTIONS.EXPERIENCE}
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => setExperience(e.value)}
                      >
                        <Stack gap={3}>
                          <RadioGroup.Item value={RU.CREATE.EXPERIENCE_LEVELS.NOVICE.TITLE}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              <Box>
                                <Text fontWeight="bold">{RU.CREATE.EXPERIENCE_LEVELS.NOVICE.TITLE}</Text>
                                <Text fontSize="sm" color="gray.600">
                                  {RU.CREATE.EXPERIENCE_LEVELS.NOVICE.DESCRIPTION}
                                </Text>
                              </Box>
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value={RU.CREATE.EXPERIENCE_LEVELS.INTERMEDIATE.TITLE}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              <Box>
                                <Text fontWeight="bold">{RU.CREATE.EXPERIENCE_LEVELS.INTERMEDIATE.TITLE}</Text>
                                <Text fontSize="sm" color="gray.600">
                                  {RU.CREATE.EXPERIENCE_LEVELS.INTERMEDIATE.DESCRIPTION}
                                </Text>
                              </Box>
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value={RU.CREATE.EXPERIENCE_LEVELS.ADVANCED.TITLE}>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              <Box>
                                <Text fontWeight="bold">{RU.CREATE.EXPERIENCE_LEVELS.ADVANCED.TITLE}</Text>
                                <Text fontSize="sm" color="gray.600">
                                  {RU.CREATE.EXPERIENCE_LEVELS.ADVANCED.DESCRIPTION}
                                </Text>
                              </Box>
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                        </Stack>
                      </RadioGroup.Root>
                    </Box>
                  )
                }

                {
                  gender && experience && (
                    <Box as="fieldset">
                      <Heading
                        as="legend"
                        size="md"
                        mb={4}
                      >
                        {RU.CREATE.SECTIONS.WORKOUT_COUNT}
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => setWorkoutCount(e.value)}
                      >
                        <Wrap>
                          {RU.CREATE.OPTIONS.TRAINING_DAYS.map((item) => (
                            <RadioGroup.Item
                              key={item}
                              value={String(item)}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>
                                {item}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </Wrap>
                      </RadioGroup.Root>
                    </Box>
                  )
                }

                {
                  workoutCount && (
                    <VStack
                      as="fieldset"
                      gap={4}
                    >
                      <Heading
                        as="legend"
                        size="md"
                        mb={4}
                      >
                        {RU.CREATE.SECTIONS.MUSCLE_SELECTION}
                      </Heading>

                      <RadioGroup.Root
                        onValueChange={(e) => setMuscleSelectionType(e.value)}
                        w='full'
                      >
                        <Wrap>
                          {[RU.CREATE.OPTIONS.SELECTION.FULL_BODY, RU.CREATE.OPTIONS.SELECTION.SELECT_MUSCLES].map(option => (
                            <RadioGroup.Item
                              key={option}
                              value={String(option)}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>
                                {option}
                              </RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </Wrap>
                      </RadioGroup.Root>

                      {
                        muscleSelectionType === RU.CREATE.OPTIONS.SELECTION.SELECT_MUSCLES && (
                          <Suspense
                            fallback={
                              <Box
                                p={4}
                                textAlign="center"
                              >
                                <Text color="gray.500">
                                  {RU.CREATE.SECTIONS.MUSCLE_SELECTION}
                                </Text>
                              </Box>
                            }>
                            <Box w="full">
                              <MuscleSelection />
                            </Box>
                          </Suspense>
                        )
                      }
                    </VStack>
                  )
                }

                {
                  workoutCount && (
                    <Box as="fieldset">
                      <Heading
                        as="legend"
                        size="md"
                        mb={4}
                      >
                        {RU.CREATE.SECTIONS.PLACE}
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => {
                          setPlace(e.value);
                          setHasHomeEquipment(null);
                        }}
                      >
                        <Wrap>
                          {RU.CREATE.OPTIONS.PLACES.map((item) => (
                            <RadioGroup.Item
                              key={item}
                              value={item}
                              disabled={item === 'На улице'}
                            >
                              <RadioGroup.ItemHiddenInput />
                              <RadioGroup.ItemIndicator />
                              <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
                            </RadioGroup.Item>
                          ))}
                        </Wrap>
                      </RadioGroup.Root>
                    </Box>
                  )
                }

                {
                  workoutCount && place === 'Дома' && (
                    <Box as="fieldset">
                      <Heading
                        as="legend"
                        size="md"
                        mb={4}
                      >
                        {RU.CREATE.SECTIONS.HOME_EQUIPMENT}
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => setHasHomeEquipment(e.value)}
                        mb={4}
                      >
                        <Wrap>
                          {
                            RU.CREATE.OPTIONS.ACCEPT.map(item => (
                              <RadioGroup.Item
                                key={item}
                                value={String(item)}
                              >
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator />
                                <RadioGroup.ItemText>
                                  {item}
                                </RadioGroup.ItemText>
                              </RadioGroup.Item>
                            ))
                          }
                        </Wrap>
                      </RadioGroup.Root>

                      {
                        hasHomeEquipment === 'true' && (
                          <Accordion.Root
                            variant='enclosed'
                            collapsible
                          >
                            {equipmentList.map(item => (
                              <EquipmentCard
                                key={item.name}
                                item={item}
                                onUpdate={handleItemUpdate}
                              />
                            ))}
                          </Accordion.Root>
                        )
                      }
                    </Box>
                  )
                }

                {
                  workoutCount && place === 'В зале' && (
                    <Box role="note" aria-live="polite">
                      <Text fontSize="sm" color="gray.600">
                        {RU.CREATE.MESSAGES.GYM_EQUIPMENT}
                      </Text>
                    </Box>
                  )
                }

                {
                  workoutCount && place === 'На улице' && (
                    <Box as="fieldset">
                      <Heading
                        as="legend"
                        size="md"
                        mb={4}
                      >
                        {RU.CREATE.SECTIONS.OUTDOOR_EQUIPMENT}
                      </Heading>
                    </Box>
                  )
                }
              </Stack>
              <Button
                type="submit"
                colorScheme="blue"
                mt={6}
                loading={isLoading}
              >
                {RU.ACTIONS.CONTINUE}
              </Button>
            </form>
          </CardBody>
        </Card.Root>
      </Box>
    </LoadingOverlay>
  );
};
