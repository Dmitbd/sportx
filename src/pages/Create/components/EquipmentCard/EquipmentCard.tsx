import { Accordion, Span, NumberInput, HStack, IconButton, Field } from "@chakra-ui/react";
import { useState, useCallback } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

export const EquipmentCard = ({
  item
}: {
  item: string
}) => {
  const [count, setCount] = useState<number>(0);

  const increment = useCallback(() => setCount(prev => Math.min(prev + 1, 10)), []);

  const decrement = useCallback(() => setCount(prev => Math.max(prev - 1, 0)), []);

  return (
    <Accordion.Item value={item}>
      <Accordion.ItemTrigger>
        <Span flex="1">{item}</Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <NumberInput.Root defaultValue="0" unstyled spinOnPress={false} value={String(count)}>
          <HStack gap="2">
            <NumberInput.DecrementTrigger asChild onClick={decrement}>
              <IconButton variant="outline" size="sm">
                <LuMinus />
              </IconButton>
            </NumberInput.DecrementTrigger>
            <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
            <NumberInput.IncrementTrigger asChild onClick={increment}>
              <IconButton variant="outline" size="sm">
                <LuPlus />
              </IconButton>
            </NumberInput.IncrementTrigger>
          </HStack>
        </NumberInput.Root>
        <Accordion.ItemBody>
          {/* TODO добавить валидацию веса */}
          {
            Array(count).fill(0).map((_item, index) => (
              <Field.Root key={index} invalid={false}>
                <Field.Label>Укажите вес в кг.</Field.Label>
                <NumberInput.Root defaultValue="0" width="200px" min={0} max={50}>
                  <NumberInput.Control />
                  <NumberInput.Input />
                </NumberInput.Root>
                <Field.HelperText>Для грамм указывайте (0.1)</Field.HelperText>
                <Field.ErrorText>The entry is invalid</Field.ErrorText>
              </Field.Root>
            ))
          }
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};
