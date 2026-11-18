import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * label renderer
 *
 * @typedef {LabelRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class LabelRenderer extends ToolBarRenderer {
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    getValue(): string;
    setValue(value: string): void;
}
