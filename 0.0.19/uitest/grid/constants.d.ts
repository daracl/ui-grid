export declare const INSTANCE_ATTR_KEY = "daracl-grid-id";
export type MODE = 'edit' | 'view';
export declare const SelectionModeMap: {
    readonly cell: "cell";
    readonly multiCell: "multiCell";
    readonly row: "row";
    readonly multiRow: "multiRow";
    readonly none: "none";
};
export type SelectionMode = (typeof SelectionModeMap)[keyof typeof SelectionModeMap];
export type DeleteMode = 'soft' | 'hard';
export declare const HoverModeMap: {
    readonly cell: "cell";
    readonly row: "row";
    readonly none: "none";
};
export type HoverMode = (typeof HoverModeMap)[keyof typeof HoverModeMap];
export declare const AlignStyleMap: {
    readonly left: "dg-left";
    readonly center: "dg-center";
    readonly right: "dg-right";
};
export type AlignStyle = (typeof AlignStyleMap)[keyof typeof AlignStyleMap];
export declare const RULES: {
    readonly NAN: "nan";
    readonly MIN: "minimum";
    readonly EXCLUSIVE_MIN: "exclusiveMinimum";
    readonly MAX: "maximum";
    readonly EXCLUSIVE_MAX: "exclusiveMaximum";
    readonly MIN_LENGTH: "minLength";
    readonly MAX_LENGTH: "maxLength";
    readonly BETWEEN: "between";
    readonly BETWEEN_EXCLUSIVE_MIN: "betweenExclusiveMin";
    readonly BETWEEN_EXCLUSIVE_MAX: "betweenExclusiveMax";
    readonly BETWEEN_EXCLUSIVE_MINMAX: "betweenExclusiveMinMax";
    readonly REGEXP: "regexp";
    readonly REQUIRED: "required";
    readonly VALIDATOR: "validator";
};
export declare const FIELD_PREFIX = "dg";
export type HorizontalRegion = 'left' | 'center' | 'right';
export type VerticalPosition = 'top' | 'bottom';
export type RegexpType = 'email' | 'url' | 'alpha' | 'alpha-num';
/**
 * 숫자 | 대문자 포함, 대문자 특수문자 포함, 대문자 특수문자 숫자
 */
export type PasswordType = 'number' | 'upper' | 'upper-special' | 'upper-special-number';
export type OrientationType = 'horizontal' | 'vertical';
export type AddItemPosition = 'before' | 'after' | 'inside';
export declare const ItemStatusMap: {
    CREATE: string;
    MODIFY: string;
    DELETE: string;
    READ: string;
};
export type ItemStatus = (typeof ItemStatusMap)[keyof typeof ItemStatusMap];
export declare const MovePositionMap: {
    readonly BEFORE: "before";
    readonly AFTER: "after";
    readonly INSIDE: "inside";
};
export type MovePosition = (typeof MovePositionMap)[keyof typeof MovePositionMap];
/**
 * Default cell padding values.
 */
export declare const CELL_PADDING: {
    horizontal: number;
    vertical: number;
};
/**
 * mouse move threshold
 */
export declare const MOUSE_MOVE_THRESHOLD = 5;
/**
 * default toolbar height
 *
 * @type {50}
 */
export declare const TOOLBAR_HEIGHT = 35;
export declare const DEFAULT_LINE_NUMBER_WIDTH = 40;
export declare const DEFAULT_ROW_CHECK_WIDTH = 27;
/**
 * default footer height
 *
 * @type {50}
 */
export declare const FOOTER_HEIGHT = 35;
export declare const ROW_KEY_PREFIX = "_dg";
/**
 * line number name
 *
 * @type {"$lineNumber"}
 */
export declare const LINE_NUMBER_NAME = "$lineNumber";
/**
 * row check name
 *
 * @type {"$rowCheck"}
 */
export declare const ROW_CHECK_NAME = "$rowCheck";
/**
 * row check key
 *
 * @type {"_dg$rowCheck"}
 */
export declare const ROW_CHECK_KEY: string;
export declare const ROW_FIELD: {
    readonly ID: "_dg$rowid";
    readonly DEPTH: "_dg$depth";
    readonly HEIGHT: "_dg$rowHeight";
    readonly CUD: "_$CUD";
    readonly ORIGINAL_ORDER: "_dg$originOrder";
    readonly ORIGINAL_VALUE: "_dg$ov";
};
/**
 * 전체 선택 value
 */
export declare const ALL_SELECT_VALUE = "$all$";
/**
 * row drag handle name
 *
 * @type {"$rowDragHandle"}
 */
export declare const ROW_DRAG_HANDLE_NAME = "$rowDragHandle";
/**
 * layer attribute name
 *
 * @type {"data-dg-grid-layer"}
 */
export declare const LAYER_ATTR_NAME = "data-dg-grid-layer";
/**
 * field layer class
 *
 * @type {"dg-field-layer"}
 */
export declare const FIELD_LAYER_CLASS = "dg-field-layer";
/**
 * item chunk size
 *
 * @type {1000}
 */
export declare const CHUNK_SIZE = 1000;
export declare const HIDDEN_ELEMENT_SELECTOR = ".dg-hidden-layers";
export declare const PointerStateMap: {
    readonly IDLE: "IDLE";
    readonly PRESSED: "PRESSED";
    readonly DRAGGING: "DRAGGING";
};
export declare const SCROLL_THUMB_MIN_SIZE = 18;
export declare const SCROLL_INSET = 4;
/**
 * Scroll direction for X-axis
 */
export declare const ScrollDirectionXMap: {
    readonly LEFT: "L";
    readonly RIGHT: "R";
};
export type ScrollDirectionX = (typeof ScrollDirectionXMap)[keyof typeof ScrollDirectionXMap];
/**
 * Scroll direction for Y-axis
 */
export declare const ScrollDirectionYMap: {
    readonly UP: "U";
    readonly DOWN: "D";
};
export type ScrollDirectionY = (typeof ScrollDirectionYMap)[keyof typeof ScrollDirectionYMap];
/**
 * body cell style class
 *
 * @type {{CELL: string, SELECTION: string, START_CELL: string}}
 */
export declare const BodyCellStyleMap: {
    readonly CELL: "dg-cell";
    readonly SELECTION: "dg-selection";
    readonly START_CELL: "dg-start-cell";
};
/**
 * match whole regex
 */
export declare const MATCH_WHOLE_REGEX: RegExp;
/**
 * 검색 방향
 */
export declare const SearchDirectionMap: {
    readonly PREV: "prev";
    readonly NEXT: "next";
};
export type SearchDirection = (typeof SearchDirectionMap)[keyof typeof SearchDirectionMap];
