import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * date renderer
 *
 * @typedef {DateRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class DateRenderer extends ToolBarRenderer {
    private editElement;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    setValue(value: string): void;
    getValue(): string;
}
