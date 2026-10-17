import { CellInfo, Config } from '../types/GridConfig.js';
import { GridOptions } from '../types/GridOptions.js';
import { GridMain } from '../view/GridMain.js';
import { FieldItem } from '../types/GridField.js';
export declare abstract class CellRenderer {
    protected field: FieldItem;
    protected fieldName: string;
    protected gridMain: GridMain;
    protected language: import("../util/Language").Language;
    protected readonly enabledTooltip: boolean;
    constructor(field: FieldItem, gridMain: GridMain);
    /**
     * 편집 기능을 지원하는지 여부
     *
     * @returns {boolean}
     */
    abstract supportsEdit(): boolean;
    /**
     * view render
     *
     * @param {HTMLElement} element td element
     * @param {*} value value row item
     */
    abstract render(cellInfo: CellInfo, element: HTMLElement): void;
    abstract tooltip(element: HTMLElement, value: any): void;
    abstract getValue(rowItem: any, initValue?: any): any;
    getClosestCellElement(target: HTMLElement): HTMLElement;
    supportsInteraction(): boolean;
    bindEvents(eventType: string, cellInfo: CellInfo, element: HTMLElement): boolean;
    /**
     *  값 정렬 스타일
     * @returns {string} align style
     */
    alignStyle(): string;
    /**
     *
     * @param cfg 설정
     * @param opts 옵션
     * @param checkWidth
     * @returns
     */
    getMinWidth(cfg: Config, opts: GridOptions): number;
    applyRendererRefState(contentElement: HTMLElement, refValue: any): false | undefined;
}
