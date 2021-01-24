export interface Theme {
  key: ThemeKeyTypes;
  isActive: boolean;
  materialIcon: string;
}

export type ThemeKeyTypes = 'dark' | 'light' | 'default';
