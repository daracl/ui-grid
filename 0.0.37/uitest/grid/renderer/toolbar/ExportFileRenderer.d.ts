import { GridMain } from '../../view/GridMain.js';
import type { ToolbarFieldItem } from '../../types/Toolbar.js';
import { DropdownRenderer } from './DropdownRenderer';
/** 형식을 선택한 뒤 별도 버튼으로 다운로드하는 툴바 렌더러. */
export declare class ExportFileRenderer extends DropdownRenderer {
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
}
