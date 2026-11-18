import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { TextAbstractRenderer } from './TextAbstractRenderer';
/**
 * text edit renderer
 *
 * @typedef {TextEditRenderer}
 * @extends {TextAbstractRenderer}
 */
export declare class TextEditRenderer extends TextAbstractRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
}
