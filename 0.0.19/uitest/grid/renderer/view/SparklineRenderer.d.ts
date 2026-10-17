import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridOptions } from '../../types/GridOptions.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo, Config } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * Sparkline renderer
 */
export declare class SparklineRenderer extends ViewCellRenderer {
    private rendererTooltip;
    /**
     * Canvas별 tooltip 상태
     *
     * Grid에서 cell/canvas가 재사용될 수 있기 때문에
     * 이벤트 핸들러에서 data를 직접 closure로 잡지 않고
     * 최신 data를 여기서 교체한다.
     */
    private readonly rendererTooltipStates;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    /**
     * Canvas에 tooltip 이벤트를 한 번만 등록한다.
     *
     * Canvas가 Grid에 의해 재사용되는 경우에도
     * 최신 data를 사용하도록 TooltipState를 갱신한다.
     */
    private bindTooltip;
    /**
     * Tooltip mouse move 처리
     */
    private handleTooltipMouseMove;
    /**
     * Tooltip 표시
     *
     * Renderer당 tooltip DOM 하나만 생성하여 재사용한다.
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
    private readonly dataIds;
    private dataIdSequence;
    private getDataId;
    getMinWidth(cfg: Config, opts: GridOptions): number;
}
