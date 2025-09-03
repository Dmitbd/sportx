import { useGuidedFormStore } from "@/stores";
import { Accordion, Card, Heading, RadioGroup, Wrap } from "@chakra-ui/react";
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/radio-group/namespace";
import { useCallback, useEffect, useRef, type FC } from "react";
import { DEFAULT_SCROLL_CONFIG, useProgressiveScroll } from "../../Hooks";
import { EquipmentCard } from "../EquipmentCard";
import { RU } from "@/locales";
import type { EquipmentItem } from "../../types";

const {
  CREATE: {
    SECTIONS: {
      HOME_EQUIPMENT
    },
    OPTIONS: {
      ACCEPT
    }
  }
} = RU;

/** Компонент выбора домашнего оборудования в форме `guided` */
export const HomeEquipmentSection: FC = () => {
  const {
    hasHomeEquipment,
    equipmentList,
    updateEquipmentItem,
    setHasHomeEquipment
  } = useGuidedFormStore();

  const { scrollAndFocus } = useProgressiveScroll(DEFAULT_SCROLL_CONFIG);

  const homeEquipmentSectionRef = useRef<HTMLDivElement | null>(null);

  const handleHasHomeEquipmentChange = useCallback((details: ValueChangeDetails) => {
    setHasHomeEquipment(details.value);
  }, [setHasHomeEquipment]);

  const handleItemUpdate = useCallback((updatedItem: EquipmentItem) => {
    updateEquipmentItem(updatedItem);
  }, [updateEquipmentItem]);

  useEffect(() => {
    if (hasHomeEquipment !== undefined) {
      scrollAndFocus(homeEquipmentSectionRef.current);
    }
  }, [hasHomeEquipment, scrollAndFocus]);

  return (
    <Card.Root
      ref={homeEquipmentSectionRef}
      size='sm'
      aria-labelledby="guided-home-equipment-heading"
    >
      <Card.Header>
        <Heading
          id="guided-home-equipment-heading"
          size="md"
        >
          {HOME_EQUIPMENT}
        </Heading>
      </Card.Header>

      <Card.Body>
        <RadioGroup.Root
          onValueChange={handleHasHomeEquipmentChange}
          mb={4}
        >
          <Wrap>
            {ACCEPT.map((item: string) => (
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

        {hasHomeEquipment === ACCEPT[0] && (
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
        )}
      </Card.Body>
    </Card.Root>
  );
};
