import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { TextAbstractRenderer } from './TextAbstractRenderer';
/**
 * number renderer
 *
 * @class NumberEditRenderer
 * @typedef {NumberEditRenderer}
 * @extends {TextAbstractRenderer}
 */
export declare class NumberEditRenderer extends TextAbstractRenderer {
    private readonly editRendererInfo;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    valid(value: string): boolean;
}
