import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * link renderer
 *
 * @class LinkRenderer
 * @typedef {LinkRenderer}
 */
export declare class LinkRenderer extends ToolBarRenderer {
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    initEvent(contentElement: HTMLElement): void;
    getValue(): string;
    supportsEdit(): boolean;
    setValue(value: string): void;
}
