import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * search renderer
 *
 * @class SearchRenderer
 * @typedef {SearchRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class SearchRenderer extends ToolBarRenderer {
    private editElement;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    initEvt(contentElement: HTMLInputElement, btnElement: HTMLElement): void;
    getValue(): string;
    setValue(value: string): void;
}
