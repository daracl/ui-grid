// theme type
export const GRID_THEME = {
  light: 'dg-light',
  dark: 'dg-dark',
} as const;

export type ThemeType = keyof typeof GRID_THEME;

export const BODY_STYLE = {
  default: 'default',
  striped: 'striped',
  borderless: 'borderless',
  rows: 'rows',
  cells: 'cells',
  stripedRows: 'striped-rows',
  stripedCells: 'striped-cells',
} as const;

export type BodyStyle = keyof typeof BODY_STYLE;

// align type
export const TEXT_ALIGN_STYLE = {
  left: 'dg-text-al',
  center: 'dg-text-ac',
  right: 'dg-text-ar',
} as const;

export type TextAlignType = keyof typeof TEXT_ALIGN_STYLE;

export const WHITE_SPACE = {
  pre: 'pre',
  wrap: 'pre-wrap',
  line: 'pre-line',
  normal: 'normal',
} as const;

export type WhiteSpaceType = keyof typeof WHITE_SPACE;

export const SELECTED_STYLE_CLASS = 'dg-selected';

// renderer style
/**
 * Renderer별 지원하는 Variant 클래스 정의
 *
 * - key : Renderer Type
 * - value : Variant Name -> CSS Class
 *
 * Renderer가 Variant를 지원하지 않는 경우 빈 객체({})를 사용한다.
 *
 * Example)
 * button: {
 *   box: 'dg-box',
 *   round: 'dg-round',
 * }
 *
 * 사용 예)
 * const className = RENDERER_VARIANTS[rendererType]?.[variant];
 */
export const RENDERER_VARIANTS: Record<string, Record<string, string>> = {
  /** Progress Bar Renderer */
  bar: {},

  /** Button Renderer */
  button: {},

  /** Checkbox Renderer */
  checkbox: {},

  /** Choice Renderer */
  choice: {},

  /** Custom Renderer */
  custom: {},

  /** Date Renderer */
  date: {},

  /** Dropdown Renderer */
  dropdown: {},

  /** Hidden Renderer */
  hidden: {},

  /** HTML Renderer */
  html: {},

  /** Image Renderer */
  image: {},

  /** Link Renderer */
  link: {},

  /** Number Renderer */
  number: {},

  /** Password Renderer */
  password: {},

  /** Range Renderer */
  range: {},

  /** Search Renderer */
  search: {},

  /** Sparkline Renderer */
  sparkline: {},

  /** Sparkline Bar Renderer */
  sparklineBar: {},

  /** Switch Renderer */
  switch: {
    box: 'dg-box',
    round: 'dg-round',
  },

  /** Text Renderer */
  text: {},

  /** TextArea Renderer */
  textarea: {},

  /** Tree Renderer */
  tree: {},
};
