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
     @param {CellInfo} cellInfo cell info
     */
    abstract render(cellInfo: CellInfo, element: HTMLElement): void;
    abstract tooltip(element: HTMLElement, value: any): void;
    abstract getValue(rowItem: any, initValue?: any): any;
    getClosestCellElement(target: HTMLElement): HTMLElement;
    supportsInteraction(): boolean;
    /**
     * 그리드를 파괴할 때 호출된다. 그리드 바깥(document 등)에 만든 요소가 있으면 여기서 제거한다.
     */
    destroy(): void;
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
     * @returns
     */
    getMinWidth(cfg: Config, opts: GridOptions): number;
    applyRendererRefState(contentElement: HTMLElement, refValue: any): false | undefined;
}
