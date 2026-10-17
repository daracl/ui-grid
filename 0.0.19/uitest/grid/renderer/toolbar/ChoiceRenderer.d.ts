import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { ValidResult } from '../../types/ValidResult.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * Selection renderer
 *
 * @class ChoiceRenderer
 * @typedef {ChoiceRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class ChoiceRenderer extends ToolBarRenderer {
    private readonly showLabel;
    private readonly labelKey;
    private readonly valueKey;
    private readonly isMultiple;
    private readonly valueDelimiter;
    private valueLabelMap;
    private listItems;
    private selectValues;
    private readonly labelOnly;
    private choiceContainer;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    render(element: HTMLElement): void;
    initTextEvt(contentElement: HTMLElement): void;
    getValue(): any;
    setValue(value: string | string[]): void;
    private template;
    valid(value: any): ValidResult | boolean;
}
