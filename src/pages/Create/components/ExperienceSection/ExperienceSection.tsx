import { useGuidedFormStore } from "@/stores";
import { Card, Heading, RadioGroup, Stack } from "@chakra-ui/react";
import type { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/radio-group/namespace";
import { useCallback, useEffect, useRef, type FC } from "react";
import { DEFAULT_SCROLL_CONFIG, useProgressiveScroll } from "../../Hooks";
import { ExperienceItem } from "./ExperienceItem";
import { EXPERIENCE_LEVELS } from "./constants";
import { RU } from "@/locales";

const {
  CREATE: {
    SECTIONS: {
      EXPERIENCE
    }
  }
} = RU;

/** Компонент выбора уровня опыта в форме `guided` */
export const ExperienceSection: FC = () => {
  const { experience, setExperience } = useGuidedFormStore();

  const { scrollAndFocus } = useProgressiveScroll(DEFAULT_SCROLL_CONFIG);

  const experienceSectionRef = useRef<HTMLDivElement | null>(null);

  const handleExperienceChange = useCallback((details: ValueChangeDetails) => {
    setExperience(details.value);
  }, [setExperience]);

  useEffect(() => {
    if (experience) {
      scrollAndFocus(experienceSectionRef.current);
    }
  }, [experience, scrollAndFocus]);

  return (
    <Card.Root
      ref={experienceSectionRef}
      size='sm'
      aria-labelledby="guided-experience-heading"
    >
      <Card.Header>
        <Heading
          id="guided-experience-heading"
          size="md"
        >
          {EXPERIENCE}
        </Heading>
      </Card.Header>

      <Card.Body>
        <RadioGroup.Root
          onValueChange={handleExperienceChange}
        >
          <Stack gap={3}>
            {EXPERIENCE_LEVELS.map(({ TITLE, DESCRIPTION }) => (
              <ExperienceItem
                key={TITLE}
                title={TITLE}
                description={DESCRIPTION}
              />
            ))}
          </Stack>
        </RadioGroup.Root>
      </Card.Body>
    </Card.Root>
  );
};
