import { GridMain } from '../../view/GridMain.js';
import { CellInfo, Config } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridOptions } from '../../types/GridOptions.js';
/**
 * tree renderer
 *
 * @typedef {TreeRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class TreeRenderer extends ViewCellRenderer {
    private readonly treeNodeIconClass;
    private readonly iconState;
    private readonly treeDataManager;
    constructor(field: FieldItem, gridMain: GridMain);
    /**
     * 트리 노드를 렌더링합니다.
     * @param cellInfo 셀 정보
     * @param element 셀 엘리먼트
     */
    render(cellInfo: CellInfo, element: HTMLElement): void;
    initExpanderEvent(expander: HTMLSpanElement): void;
    private toggle;
    bindEvents(eventType: string, cellInfo: CellInfo, element: HTMLElement): boolean;
    alignStyle(): "dg-text-al";
    supportsEdit(): boolean;
    getMinWidth(cfg: Config, opts: GridOptions): number;
}
