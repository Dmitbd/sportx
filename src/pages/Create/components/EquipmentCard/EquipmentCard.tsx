import { Accordion, Span, NumberInput, HStack, IconButton, Field } from "@chakra-ui/react";
import { useCallback } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import type { EquipmentItem } from "../../types";

export const EquipmentCard = ({
  item,
  onUpdate
}: {
  item: EquipmentItem;
  onUpdate: (updatedItem: EquipmentItem) => void;
}) => {
  const increment = useCallback(() => {
    const newItem: EquipmentItem = {
      ...item,
      units: [...item.units, [item.units.length + 1, 0]]
    };

    onUpdate(newItem);
  }, [item, onUpdate]);

  const decrement = useCallback(() => {
    if (item.units.length === 0) {
      return;
    }

    const newItem: EquipmentItem = {
      ...item,
      units: [...item.units.slice(0, -1)]
    };

    onUpdate(newItem);
  }, [item, onUpdate]);

  const handleWeightChange = useCallback((index: number, weight: number) => {
    const newUnits: EquipmentItem['units'] = item.units.map((unit, i) =>
      i === index
        ? [unit[0], weight]
        : unit
    );

    onUpdate({ ...item, units: newUnits });
  }, [item, onUpdate]);

  return (
    <Accordion.Item value={item.name}>
      <Accordion.ItemTrigger>
        <Span flex="1">
          {item.name}
        </Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <NumberInput.Root
          defaultValue="0"
          unstyled
          spinOnPress={false}
          value={String(item.units.length)}
        >
          <HStack gap="2">
            <NumberInput.DecrementTrigger
              asChild
              onClick={decrement}
            >
              <IconButton
                variant="outline"
                size="sm"
              >
                <LuMinus />
              </IconButton>
            </NumberInput.DecrementTrigger>
            <NumberInput.ValueText
              textAlign="center"
              fontSize="lg"
              minW="3ch"
            />
            <NumberInput.IncrementTrigger
              asChild
              onClick={increment}
            >
              <IconButton
                variant="outline"
                size="sm"
              >
                <LuPlus />
              </IconButton>
            </NumberInput.IncrementTrigger>
          </HStack>
        </NumberInput.Root>
        <Accordion.ItemBody>
          {/* TODO добавить валидацию веса */}
          {
            item.units.map(([number, weight], index) => (
              <Field.Root key={number} invalid={false}>
                <Field.Label>Укажите вес в кг.</Field.Label>
                <NumberInput.Root
                  defaultValue="0"
                  width="200px"
                  min={0}
                  max={50}
                  value={String(weight)}
                  onValueChange={({ value }) => handleWeightChange(index, Number(value))}
                >
                  <NumberInput.Control />
                  <NumberInput.Input />
                </NumberInput.Root>
                <Field.HelperText>
                  Для грамм указывайте (0.1)
                </Field.HelperText>
                <Field.ErrorText>
                  The entry is invalid
                </Field.ErrorText>
              </Field.Root>
            ))
          }
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};
