import { CELL_PADDING } from '@/constants';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridOptions } from '@/types/GridOptions';
import { getElementRect } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo, Config } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';

interface TooltipState {
  data: number[];
  width: number;
}

/**
 * Sparkline renderer
 */
export class SparklineRenderer extends ViewCellRenderer {
  private tooltip: HTMLDivElement | null = null;

  /**
   * Canvas별 tooltip 상태
   *
   * Grid에서 cell/canvas가 재사용될 수 있기 때문에
   * 이벤트 핸들러에서 data를 직접 closure로 잡지 않고
   * 최신 data를 여기서 교체한다.
   */
  private readonly tooltipStates = new WeakMap<HTMLCanvasElement, TooltipState>();

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;

    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);
    const data = refValue.value;

    // -------------------------
    // 데이터 없음
    // -------------------------

    if (!Array.isArray(data) || data.length === 0) {
      const canvas = element.firstElementChild;

      if (canvas) {
        canvas.remove();
      }

      this.hideTooltip();

      return;
    }

    // -------------------------
    // Cell size
    // -------------------------

    const cellElement = this.getClosestCellElement(element);

    const rect = getElementRect(cellElement);

    const width = Math.max(0, Math.floor(rect.width - CELL_PADDING.horizontal));

    const height = Math.max(0, Math.floor(rect.height - CELL_PADDING.vertical));

    if (width <= 0 || height <= 0) {
      return;
    }

    // -------------------------
    // Canvas
    // -------------------------

    let canvas = element.firstElementChild as HTMLCanvasElement | null;

    if (!canvas || canvas.tagName !== 'CANVAS') {
      canvas = document.createElement('canvas');

      element.replaceChildren(canvas);
    }

    const resized = canvas.width !== width || canvas.height !== height;

    if (resized) {
      canvas.width = width;
      canvas.height = height;
    }

    // -------------------------
    // Tooltip
    // -------------------------

    this.bindTooltip(canvas, data as number[], width);

    // -------------------------
    // Render cache
    // -------------------------

    const state = canvas.dataset;
    const dataId = this.getDataId(data);

    /**
     * Canvas 크기와 data가 모두 동일하면
     * Canvas drawing은 다시 하지 않는다.
     */
    if (!resized && state.dataId === dataId && state.dataLength === String(data.length)) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    // -------------------------
    // Min / Max
    // -------------------------

    let min = data[0];
    let max = data[0];

    for (let i = 1; i < data.length; i++) {
      const value = data[i];

      if (value < min) {
        min = value;
      }

      if (value > max) {
        max = value;
      }
    }

    const range = max - min || 1;

    // -------------------------
    // Graph size
    // -------------------------

    const xPadding = 5;
    const yPadding = 5;

    const graphWidth = Math.max(0, width - xPadding * 2);

    const graphHeight = Math.max(0, height - yPadding * 2);

    const lastIndex = data.length - 1;

    const step = lastIndex > 0 ? graphWidth / lastIndex : 0;

    // -------------------------
    // Clear
    // -------------------------

    ctx.clearRect(0, 0, width, height);

    // -------------------------
    // Line
    // -------------------------

    ctx.strokeStyle = '#007acc';
    ctx.lineWidth = 1;

    ctx.beginPath();

    for (let i = 0; i < data.length; i++) {
      const val = data[i];

      const x = xPadding + i * step;

      const y = yPadding + (1 - (val - min) / range) * graphHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // -------------------------
    // Points
    // -------------------------

    for (let i = 0; i < data.length; i++) {
      const val = data[i];

      const x = xPadding + i * step;

      const y = yPadding + (1 - (val - min) / range) * graphHeight;

      // 최대값
      if (val === max) {
        ctx.fillStyle = '#28a745';
      }
      // 최소값
      else if (val === min) {
        ctx.fillStyle = '#dc3545';
      }
      // 첫 번째 / 마지막
      else if (i === 0 || i === lastIndex) {
        ctx.fillStyle = '#0000ff';
      }
      // 일반 point
      else {
        ctx.fillStyle = '#ff9900';
      }

      ctx.beginPath();

      ctx.arc(x, y, 2.5, 0, Math.PI * 2);

      ctx.fill();
    }

    // -------------------------
    // Save render state
    // -------------------------

    state.dataId = dataId;
    state.dataLength = String(data.length);
  }

  /**
   * Canvas에 tooltip 이벤트를 한 번만 등록한다.
   *
   * Canvas가 Grid에 의해 재사용되는 경우에도
   * 최신 data를 사용하도록 TooltipState를 갱신한다.
   */
  private bindTooltip(canvas: HTMLCanvasElement, data: number[], width: number): void {
    let state = this.tooltipStates.get(canvas);

    // 최초 등록
    if (!state) {
      state = {
        data,
        width,
      };

      this.tooltipStates.set(canvas, state);

      canvas.addEventListener('mousemove', (event: MouseEvent) => {
        this.handleTooltipMouseMove(canvas, event);
      });

      canvas.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });

      return;
    }

    // Canvas가 다른 row에 재사용된 경우
    state.data = data;
    state.width = width;
  }

  /**
   * Tooltip mouse move 처리
   */
  private handleTooltipMouseMove(canvas: HTMLCanvasElement, event: MouseEvent): void {
    const state = this.tooltipStates.get(canvas);

    if (!state || state.data.length === 0) {
      this.hideTooltip();
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;

    const xPadding = 5;

    const graphWidth = state.width - xPadding * 2;

    if (graphWidth <= 0) {
      this.hideTooltip();
      return;
    }

    // Graph 영역 밖
    if (mouseX < xPadding || mouseX > state.width - xPadding) {
      this.hideTooltip();
      return;
    }

    const ratio = (mouseX - xPadding) / graphWidth;

    const lastIndex = state.data.length - 1;

    const index = Math.max(0, Math.min(lastIndex, Math.round(ratio * lastIndex)));

    const value = state.data[index];

    this.showTooltip(event.clientX, event.clientY, String(value));
  }

  /**
   * Tooltip 표시
   *
   * Renderer당 tooltip DOM 하나만 생성하여 재사용한다.
   */
  private showTooltip(x: number, y: number, value: string): void {
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');

      this.tooltip.style.cssText = `
        position: fixed;
        z-index: 99999;
        padding: 4px 7px;
        background: #333;
        color: #fff;
        border-radius: 3px;
        font-size: 12px;
        line-height: 1.2;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      `;

      document.body.appendChild(this.tooltip);
    }

    this.tooltip.textContent = value;

    this.tooltip.style.left = `${x + 10}px`;

    this.tooltip.style.top = `${y + 10}px`;

    this.tooltip.style.display = 'block';
  }

  /**
   * Tooltip 숨김
   */
  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
  }

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
  private readonly dataIds = new WeakMap<object, string>();

  private dataIdSequence = 0;

  private getDataId(data: unknown[]): string {
    let id = this.dataIds.get(data);

    if (!id) {
      id = String(++this.dataIdSequence);

      this.dataIds.set(data, id);
    }

    return id;
  }

  public getMinWidth(cfg: Config, opts: GridOptions) {
    return 60;
  }
}
