import { ValidResult } from '../../types/ValidResult.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { EditCellRenderer } from '../EditCellRenderer.js';
/**
 * dropdown edit renderer
 *
 * @class DropdownEditRenderer
 * @typedef {DropdownEditRenderer}
 * @extends {EditCellRenderer}
 */
export declare class DropdownEditRenderer extends EditCellRenderer {
    private dropdownElement;
    private currentEditRow;
    private readonly labelKey;
    private readonly valueKey;
    private readonly isMultiple;
    private readonly valueDelimiter;
    private listItems;
    private readonly useIncludeAllOption;
    private readonly required;
    private currentCellInfo;
    constructor(field: FieldItem, gridMain: GridMain);
    valid(value: any): ValidResult | boolean;
    render(cellInfo: CellInfo, cellElement: HTMLElement): void;
    initDropdownEvt(): void;
    /**
     * dropdown list open
     *
     * @private
     * @param {HTMLElement} cellElement cell element
     * @param {HTMLElement} dropdownElement dropdown element
     */
    private openMenu;
    setDropItemCheck(value?: string | string[]): void;
    private dropdownMenuTemplate;
}
