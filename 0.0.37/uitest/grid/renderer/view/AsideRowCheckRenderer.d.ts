import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * Aside RowCheck Renderer
 *
 * @class AsideRowCheckRenderer
 * @typedef {AsideRowCheckRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class AsideRowCheckRenderer extends ViewCellRenderer {
    private readonly allowMultiSelect;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    initClick(contentElement: HTMLElement): void;
    /**
     * 단일 선택(Row Checkbox) 처리
     *
     * 다른 Row의 체크를 모두 해제한 후 현재 Row만 체크
     *
     * @param contentElement 체크박스 요소
     * @param cellInfo 현재 Cell 정보
     * @param currentChecked 현재 체크 여부
     */
    private singleRowCheck;
    /**
     * 다중 선택(Row Checkbox) 처리
     *
     * 현재 Row의 체크 상태를 토글
     *
     * @param contentElement 체크박스 요소
     * @param cellInfo 현재 Cell 정보
     * @param currentChecked 현재 체크 여부
     */
    private multipleRowCheck;
    alignStyle(): string;
}
