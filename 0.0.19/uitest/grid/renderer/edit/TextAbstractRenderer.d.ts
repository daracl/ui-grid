import { EditCellRenderer } from '../EditCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {EditCellRenderer}
 */
export declare abstract class TextAbstractRenderer extends EditCellRenderer {
    protected editElement: HTMLInputElement;
    protected item: any;
    protected cellElement: HTMLElement;
    protected cellInfo: CellInfo;
    protected isShow: boolean;
    constructor(field: FieldItem, gridMain: GridMain);
    initEvt(editElement: HTMLElement, item: any): void;
    getElementValue(): string;
    setChangeValue(e: Event, cancelFlag?: boolean): false | undefined;
    valid(value: string): any;
    protected textRender(cellInfo: CellInfo, element: HTMLElement, type: string): void;
}
