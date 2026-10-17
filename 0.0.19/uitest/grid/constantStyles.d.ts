export declare const GRID_THEME: {
    readonly light: "dg-light";
    readonly dark: "dg-dark";
};
export type ThemeType = keyof typeof GRID_THEME;
export declare const BODY_STYLE: {
    readonly default: "default";
    readonly striped: "striped";
    readonly borderless: "borderless";
    readonly rows: "rows";
    readonly cells: "cells";
    readonly stripedRows: "striped-rows";
    readonly stripedCells: "striped-cells";
};
export type BodyStyle = keyof typeof BODY_STYLE;
export declare const TEXT_ALIGN_STYLE: {
    readonly left: "dg-text-al";
    readonly center: "dg-text-ac";
    readonly right: "dg-text-ar";
};
export type TextAlignType = keyof typeof TEXT_ALIGN_STYLE;
export declare const WHITE_SPACE: {
    readonly pre: "pre";
    readonly wrap: "pre-wrap";
    readonly line: "pre-line";
    readonly normal: "normal";
};
export type WhiteSpaceType = keyof typeof WHITE_SPACE;
export declare const SELECTED_STYLE_CLASS = "dg-selected";
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
export declare const RENDERER_VARIANTS: Record<string, Record<string, string>>;
