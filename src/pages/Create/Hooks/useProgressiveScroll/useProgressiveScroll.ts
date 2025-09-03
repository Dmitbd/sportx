import { useCallback } from 'react';
import type { ScrollConfig } from './types';
import { DEFAULT_SCROLL_CONFIG } from './constants';

/**
 * Кастомный хук для скролла к контенту по его ref
 * @param config - файл конфигураций
 * @function scrollToElement - скролл по Y с добавлением отступа сверху
 * @function focusElement - добавление focus к элементу
 * @function scrollAndFocus - использует `scrollToElement` и `focusElement`
 * @function scrollWithContentWait - скролл к компоненту с динамическим отображением, на пример с `Suspense`
 * @returns методы хука
 */
export const useProgressiveScroll = (config: ScrollConfig = DEFAULT_SCROLL_CONFIG) => {
  const scrollToElement = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY - config.HEADER_OFFSET_PX;
    window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
  }, [config.HEADER_OFFSET_PX]);

  const focusElement = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    element.focus({ preventScroll: true });
  }, []);

  const scrollAndFocus = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }
    scrollToElement(element);
    requestAnimationFrame(() => focusElement(element));
  }, [scrollToElement, focusElement]);

  const scrollWithContentWait = useCallback((
    contentRef: React.RefObject<HTMLDivElement | null>,
    targetRef: React.RefObject<HTMLDivElement | null>,
    onComplete?: () => void
  ) => {
    let rafId = 0;
    let frameCount = 0;

    const tryScroll = () => {
      frameCount++;
      const content = contentRef.current;

      if (content && content.offsetHeight > 0) {
        scrollAndFocus(targetRef.current);
        if (onComplete) {
          onComplete();
        };
        return;
      }

      if (frameCount >= config.MAX_ANIMATION_FRAMES) {
        // Fallback: скролл когда контент прогрузится
        scrollAndFocus(targetRef.current);
        if (onComplete) {
          onComplete()
        };
        return;
      }

      rafId = requestAnimationFrame(tryScroll);
    };

    rafId = requestAnimationFrame(tryScroll);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      };
    };
  }, [scrollAndFocus, config.MAX_ANIMATION_FRAMES]);

  return {
    scrollToElement,
    focusElement,
    scrollAndFocus,
    scrollWithContentWait,
  };
};
