import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * hidden renderer
 * @class HiddenRenderer
 * @typedef {HiddenRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class HiddenRenderer extends ToolBarRenderer {
    private value;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    getValue(): any;
    supportsEdit(): boolean;
    setValue(value: string | string[]): void;
}
