import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class ButtonRenderer extends ToolBarRenderer {
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    initEvent(contentElement: HTMLElement): void;
    getValue(): string;
    supportsEdit(): boolean;
    setValue(value: string | string[]): void;
}
