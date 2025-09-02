import type { PropsWithChildren } from "react";

export interface CustomAccordionProps extends PropsWithChildren {
  title: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};
