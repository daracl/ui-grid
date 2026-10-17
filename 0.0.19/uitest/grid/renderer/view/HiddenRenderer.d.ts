import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
/**
 * hidden renderer
 *
 * @class HiddenRenderer
 * @typedef {HiddenRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class HiddenRenderer extends ViewCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
}
