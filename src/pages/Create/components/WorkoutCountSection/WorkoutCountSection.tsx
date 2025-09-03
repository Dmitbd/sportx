import { useGuidedFormStore } from "@/stores";
import { Card, Heading, RadioGroup, Wrap } from "@chakra-ui/react";
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/radio-group/namespace";
import { useCallback, useEffect, useRef, type FC } from "react";
import { DEFAULT_SCROLL_CONFIG, useProgressiveScroll } from "../../Hooks";
import { RU } from "@/locales";

const {
  CREATE: {
    SECTIONS: {
      WORKOUT_COUNT
    },
    OPTIONS: {
      TRAINING_DAYS
    }
  }
} = RU;

/** Компонент выбора количества тренировок в форме `guided` */
export const WorkoutCountSection: FC = () => {
  const { workoutCount, setWorkoutCount } = useGuidedFormStore();

  const { scrollAndFocus } = useProgressiveScroll(DEFAULT_SCROLL_CONFIG);

  const workoutCountSectionRef = useRef<HTMLDivElement | null>(null);

  const handleWorkoutCountChange = useCallback((details: ValueChangeDetails) => {
    setWorkoutCount(details.value);
  }, [setWorkoutCount]);

  useEffect(() => {
    if (workoutCount) {
      scrollAndFocus(workoutCountSectionRef.current);
    }
  }, [workoutCount, scrollAndFocus]);

  return (
    <Card.Root
      ref={workoutCountSectionRef}
      size='sm'
      aria-labelledby="guided-workout-count-heading"
    >
      <Card.Header>
        <Heading
          id="guided-workout-count-heading"
          size="md"
        >
          {WORKOUT_COUNT}
        </Heading>
      </Card.Header>

      <Card.Body>
        <RadioGroup.Root
          onValueChange={handleWorkoutCountChange}
        >
          <Wrap>
            {TRAINING_DAYS.map((item) => (
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
  );
};
