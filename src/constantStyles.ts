export const ALIGN_STYLE = {
  left: 'text-al',
  center: 'text-ac',
  right: 'text-ar',
} as const;

// theme type
export type THEME_TYPE = 'light' | 'dark';

export const GRID_THEME = {
  light: 'dg-light',
  dark: 'dg-dark',
} as const;

export const WHITE_SPACE = {
  pre: 'pre',
  wrap: 'pre-wrap',
  line: 'pre-line',
  normal: 'normal',
} as const;

export type WHITE_SPACE_TYPE = keyof typeof WHITE_SPACE;

export type TEXT_ALIGN_TYPE = keyof typeof ALIGN_STYLE;

export const SELECTED_STYLE_CLASS = 'selected';
