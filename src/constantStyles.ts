// theme type
export const GRID_THEME = {
  light: 'dg-light',
  dark: 'dg-dark',
} as const;

export type ThemeType = keyof typeof GRID_THEME;

// align type
export const ALIGN_STYLE = {
  left: 'text-al',
  center: 'text-ac',
  right: 'text-ar',
} as const;

export type TextAlignType = keyof typeof ALIGN_STYLE;

export const WHITE_SPACE = {
  pre: 'pre',
  wrap: 'pre-wrap',
  line: 'pre-line',
  normal: 'normal',
} as const;

export type WhiteSpaceType = keyof typeof WHITE_SPACE;

export const SELECTED_STYLE_CLASS = 'selected';

// renderer style
export const RENDERER_VARIANTS = {
  box: 'dg-box',
  round: 'dg-round',
} as const;

export type RendererVariant = keyof typeof RENDERER_VARIANTS;
