import { FieldItem } from '../types/GridField.js';
import { RefValue } from '../types/RefValue.js';
import { GridMain } from '../view/GridMain.js';
import { CellInfo, Config } from '../types/GridConfig.js';
import { CellRenderer } from './CellRenderer';
export declare abstract class ViewCellRenderer extends CellRenderer {
    private readonly isRefFunction;
    private readonly isRefString;
    private readonly isVauleFunction;
    protected readonly refValue: any;
    protected isClick: boolean;
    protected readonly cfg: Config;
    constructor(field: FieldItem, gridMain: GridMain);
    getRefValue(value: any, rowItem?: any): RefValue;
    /**
     * 값 얻기
     * @param rowItem row item
     * @returns
     */
    getValue(rowItem: any): any;
    tooltip(element: HTMLElement, value: any): void;
    /**
     * cell click event
     * @param e click event object
     * @param eventElement  event element
     * @param cellInfo  cell info
     */
    click(e: Event, eventElement: HTMLElement, cellInfo: CellInfo): void;
    /**
     * 랜더러가 editor 랜더러 인지 여부
     *
     * @returns {boolean}
     */
    supportsEdit(): boolean;
    isClickEnabled(): boolean;
}
