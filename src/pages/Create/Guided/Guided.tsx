import { Accordion, Box, Button, Card, Center, Heading, HStack, RadioGroup, Spinner, Stack, Text, Wrap } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { EquipmentCard } from "../components";
import { useNavigate } from "react-router-dom";
import type { EquipmentItem } from "../types";
import {
  INITIAL_ITEMS
} from "../constants";
import { useWorkoutStore } from "@/stores/workoutStore";
import { PageContentWrapper, PageHeader } from "@/components";
import { workoutCreate } from "@/services";
import { askAI } from "@/services";
import { RU, ERRORS } from "@/locales";
import { isNullish } from "remeda";
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/radio-group/namespace";

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

  const genderSectionRef = useRef<HTMLDivElement | null>(null);
  const experienceSectionRef = useRef<HTMLDivElement | null>(null);
  const workoutCountSectionRef = useRef<HTMLDivElement | null>(null);
  const muscleSelectionSectionRef = useRef<HTMLDivElement | null>(null);
  const muscleSelectionContentRef = useRef<HTMLDivElement | null>(null);
  const placeSectionRef = useRef<HTMLDivElement | null>(null);
  const homeEquipmentSectionRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const { setWorkoutData, setWorkoutPlan, setError } = useWorkoutStore();

  const handleItemUpdate = useCallback((updatedItem: EquipmentItem) => {
    setEquipmentList(prev =>
      prev.map(item => item.name === updatedItem.name ? updatedItem : item)
    );
  }, []);

  const scrollToElement = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    const HEADER_OFFSET_PX = 60;
    const rect = element.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY - HEADER_OFFSET_PX;
    window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
  }, []);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    element.focus({ preventScroll: true });
  }, []);

  const scrollAndFocus = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    scrollToElement(element);
    requestAnimationFrame(() => focusElement(element));
  }, [scrollToElement, focusElement]);

  const handleGenderChange = useCallback((details: ValueChangeDetails) => {
    setGender(details.value);
  }, []);

  const handleExperienceChange = useCallback((details: ValueChangeDetails) => {
    setExperience(details.value);
  }, []);

  const handleWorkoutCountChange = useCallback((details: ValueChangeDetails) => {
    setWorkoutCount(details.value);
  }, []);

  const handleMuscleSelectionTypeChange = useCallback((details: ValueChangeDetails) => {
    setMuscleSelectionType(details.value);
  }, []);

  const handlePlaceChange = useCallback((details: ValueChangeDetails) => {
    setPlace(details.value);
    setHasHomeEquipment(null);
  }, []);

  const handleHasHomeEquipmentChange = useCallback((details: ValueChangeDetails) => {
    setHasHomeEquipment(details.value);
  }, []);

  useEffect(() => {
    if (gender) {
      scrollAndFocus(genderSectionRef.current);
    }
  }, [gender, scrollAndFocus]);

  useEffect(() => {
    if (experience) {
      scrollAndFocus(experienceSectionRef.current);
    }
  }, [experience, scrollAndFocus]);

  useEffect(() => {
    if (workoutCount) {
      scrollAndFocus(workoutCountSectionRef.current);
    }
  }, [workoutCount, scrollAndFocus]);

  useEffect(() => {
    if (!muscleSelectionType) {
      return;
    }
    if (muscleSelectionType === RU.CREATE.OPTIONS.SELECTION.FULL_BODY) {
      scrollAndFocus(muscleSelectionSectionRef.current);
      return;
    }
    if (muscleSelectionType === RU.CREATE.OPTIONS.SELECTION.SELECT_MUSCLES) {
      let rafId = 0;
      const tryScroll = () => {
        const content = muscleSelectionContentRef.current;
        if (content && content.offsetHeight > 0) {
          scrollAndFocus(muscleSelectionSectionRef.current);
          return;
        }
        rafId = requestAnimationFrame(tryScroll);
      };
      rafId = requestAnimationFrame(tryScroll);
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, [muscleSelectionType, scrollAndFocus]);

  useEffect(() => {
    if (place) {
      scrollAndFocus(placeSectionRef.current);
    }
  }, [place, scrollAndFocus]);

  useEffect(() => {
    if (!isNullish(hasHomeEquipment)) {
      scrollAndFocus(homeEquipmentSectionRef.current);
    }
  }, [hasHomeEquipment, scrollAndFocus]);

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
    <>
      <PageHeader title={RU.CREATE.TITLES.GUIDED} />

      <PageContentWrapper>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Card.Root
              ref={genderSectionRef}
              size='sm'
              aria-labelledby="guided-gender-heading"
            >
              <Card.Header>
                <Heading id="guided-gender-heading" size="md">
                  {RU.CREATE.SECTIONS.GENDER}
                </Heading>
              </Card.Header>

              <Card.Body>
                <RadioGroup.Root
                  onValueChange={handleGenderChange}
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
              </Card.Body>
            </Card.Root>

            {
              gender && (
                <Card.Root
                  ref={experienceSectionRef}
                  size='sm'
                  aria-labelledby="guided-experience-heading"
                >
                  <Card.Header>
                    <Heading id="guided-experience-heading" size="md">
                      {RU.CREATE.SECTIONS.EXPERIENCE}
                    </Heading>
                  </Card.Header>

                  <Card.Body>
                    <RadioGroup.Root
                      onValueChange={handleExperienceChange}
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
                  </Card.Body>
                </Card.Root>
              )
            }

            {
              gender && experience && (
                <Card.Root
                  ref={workoutCountSectionRef}
                  size='sm'
                  aria-labelledby="guided-workout-count-heading"
                >
                  <Card.Header>
                    <Heading id="guided-workout-count-heading" size="md">
                      {RU.CREATE.SECTIONS.WORKOUT_COUNT}
                    </Heading>
                  </Card.Header>

                  <Card.Body>
                    <RadioGroup.Root
                      onValueChange={handleWorkoutCountChange}
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
                  </Card.Body>
                </Card.Root>
              )
            }

            {
              workoutCount && (
                <Card.Root
                  ref={muscleSelectionSectionRef}
                  size='sm'
                  aria-labelledby="guided-muscle-selection-heading"
                >
                  <Card.Header>
                    <Heading id="guided-muscle-selection-heading" size="md">
                      {RU.CREATE.SECTIONS.MUSCLE_SELECTION}
                    </Heading>
                  </Card.Header>

                  <Card.Body>
                    <Stack gap={4}>
                      <RadioGroup.Root
                        onValueChange={handleMuscleSelectionTypeChange}
                      >
                        <Wrap>
                          {
                            [
                              RU.CREATE.OPTIONS.SELECTION.FULL_BODY,
                              RU.CREATE.OPTIONS.SELECTION.SELECT_MUSCLES
                            ].map(option => (
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
                              <Center>
                                <Spinner />
                              </Center>
                            }>
                            <Box ref={muscleSelectionContentRef}>
                              <MuscleSelection />
                            </Box>
                          </Suspense>
                        )
                      }
                    </Stack>
                  </Card.Body>
                </Card.Root>
              )
            }

            {
              workoutCount && muscleSelectionType && (
                <Card.Root
                  ref={placeSectionRef}
                  size='sm'
                  aria-labelledby="guided-place-heading"
                >
                  <Card.Header>
                    <Heading id="guided-place-heading" size="md">
                      {RU.CREATE.SECTIONS.PLACE}
                    </Heading>
                  </Card.Header>

                  <Card.Body>
                    <RadioGroup.Root
                      onValueChange={handlePlaceChange}
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
                  </Card.Body>

                  <Card.Footer>
                    {
                      workoutCount && place === RU.CREATE.OPTIONS.PLACES[1] && (
                        <Box role="note" aria-live="polite">
                          <Text fontSize="sm" color="gray.600">
                            {RU.CREATE.MESSAGES.GYM_EQUIPMENT}
                          </Text>
                        </Box>
                      )
                    }
                  </Card.Footer>
                </Card.Root>
              )
            }

            {
              workoutCount && place === RU.CREATE.OPTIONS.PLACES[0] && (
                <Card.Root
                  ref={homeEquipmentSectionRef}
                  size='sm'
                  aria-labelledby="guided-home-equipment-heading"
                >
                  <Card.Header>
                    <Heading id="guided-home-equipment-heading" size="md">
                      {RU.CREATE.SECTIONS.HOME_EQUIPMENT}
                    </Heading>
                  </Card.Header>

                  <Card.Body>
                    <RadioGroup.Root
                      onValueChange={handleHasHomeEquipmentChange}
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
                      hasHomeEquipment === RU.CREATE.OPTIONS.ACCEPT[0] && (
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
                  </Card.Body>
                </Card.Root>
              )
            }

            <Button
              type="submit"
              loading={isLoading}
            >
              {RU.ACTIONS.CONTINUE}
            </Button>
          </Stack>
        </form>
      </PageContentWrapper>
    </>
  );
};
