import { useGuidedFormStore } from "@/stores";
import { Box, Card, Heading, RadioGroup, Text, Wrap } from "@chakra-ui/react";
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/radio-group/namespace";
import { useCallback, useEffect, useRef, type FC } from "react";
import { DEFAULT_SCROLL_CONFIG, useProgressiveScroll } from "../../Hooks";
import { RU } from "@/locales";

const {
  CREATE: {
    SECTIONS: {
      PLACE
    },
    OPTIONS: {
      PLACES
    },
    MESSAGES: {
      GYM_EQUIPMENT
    }
  }
} = RU;

/** Компонент выбора места тренировок в форме `guided` */
export const PlaceSection: FC = () => {
  const { place, setPlace } = useGuidedFormStore();

  const { scrollAndFocus } = useProgressiveScroll(DEFAULT_SCROLL_CONFIG);

  const placeSectionRef = useRef<HTMLDivElement | null>(null);

  const handlePlaceChange = useCallback((details: ValueChangeDetails) => {
    setPlace(details.value);
  }, [setPlace]);

  useEffect(() => {
    if (place) {
      scrollAndFocus(placeSectionRef.current);
    }
  }, [place, scrollAndFocus]);

  return (
    <Card.Root
      ref={placeSectionRef}
      size='sm'
      aria-labelledby="guided-place-heading"
    >
      <Card.Header>
        <Heading
          id="guided-place-heading"
          size="md"
        >
          {PLACE}
        </Heading>
      </Card.Header>

      <Card.Body>
        <RadioGroup.Root
          onValueChange={handlePlaceChange}
        >
          <Wrap>
            {PLACES.map((item) => (
              <RadioGroup.Item
                key={item}
                value={item}
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
        {place === PLACES[1] && (
          <Box role="note" aria-live="polite">
            <Text fontSize="sm" color="gray.600">
              {GYM_EQUIPMENT}
            </Text>
          </Box>
        )}
      </Card.Footer>
    </Card.Root>
  );
};
