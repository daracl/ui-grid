import { ToolbarFieldItem } from '../../types/Toolbar.js';
import { ValidResult } from '../../types/ValidResult.js';
import { GridMain } from '../../view/GridMain.js';
import { ToolBarRenderer } from '../ToolBarRenderer';
/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ToolBarRenderer}
 */
export declare class DropdownRenderer extends ToolBarRenderer {
    private dropdownElement;
    private selectLabelElement;
    private readonly labelKey;
    private readonly valueKey;
    private readonly isMultiple;
    private readonly valueDelimiter;
    private valueLabelMap;
    private listItems;
    private selectValues;
    private readonly required;
    private readonly useIncludeAllOption;
    constructor(field: ToolbarFieldItem, gridMain: GridMain);
    getListItems(): void;
    render(element: HTMLElement): void;
    initEvent(buttonElement: HTMLElement): void;
    valid(value: any): ValidResult | boolean;
    private editRender;
    /**
     * dropdown list open
     *
     * @private
     * @param {HTMLElement} buttonElement cell element
     * @param {HTMLElement} dropdownElement dropdown element
     */
    private openMenu;
    setValue(value: string | string[]): void;
    private dropdownMenuTemplate;
    getValue(): string[];
}
