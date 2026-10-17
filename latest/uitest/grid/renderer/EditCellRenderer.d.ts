import { FieldItem } from '../types/GridField.js';
import { GridMain } from '../view/GridMain.js';
import { ValidResult } from '../types/ValidResult.js';
import { CellRenderer } from './CellRenderer';
export declare abstract class EditCellRenderer extends CellRenderer {
    protected readonly rendererContainer: HTMLElement;
    private validatorElement;
    private _editable;
    constructor(field: FieldItem, gridMain: GridMain);
    isEditable(): boolean;
    abstract valid(value: any): ValidResult | boolean;
    /**
     * 값 얻기
     *
     * @param {any} value row item
     * @returns {any} field value
     */
    getValue(item: any, inputValue?: any): any;
    completeEdit(): void;
    /**
     * 값 셋팅
     *
     * @public
     * @param {HTMLElement} element cell element
     * @param {any} value row value
     */
    setValue(e: Event, item: any, value: any, refresh?: boolean): false | undefined;
    changeEventCall(e: Event | null, item: any, value: any): boolean;
    tooltip(element: HTMLElement, value: any): void;
    /**
     * 유효성 검증 html element
     * @returns div element
     */
    getValidatorElement(): HTMLElement;
    /**
     * 유효성 메시지 보이기
     *
     * @param result 유효성 검증 결과
     * @param cellElement cell element
     * @returns
     */
    showInvalidMessage(result: ValidResult, cellElement: HTMLElement): boolean;
    supportsEdit(): boolean;
}
