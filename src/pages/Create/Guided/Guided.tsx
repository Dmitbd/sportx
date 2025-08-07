import { Accordion, Box, Button, Card, CardBody, Heading, HStack, RadioGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { EquipmentCard } from "../components";
import { useNavigate } from "react-router-dom";
import type { EquipmentItem } from "../types";
import { initialItems } from "../constants";
import { useWorkoutStore } from "@/stores/workoutStore";

export const Guided = () => {
  const [workoutCount, setWorkoutCount] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [hasHomeEquipment, setHasHomeEquipment] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(initialItems);

  const navigate = useNavigate();
  const setWorkoutData = useWorkoutStore((state) => state.setWorkoutData);
  const generateWorkoutPlan = useWorkoutStore((state) => state.generateWorkoutPlan);
  const isLoading = useWorkoutStore((state) => state.isLoading);

  const handleItemUpdate = (updatedItem: EquipmentItem) => {
    setEquipmentList(prev =>
      prev.map(item => item.name === updatedItem.name ? updatedItem : item)
    );
  };

  const handleSubmit = async () => {
    // TODO делаем запрос, при успехе идем на страницу редактирования тренировок, при ошибке обработка ошибки

    await generateWorkoutPlan({
      workoutCount,
      place,
      equipment: equipmentList
    });

    setWorkoutData({
      workoutCount,
      place,
      equipment: equipmentList
    });

    navigate('/workouts/create/confirm');
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      position="relative"
    >
      <Card.Root>
        <CardBody>
          <Heading
            as="h2"
            size="md"
            mb={6}
          >
            Создание программы тренировок
          </Heading>
          <form>
            <Stack gap={6}>
              <Stack>
                <Heading
                  as="h3"
                  size="sm"
                >
                  Сколько тренировок в неделю?
                </Heading>
                <RadioGroup.Root
                  onValueChange={(e) => setWorkoutCount(e.value)}
                >
                  <HStack align="stretch">
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
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
                  </HStack>
                </RadioGroup.Root>
              </Stack>
              {
                workoutCount && (
                  <Stack>
                    <Heading
                      as="h3"
                      size="sm"
                    >
                      Где вы планируете тренироваться?
                    </Heading>
                    <RadioGroup.Root
                      onValueChange={(e) => setPlace(e.value)}
                    >
                      <HStack align="stretch">
                        {['Дома', 'В зале', 'На улице'].map((item) => (
                          <RadioGroup.Item
                            key={item}
                            value={item}
                          >
                            <RadioGroup.ItemHiddenInput />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
                          </RadioGroup.Item>
                        ))}
                      </HStack>
                    </RadioGroup.Root>
                  </Stack>
                )
              }

              {
                workoutCount && place === 'Дома' && (
                  <Stack>
                    <Heading
                      as="h3"
                      size="sm"
                    >
                      Есть ли у вас домашний инвентарь?
                    </Heading>
                    <RadioGroup.Root onValueChange={(e) => setHasHomeEquipment(e.value)}>
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
                      hasHomeEquipment && (
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
                  </Stack>
                )
              }

              {
                workoutCount && place === 'В зале' && (
                  <Stack>
                    <Heading
                      as="h3"
                      size="sm"
                    >
                      {/* TODO определиться с логикой зала */}
                      Что-то про улицу
                    </Heading>
                  </Stack>
                )
              }

              {
                workoutCount && place === 'На улице' && (
                  <Stack>
                    <Heading
                      as="h3"
                      size="sm"
                    >
                      Какой есть инвентарь на улице?
                    </Heading>
                  </Stack>
                )
              }
            </Stack>
            <Button
              colorScheme="blue"
              mt={4}
              onClick={handleSubmit}
            >
              Продолжить
            </Button>
          </form>
        </CardBody>
      </Card.Root>
      {
        isLoading && (
          // TODO: еще нужно подумать над реализацией 
          // (делать disabled для элементов на экране 
          // или компонент обертку с overlay) <- это звучит проще
          <Box pos="absolute" inset="0" bg="bg/80" h="full" w="full" />
        )
      }
    </Box>
  );
};
