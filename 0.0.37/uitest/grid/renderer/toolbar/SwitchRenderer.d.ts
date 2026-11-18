import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * Switch renderer
 *
 * @class SwitchRenderer
 * @typedef {SwitchRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class SwitchRenderer extends ToolBarRenderer {
    private readonly trueValue;
    private readonly falseValue;
    private sliderElement;
    private labelElement;
    private checked;
    private readonly showLabel;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    initClick(contentElement: HTMLElement): void;
    getValue(): string | boolean;
    setValue(value: any): void;
    setChecked(checked: boolean): void;
}
