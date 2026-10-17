import { GridOptions } from './types/GridOptions.js';
import { Config, EditInfo, FieldHeaderGroupInfo, ScrollInfo, Selection, SelectionRange } from './types/GridConfig';
/**
 * grid default config
 */
export declare function initConfig(opts: GridOptions): Config;
/**
 * 선택영역 설정 정보
 *
 * @returns {Selection} 선택 영역 정보
 */
export declare function initSelectionInfo(): Selection;
export declare function initSelectionRange(): SelectionRange;
/**
 * scroll info
 *
 * @returns {ScrollInfo} scroll init info
 */
export declare function initScrollInfo(): ScrollInfo;
/**
 * field group info
 *
 * @returns {FieldHeaderGroupInfo}
 */
export declare function defaultFieldGroupInfo(): FieldHeaderGroupInfo;
/**
 * init edit info
 *
 * @returns {EditInfo} editinfo
 */
export declare function initEditInfo(): EditInfo;
