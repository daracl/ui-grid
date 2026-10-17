import { EditRendererInfo, ViewRendererInfo } from './types/RendererInfo.js';
import { FieldItem } from './types/GridField.js';
import { GridOptions } from './types/GridOptions.js';
import { ToolbarFieldItem } from './types/Toolbar';
export declare function initGridOptions(options: GridOptions): GridOptions;
/**
 * 전역으로 옵션 설정.
 *
 * @param options 옵션
 */
export declare function setDefaultOptions(options: Partial<GridOptions>): void;
export declare const DEFAULT_RENDERER_INFO: ViewRendererInfo;
export declare const DEFAULT_EDIT_RENDERER_INFO: EditRendererInfo;
export declare const DEFAULT_TOOLBAR_FIELD_INFO: ToolbarFieldItem;
export declare const DEFAULT_FIELD_INFO: FieldItem;
