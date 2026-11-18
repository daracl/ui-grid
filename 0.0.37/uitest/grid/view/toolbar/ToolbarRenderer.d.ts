import { ToolbarOptions } from '../../types/GridOptions.js';
import { ToolbarFieldItem, ToolbarLayout } from '../../types/Toolbar.js';
import { GridMain } from '../GridMain.js';
export declare class ToolbarRenderer {
    private readonly gridMain;
    private readonly toolbarElement;
    private readonly toolbarOpts;
    private readonly toolbarFields;
    private readonly conditionFields;
    private readonly fieldElements;
    private toolbarLayouts;
    constructor(gridMain: GridMain, toolbarElement: HTMLElement, toolbarOpts: ToolbarOptions);
    init(): void;
    getLayouts(): ToolbarLayout[][];
    getFields(): ToolbarFieldItem[];
    getConditionFields(): ToolbarFieldItem[];
    setValues(values: Record<string, unknown>): void;
    getValues(): Record<string, unknown>;
    refreshConditionFields(): void;
    refreshLayout(): void;
    private initRenderer;
    private createToolbarField;
    private createTemplate;
    /**
     * 행 생성. 위치(left, center, right)별 zone을 flex로 배치하며 폭 계산은 CSS가 처리한다.
     */
    private createRow;
    private createSection;
    /**
     * 필드 사이 간격(gap)을 margin으로 반영한다. 숨김 필드는 간격 계산에서 제외한다.
     */
    private buildSectionLayout;
    private createField;
    private setWidth;
}
