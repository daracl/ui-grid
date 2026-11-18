import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * custom renderer
 *
 * @class CustomRenderer
 * @typedef {CustomRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class CustomRenderer extends ToolBarRenderer {
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    getValue(): string;
    render(element: HTMLElement): void;
    valid(element: HTMLElement): any;
    setValue(values: any): void;
}
