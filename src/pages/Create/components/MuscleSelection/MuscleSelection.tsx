import { Stack } from "@chakra-ui/react";
import { memo, useCallback, useState } from "react";
import { MUSCLE_SELECTOR } from "../../constants";
import { CustomCheckbox, CustomAccordion } from "@/shared";
import { RU } from "@/locales";

/**
 * @description Компонент для выбора групп мышц, подгрупп и конкретных мышц для тренировки.
 * Предоставляет иерархическую структуру выбора с аккордеонами для удобной навигации.
 * Поддерживает выбор на трех уровнях: группы мышц, подгруппы и отдельные мышцы.
 * Автоматически управляет зависимостями между уровнями выбора.
 * 
 * @returns Компонент с интерфейсом выбора мышц
 */
export const MuscleSelection = memo(() => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedSubgroups, setSelectedSubgroups] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [openSubgroups, setOpenSubgroups] = useState<string[]>([]);

  const toggleGroup = useCallback((groupKey: string) => () => {
    setOpenGroups(prev => {
      if (prev.includes(groupKey)) {
        return prev.filter(g => g !== groupKey);
      } else {
        return [...prev, groupKey];
      }
    });
  }, []);

  const toggleSubgroup = useCallback((subgroupKey: string) => () => {
    setOpenSubgroups(prev => {
      if (prev.includes(subgroupKey)) {
        return prev.filter(s => s !== subgroupKey);
      } else {
        return [...prev, subgroupKey];
      }
    });
  }, []);

  const handleGroupSelection = useCallback((groupKey: string) => (checked: boolean) => {
    if (checked) {
      // Если выбираем "Все тело", очищаем все остальные выборы
      if (groupKey === RU.CREATE.OPTIONS.SELECTION.FULL_BODY) {
        setSelectedGroups([RU.CREATE.OPTIONS.SELECTION.FULL_BODY]);
        setSelectedSubgroups([]);
        setSelectedMuscles([]);
        return;
      }

      // Если выбираем любую другую группу, снимаем "Все тело"
      const muscleGroup = MUSCLE_SELECTOR.find(group => group.name === groupKey);

      if (muscleGroup) {
        const allSubgroups = muscleGroup.groups.map(group => group.name);
        const allMuscles = muscleGroup.groups.flatMap(group => group.parts);

        setSelectedGroups(prev => [...prev.filter(g => g !== RU.CREATE.OPTIONS.SELECTION.FULL_BODY), groupKey]);
        setSelectedSubgroups(prev => [...prev, ...allSubgroups]);
        setSelectedMuscles(prev => [...prev, ...allMuscles]);
      }
    } else {
      // Если снимаем "Все тело", просто убираем его
      if (groupKey === RU.CREATE.OPTIONS.SELECTION.FULL_BODY) {
        setSelectedGroups(prev => prev.filter(g => g !== RU.CREATE.OPTIONS.SELECTION.FULL_BODY));
        return;
      }

      // Если снимаем другую группу, убираем её и все связанные элементы
      const muscleGroup = MUSCLE_SELECTOR.find(group => group.name === groupKey);

      if (muscleGroup) {
        const allSubgroups = muscleGroup.groups.map(group => group.name);
        const allMuscles = muscleGroup.groups.flatMap(group => group.parts);

        setSelectedGroups(prev => prev.filter(g => g !== groupKey));
        setSelectedSubgroups(prev => prev.filter(s => !allSubgroups.includes(s)));
        setSelectedMuscles(prev => prev.filter(m => !allMuscles.includes(m)));
      }
    }
  }, []);

  const handleSubgroupSelection = useCallback((subgroupKey: string, groupKey: string) => (checked: boolean) => {
    // При выборе подгруппы снимаем "Все тело"
    if (checked) {
      const muscleGroup = MUSCLE_SELECTOR.find(group => group.name === groupKey);
      const subgroup = muscleGroup?.groups.find(group => group.name === subgroupKey);
      const muscles = subgroup?.parts ?? [];

      setSelectedGroups(prev => [...prev.filter(g => g !== RU.CREATE.OPTIONS.SELECTION.FULL_BODY), groupKey]);
      setSelectedSubgroups(prev => [...prev, subgroupKey]);
      setSelectedMuscles(prev => [...prev, ...muscles]);
    } else {
      const muscleGroup = MUSCLE_SELECTOR.find(group => group.name === groupKey);
      const subgroup = muscleGroup?.groups.find(group => group.name === subgroupKey);
      const muscles = subgroup?.parts ?? [];

      setSelectedSubgroups(prev => {
        const newSubgroups = prev.filter(s => s !== subgroupKey);

        // Проверяем, нужно ли снять родительскую группу
        const shouldRemoveGroup = !muscleGroup?.groups.some(group =>
          newSubgroups.includes(group.name)
        );

        if (shouldRemoveGroup) {
          setSelectedGroups(prevGroups => prevGroups.filter(g => g !== groupKey));
        }

        return newSubgroups;
      });
      setSelectedMuscles(prev => prev.filter(m => !muscles.includes(m)));
    }
  }, []);

  const handleMuscleSelection = useCallback((muscle: string, groupKey: string, subgroupKey: string) => (checked: boolean) => {
    // При выборе отдельной мышцы снимаем "Все тело"
    if (checked) {
      setSelectedGroups(prev => [...prev.filter(g => g !== RU.CREATE.OPTIONS.SELECTION.FULL_BODY), groupKey]);
      setSelectedSubgroups(prev => [...prev, subgroupKey]);
      setSelectedMuscles(prev => [...prev, muscle]);
    } else {
      setSelectedMuscles(prev => {
        const newMuscles = prev.filter(m => m !== muscle);

        const muscleGroup = MUSCLE_SELECTOR.find(group => group.name === groupKey);
        const subgroup = muscleGroup?.groups.find(group => group.name === subgroupKey);
        const subgroupMuscles = subgroup?.parts ?? [];

        // Проверяем, нужно ли снять родительскую подгруппу
        const shouldRemoveSubgroup = !subgroupMuscles.some(m =>
          newMuscles.includes(m)
        );

        if (shouldRemoveSubgroup) {
          setSelectedSubgroups(prevSubgroups => prevSubgroups.filter(s => s !== subgroupKey));
        }

        // Проверяем, нужно ли снять родительскую группу
        const shouldRemoveGroup = !muscleGroup?.groups.some(group =>
          shouldRemoveSubgroup ? true : selectedSubgroups.includes(group.name)
        );

        if (shouldRemoveGroup) {
          setSelectedGroups(prevGroups => prevGroups.filter(g => g !== groupKey));
        }

        return newMuscles;
      });
    }
  }, [selectedSubgroups]);

  return (
    <Stack gap={2}>
      {MUSCLE_SELECTOR.map((muscleGroup) => (
        <CustomAccordion
          key={muscleGroup.name}
          title={
            <CustomCheckbox
              checked={selectedGroups.includes(muscleGroup.name)}
              onChange={handleGroupSelection(muscleGroup.name)}
              label={muscleGroup.name}
              onClick={(e) => e.stopPropagation()}
            />
          }
          isOpen={openGroups.includes(muscleGroup.name)}
          onToggle={toggleGroup(muscleGroup.name)}
        >
          <Stack gap={2}>
            {muscleGroup.groups.map((subgroup) => (
              <CustomAccordion
                key={subgroup.name}
                title={
                  <CustomCheckbox
                    checked={selectedSubgroups.includes(subgroup.name)}
                    onChange={handleSubgroupSelection(subgroup.name, muscleGroup.name)}
                    label={subgroup.name}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                isOpen={openSubgroups.includes(subgroup.name)}
                onToggle={toggleSubgroup(subgroup.name)}
              >
                <Stack gap={1} pl={4}>
                  {subgroup.parts.map((muscle) => (
                    <CustomCheckbox
                      key={muscle}
                      checked={selectedMuscles.includes(muscle)}
                      onChange={handleMuscleSelection(muscle, muscleGroup.name, subgroup.name)}
                      label={muscle}
                    />
                  ))}
                </Stack>
              </CustomAccordion>
            ))}
          </Stack>
        </CustomAccordion>
      ))}
    </Stack>
  );
});
