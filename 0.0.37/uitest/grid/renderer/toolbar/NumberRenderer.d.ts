import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * number renderer
 *
 * @typedef {NumberRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class NumberRenderer extends ToolBarRenderer {
    private editElement;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    getValue(): string;
    setValue(value: string): void;
}
