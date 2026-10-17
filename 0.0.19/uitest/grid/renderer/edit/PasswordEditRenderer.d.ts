import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { TextAbstractRenderer } from './TextAbstractRenderer';
/**
 * password renderer
 *
 * @class PasswordEditRenderer
 * @typedef {PasswordEditRenderer}
 * @extends {EditCellRenderer}
 */
export declare class PasswordEditRenderer extends TextAbstractRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
}
