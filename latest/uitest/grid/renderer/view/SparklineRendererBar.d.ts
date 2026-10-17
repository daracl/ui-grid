import { GridMain } from '../../view/GridMain.js';
import { CellInfo, Config } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridOptions } from '../../types/GridOptions.js';
/**
 * Sparkline bar renderer
 */
export declare class SparklineRendererBar extends ViewCellRenderer {
    /**
     * Renderer 하나당 tooltip 하나만 생성하여 재사용한다.
     */
    private rendererTooltip;
    /**
     * Grid에서 canvas가 다른 row에 재사용될 수 있으므로
     * canvas별 최신 tooltip 상태를 관리한다.
     */
    private readonly rendererTooltipStates;
    /**
     * Array reference 기반 render cache
     */
    private readonly dataIds;
    private dataIdSequence;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    /**
     * Canvas tooltip 이벤트 등록
     *
     * Canvas가 재사용되어도 이벤트를 중복 등록하지 않는다.
     */
    private bindTooltip;
    /**
     * Bar tooltip 처리
     */
    private handleTooltipMouseMove;
    /**
     * Tooltip 표시
     */
    private showTooltip;
    /**
     * Tooltip 숨김
     */
    private hideTooltip;
    /**
     * Array reference 기반 ID
     *
     * 같은 배열 reference를 사용하는 동안
     * Canvas redraw를 방지한다.
     *
     * 주의:
     * 배열 자체를 mutate하는 경우에는
     * 변경을 감지하지 못한다.
     */
    private getDataId;
    getMinWidth(cfg: Config, opts: GridOptions): number;
}
