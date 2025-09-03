import { Button, Stack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { ExperienceSection, WorkoutCountSection, MuscleSection, PlaceSection, HomeEquipmentSection } from "../components";
import { useNavigate } from "react-router-dom";
import { useWorkoutPlanStore, useGuidedFormStore } from "@/stores";
import { PageContentWrapper, PageHeader } from "@/components";
import { workoutCreate } from "@/services";
import { askAI } from "@/services";
import { GenderSection } from "../components/GenderSection/GenderSection";
import { RU, ERRORS } from "@/locales";

const { CREATE, ACTIONS } = RU;
const { COMMON: COMMON_ERRORS } = ERRORS;

/**
 * @description Страница c формой сбора данных для создания плана тренировок
 * @returns Компонент страницы
 */
export const Guided = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setWorkoutPlan, setError } = useWorkoutPlanStore();
  const {
    gender,
    experience,
    workoutCount,
    place,
    equipmentList,
    muscleSelection,
  } = useGuidedFormStore();

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const prompt = workoutCreate.generateWorkoutPrompt(
        workoutCount!,
        place!,
        equipmentList
      );

      const aiResponse = await askAI([{ role: 'user', content: prompt }]);

      setWorkoutPlan(aiResponse.workouts);

      navigate('/workouts/create/confirm');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : COMMON_ERRORS.ERROR;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [workoutCount, place, equipmentList, setWorkoutPlan, setError, navigate]);

  return (
    <>
      <PageHeader title={CREATE.TITLES.GUIDED} />

      <PageContentWrapper>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <GenderSection />

            {
              gender && (
                <ExperienceSection />
              )
            }

            {
              experience && (
                <WorkoutCountSection />
              )
            }

            {
              workoutCount && (
                <MuscleSection />
              )
            }

            {
              muscleSelection && (
                <PlaceSection />
              )
            }

            {
              place === CREATE.OPTIONS.PLACES[0] && (
                <HomeEquipmentSection />
              )
            }

            <Button
              type="submit"
              loading={isLoading}
            >
              {ACTIONS.CONTINUE}
            </Button>
          </Stack>
        </form>
      </PageContentWrapper>
    </>
  );
};
