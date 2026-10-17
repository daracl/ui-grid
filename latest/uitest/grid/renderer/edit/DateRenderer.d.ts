import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { TextAbstractRenderer } from './TextAbstractRenderer';
/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {TextAbstractRenderer}
 */
export declare class DateRenderer extends TextAbstractRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
}
