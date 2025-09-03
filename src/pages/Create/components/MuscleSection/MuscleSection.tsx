import { useGuidedFormStore } from "@/stores";
import { Box, Card, Center, Heading, RadioGroup, Spinner, Stack, Wrap } from "@chakra-ui/react";
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/radio-group/namespace";
import { lazy, Suspense, useCallback, useEffect, useRef, type FC } from "react";
import { DEFAULT_SCROLL_CONFIG, useProgressiveScroll } from "../../Hooks";
import { RU } from "@/locales";

const MuscleSelection = lazy(() => import("./MuscleSelection")
  .then(m => ({ default: m.MuscleSelection })));

const {
  CREATE: {
    SECTIONS: {
      MUSCLE_SELECTION
    },
    OPTIONS: {
      SELECTION: {
        FULL_BODY,
        SELECT_MUSCLES
      }
    }
  }
} = RU;

/** Компонент выбора схемы проработки мышц в форме `guided` */
export const MuscleSection: FC = () => {
  const { muscleSelection, setMuscleSelection } = useGuidedFormStore();

  const { scrollAndFocus, scrollWithContentWait } = useProgressiveScroll(DEFAULT_SCROLL_CONFIG);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleMuscleSelectionChange = useCallback((details: ValueChangeDetails) => {
    setMuscleSelection(details.value);
  }, [setMuscleSelection]);

  useEffect(() => {
    if (!muscleSelection) {
      return;
    }
    if (muscleSelection === FULL_BODY) {
      scrollAndFocus(sectionRef.current);
      return;
    }
    if (muscleSelection === SELECT_MUSCLES) {
      return scrollWithContentWait(contentRef, sectionRef);
    }
  }, [muscleSelection, scrollAndFocus, scrollWithContentWait]);

  return (
    <Card.Root
      ref={sectionRef}
      size='sm'
      aria-labelledby="guided-muscle-selection-heading"
    >
      <Card.Header>
        <Heading
          id="guided-muscle-selection-heading"
          size="md"
        >
          {MUSCLE_SELECTION}
        </Heading>
      </Card.Header>

      <Card.Body>
        <Stack gap={4}>
          <RadioGroup.Root onValueChange={handleMuscleSelectionChange}>
            <Wrap>
              {[
                RU.CREATE.OPTIONS.SELECTION.FULL_BODY,
                RU.CREATE.OPTIONS.SELECTION.SELECT_MUSCLES
              ].map(option => (
                <RadioGroup.Item key={option} value={String(option)}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>
                    {option}
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </Wrap>
          </RadioGroup.Root>

          {muscleSelection === RU.CREATE.OPTIONS.SELECTION.SELECT_MUSCLES && (
            <Suspense fallback={<Center><Spinner /></Center>}>
              <Box ref={contentRef}>
                <MuscleSelection />
              </Box>
            </Suspense>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
