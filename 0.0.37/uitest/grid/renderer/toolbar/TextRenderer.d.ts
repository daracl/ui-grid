import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class TextRenderer extends ToolBarRenderer {
    private editElement;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    getValue(): string;
    setValue(value: string): void;
}
