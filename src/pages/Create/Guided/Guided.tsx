import { Accordion, Box, Button, Card, CardBody, Heading, HStack, RadioGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { EquipmentCard } from "../components";
import { Link } from "react-router-dom";

export const Guided = () => {
  const [workoutCount, setWorkoutCount] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [hasHomeEquipment, setHasHomeEquipment] = useState<string | null>(null);

  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Card.Root>
        <CardBody>
          <Heading as="h2" size="md" mb={6}>
            Создание программы тренировок
          </Heading>

          <form>
            <Stack gap={6}>
              <Stack>
                <Heading as="h3" size="sm">
                  Сколько тренировок в неделю?
                </Heading>
                <RadioGroup.Root onValueChange={(e) => setWorkoutCount(e.value)}>
                  <HStack align="stretch">
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                      <RadioGroup.Item key={item} value={String(item)} >
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </HStack>
                </RadioGroup.Root>
              </Stack>
              {
                workoutCount && (
                  <Stack>
                    <Heading as="h3" size="sm">
                      Где вы планируете тренироваться?
                    </Heading>
                    <RadioGroup.Root onValueChange={(e) => setPlace(e.value)}>
                      <HStack align="stretch">
                        {['Дома', 'В зале', 'На улице'].map((item) => (
                          <RadioGroup.Item key={item} value={item}>
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
                    <Heading as="h3" size="sm">
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
                        <Accordion.Root variant='enclosed' collapsible>
                          {['Гриф для штанги', 'Гриф для гантели', 'Гантели', 'Блины', 'Резинки'].map((item, index) => (
                            <EquipmentCard key={index} item={item} />
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
                    <Heading as="h3" size="sm">
                      {/* TODO определиться с логикой зала */}
                      Что-то про улицу
                    </Heading>
                  </Stack>
                )
              }

              {
                workoutCount && place === 'На улице' && (
                  <Stack>
                    <Heading as="h3" size="sm">
                      Какой есть инвентарь на улице?
                    </Heading>
                  </Stack>
                )
              }

              <Button type="submit" colorScheme="blue" mt={4} asChild onClick={handleSubmit}>
                <Link to={'/workouts/create/confirm'}>Продолжить</Link>
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card.Root>
    </Box>
  );
};
