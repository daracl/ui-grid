import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { TextAbstractRenderer } from './TextAbstractRenderer';
/**
 * textarea renderer
 *
 * @class TextAreaRenderer
 * @typedef {TextAreaRenderer}
 * @extends {TextAbstractRenderer}
 */
export declare class TextAreaRenderer extends TextAbstractRenderer {
    private readonly editRendererInfo;
    private textareaElement;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    getElementValue(): string;
    valid(value: string): any;
}
