import { Stack } from "@chakra-ui/react";
import { memo, useCallback, useState } from "react";
import { entries } from "remeda";
import { muscleGroups, fullBodyOption } from "../../constants";
import { CustomCheckbox, CustomAccordion } from "@/shared";

/**
 * @description Компонент для выбора групп мышц, подгрупп и конкретных мышц для тренировки.
 * Предоставляет иерархическую структуру выбора с аккордеонами для удобной навигации.
 * Поддерживает выбор на трех уровнях: группы мышц, подгруппы и отдельные мышцы.
 * Автоматически управляет зависимостями между уровнями выбора.
 * 
 * @returns Компонент с интерфейсом выбора мышц
 */
export const MuscleSelection = memo(() => {
  const muscleGroupsEntries = entries(muscleGroups);

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
      if (groupKey === fullBodyOption) {
        setSelectedGroups([fullBodyOption]);
        setSelectedSubgroups([]);
        setSelectedMuscles([]);
        return;
      }

      // Если выбираем любую другую группу, снимаем "Все тело"
      const muscleSubgroup = muscleGroups[groupKey];
      const allSubgroups = Object.keys(muscleSubgroup);
      const allMuscles = Object.values(muscleSubgroup).flat();

      setSelectedGroups(prev => [...prev.filter(g => g !== fullBodyOption), groupKey]);
      setSelectedSubgroups(prev => [...prev, ...allSubgroups]);
      setSelectedMuscles(prev => [...prev, ...allMuscles]);
    } else {
      // Если снимаем "Все тело", просто убираем его
      if (groupKey === fullBodyOption) {
        setSelectedGroups(prev => prev.filter(g => g !== fullBodyOption));
        return;
      }

      // Если снимаем другую группу, убираем её и все связанные элементы
      const muscleSubgroup = muscleGroups[groupKey];
      const allSubgroups = Object.keys(muscleSubgroup);
      const allMuscles = Object.values(muscleSubgroup).flat();

      setSelectedGroups(prev => prev.filter(g => g !== groupKey));
      setSelectedSubgroups(prev => prev.filter(s => !allSubgroups.includes(s)));
      setSelectedMuscles(prev => prev.filter(m => !allMuscles.includes(m)));
    }
  }, []);

  const handleSubgroupSelection = useCallback((subgroupKey: string, groupKey: string) => (checked: boolean) => {
    // При выборе подгруппы снимаем "Все тело"
    if (checked) {
      const muscles = muscleGroups[groupKey][subgroupKey];

      setSelectedGroups(prev => [...prev.filter(g => g !== fullBodyOption), groupKey]);
      setSelectedSubgroups(prev => [...prev, subgroupKey]);
      setSelectedMuscles(prev => [...prev, ...muscles]);
    } else {
      const muscles = muscleGroups[groupKey][subgroupKey];

      setSelectedSubgroups(prev => {
        const newSubgroups = prev.filter(s => s !== subgroupKey);

        // Проверяем, нужно ли снять родительскую группу
        const shouldRemoveGroup = !Object.keys(muscleGroups[groupKey]).some(subKey =>
          newSubgroups.includes(subKey)
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
      setSelectedGroups(prev => [...prev.filter(g => g !== fullBodyOption), groupKey]);
      setSelectedSubgroups(prev => [...prev, subgroupKey]);
      setSelectedMuscles(prev => [...prev, muscle]);
    } else {
      setSelectedMuscles(prev => {
        const newMuscles = prev.filter(m => m !== muscle);

        // Проверяем, нужно ли снять родительскую подгруппу
        const shouldRemoveSubgroup = !muscleGroups[groupKey][subgroupKey].some(m =>
          newMuscles.includes(m)
        );

        if (shouldRemoveSubgroup) {
          setSelectedSubgroups(prevSubgroups => prevSubgroups.filter(s => s !== subgroupKey));
        }

        // Проверяем, нужно ли снять родительскую группу
        const shouldRemoveGroup = !Object.keys(muscleGroups[groupKey]).some(subKey =>
          shouldRemoveSubgroup ? true : selectedSubgroups.includes(subKey)
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
      {muscleGroupsEntries.map(([groupKey, muscleSubgroup]) => (
        <CustomAccordion
          key={groupKey}
          title={
            <CustomCheckbox
              checked={selectedGroups.includes(groupKey)}
              onChange={handleGroupSelection(groupKey)}
              label={groupKey}
              onClick={(e) => e.stopPropagation()}
            />
          }
          isOpen={openGroups.includes(groupKey)}
          onToggle={toggleGroup(groupKey)}
        >
          <Stack gap={2}>
            {entries(muscleSubgroup).map(([subgroupKey, muscles]) => (
              <CustomAccordion
                key={subgroupKey}
                title={
                  <CustomCheckbox
                    checked={selectedSubgroups.includes(subgroupKey)}
                    onChange={handleSubgroupSelection(subgroupKey, groupKey)}
                    label={subgroupKey}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                isOpen={openSubgroups.includes(subgroupKey)}
                onToggle={toggleSubgroup(subgroupKey)}
              >
                <Stack gap={1} pl={4}>
                  {muscles.map((muscle) => (
                    <CustomCheckbox
                      key={muscle}
                      checked={selectedMuscles.includes(muscle)}
                      onChange={handleMuscleSelection(muscle, groupKey, subgroupKey)}
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
