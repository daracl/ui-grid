import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class TextRenderer extends ViewCellRenderer {
    private initializedElements;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    supportsEdit(): boolean;
    initEvent(contentElement: HTMLElement): void;
}
