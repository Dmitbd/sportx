export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface PageHeaderProps {
  /** Заголовок страницы */
  title: string;
  /** Показывать ли кнопку `назад` */
  hasShowBackButton?: boolean;
  /** Доп. параметры для кнопки `назад` */
  backButtonConfig?: {
    /** навигация */
    to?: string;
  };
  /** Доп. действия на странице */
  actions?: PageHeaderAction[];
};
