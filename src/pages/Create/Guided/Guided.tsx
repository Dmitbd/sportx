import { Accordion, Box, Button, Card, CardBody, Heading, HStack, RadioGroup, Stack, Text, Wrap } from "@chakra-ui/react";
import { useCallback, useState, lazy, Suspense } from "react";
import { EquipmentCard } from "../components";
import { useNavigate } from "react-router-dom";
import type { EquipmentItem } from "../types";
import { fullBodyOption, genders, initialItems, places, selectMusclesOption, trainingDays } from "../constants";
import { useWorkoutStore } from "@/stores/workoutStore";
import { LoadingOverlay } from "@/components";
import { promptService } from "@/services";
import { askAI } from "@/services";
import { BackButton } from "@/shared";

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
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(initialItems);
  const [muscleSelectionType, setMuscleSelectionType] = useState<string | null>(fullBodyOption);

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

      const prompt = promptService.generateWorkoutPrompt(
        workoutCount!,
        place!,
        equipmentList
      );

      const aiResponse = await askAI([{ role: 'user', content: prompt }]);

      setWorkoutPlan(aiResponse.workouts);

      navigate('/workouts/create/confirm');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка';
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
          ariaLabel="Назад к тренировкам"
        />

        <Card.Root>
          <CardBody>
            <Heading
              as="h1"
              size="lg"
              mb={6}
            >
              Создание программы тренировок
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack gap={6}>
                <Box as="fieldset">
                  <Heading
                    as="legend"
                    size="md"
                    mb={4}
                  >
                    Ваш пол
                  </Heading>
                  <RadioGroup.Root
                    onValueChange={(e) => setGender(e.value)}
                    aria-describedby="gender-description"
                  >
                    <HStack align="stretch">
                      {genders.map((item) => (
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
                        Ваш уровень подготовки
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => setExperience(e.value)}
                        aria-describedby="experience-description"
                      >
                        <Stack gap={3}>
                          <RadioGroup.Item value="Новичок">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              <Box>
                                <Text fontWeight="bold">Новичок</Text>
                                <Text fontSize="sm" color="gray.600" id="novice-description">
                                  Тренируюсь меньше 6 месяцев или не тренируюсь совсем. Осваиваю базовые упражнения.
                                </Text>
                              </Box>
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value="Средний">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              <Box>
                                <Text fontWeight="bold">Средний</Text>
                                <Text fontSize="sm" color="gray.600" id="intermediate-description">
                                  Тренируюсь от 6 месяцев до 2 лет. Знаю базовую технику, готов к умеренным нагрузкам.
                                </Text>
                              </Box>
                            </RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value="Продвинутый">
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>
                              <Box>
                                <Text fontWeight="bold">Продвинутый</Text>
                                <Text fontSize="sm" color="gray.600" id="advanced-description">
                                  Тренируюсь 2+ года. Владею техникой, хочу сложные комплексы и высокую интенсивность.
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
                        Сколько тренировок в неделю?
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => setWorkoutCount(e.value)}
                        aria-describedby="workout-count-description"
                      >
                        <Wrap>
                          {trainingDays.map((item) => (
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
                    <Box as="fieldset">
                      <Heading
                        as="legend"
                        size="md"
                        mb={4}
                      >
                        Какие мышцы хотите тренировать?
                      </Heading>

                      <RadioGroup.Root
                        defaultValue={muscleSelectionType}
                        onValueChange={(e) => setMuscleSelectionType(e.value)}
                        aria-describedby="muscle-selection-description"
                        mb={6}
                      >
                        <Wrap>
                          {[fullBodyOption, selectMusclesOption].map(option => (
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
                        muscleSelectionType === selectMusclesOption && (
                          <Suspense fallback={
                            <Box p={4} textAlign="center">
                              <Text color="gray.500">Загрузка...</Text>
                            </Box>
                          }>
                            <MuscleSelection />
                          </Suspense>
                        )
                      }
                    </Box>
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
                        Где вы планируете тренироваться?
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => {
                          setPlace(e.value);
                          setHasHomeEquipment(null);
                        }}
                        aria-describedby="place-description"
                      >
                        <Wrap>
                          {places.map((item) => (
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
                        Есть ли у вас домашний инвентарь?
                      </Heading>
                      <RadioGroup.Root
                        onValueChange={(e) => setHasHomeEquipment(e.value)}
                        aria-describedby="equipment-description"
                        mb={4}
                      >
                        <HStack align="stretch">
                          <RadioGroup.Item value='true'>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{'Да'}</RadioGroup.ItemText>
                          </RadioGroup.Item>
                          <RadioGroup.Item value='false'>
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{'Нет'}</RadioGroup.ItemText>
                          </RadioGroup.Item>
                        </HStack>
                      </RadioGroup.Root>

                      {
                        hasHomeEquipment === 'true' && (
                          <Accordion.Root
                            variant='enclosed'
                            collapsible
                            aria-describedby="equipment-list-description"
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
                        Для этих тренировок будет учитываться инвентарь зала.
                        При отсутствии инвентаря в зале, упражнения можно будет заменить на аналогичные.
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
                        Какой есть инвентарь на улице?
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
                aria-describedby="submit-description"
              >
                Продолжить
              </Button>
            </form>
          </CardBody>
        </Card.Root>
      </Box>
    </LoadingOverlay>
  );
};
