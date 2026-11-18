import { EditCellRenderer } from '../EditCellRenderer.js';
import { FieldItem } from '../../types/GridField.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
/**
 * custom renderer
 *
 * @class CustomEditRenderer
 * @typedef {CustomEditRenderer}
 * @extends {EditCellRenderer}
 */
export declare class CustomEditRenderer extends EditCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    valid(element: HTMLElement): any;
}
