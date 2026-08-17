import { getElementRect } from '@/util/domUtils';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { CELL_PADDING } from '@/constants';

interface TooltipState {
  data: number[];
  width: number;
  barWidth: number;
}

/**
 * Sparkline bar renderer
 */
export class SparklineRendererBar extends ViewCellRenderer {
  /**
   * Renderer 하나당 tooltip 하나만 생성하여 재사용한다.
   */
  private tooltip: HTMLDivElement | null = null;

  /**
   * Grid에서 canvas가 다른 row에 재사용될 수 있으므로
   * canvas별 최신 tooltip 상태를 관리한다.
   */
  private readonly tooltipStates = new WeakMap<HTMLCanvasElement, TooltipState>();

  /**
   * Array reference 기반 render cache
   */
  private readonly dataIds = new WeakMap<object, string>();

  private dataIdSequence = 0;

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
      element.replaceChildren();
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
    // Bar size
    // -------------------------

    const barWidth = width / data.length;

    // -------------------------
    // Tooltip
    // -------------------------

    this.bindTooltip(canvas, data as number[], width, barWidth);

    // -------------------------
    // Render cache
    // -------------------------

    const state = canvas.dataset;
    const dataId = this.getDataId(data);

    /**
     * 동일한 배열 + 동일한 크기라면
     * Canvas를 다시 그리지 않는다.
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
    // Graph
    // -------------------------

    const yPadding = 5;

    const graphHeight = Math.max(0, height - yPadding * 2);

    ctx.clearRect(0, 0, width, height);

    // -------------------------
    // Bars
    // -------------------------

    const lastIndex = data.length - 1;

    for (let i = 0; i < data.length; i++) {
      const val = data[i];

      const x = i * barWidth;

      const barHeight = ((val - min) / range) * graphHeight;

      const y = height - barHeight - yPadding;

      // 색상
      if (val === max) {
        ctx.fillStyle = '#28a745';
      } else if (val === min) {
        ctx.fillStyle = '#dc3545';
      } else if (i === 0 || i === lastIndex) {
        ctx.fillStyle = '#0000ff';
      } else {
        ctx.fillStyle = '#ff9900';
      }

      // barWidth이 너무 작은 경우
      // 음수 width가 들어가지 않도록 방어
      const drawWidth = Math.max(1, barWidth - 2);

      ctx.fillRect(x + 1, y, drawWidth, barHeight);
    }

    // -------------------------
    // Save render state
    // -------------------------

    state.dataId = dataId;
    state.dataLength = String(data.length);
  }

  /**
   * Canvas tooltip 이벤트 등록
   *
   * Canvas가 재사용되어도 이벤트를 중복 등록하지 않는다.
   */
  private bindTooltip(canvas: HTMLCanvasElement, data: number[], width: number, barWidth: number): void {
    let state = this.tooltipStates.get(canvas);

    // 최초 등록
    if (!state) {
      state = {
        data,
        width,
        barWidth,
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

    // Grid에서 canvas가 다른 cell에 재사용될 경우
    state.data = data;
    state.width = width;
    state.barWidth = barWidth;
  }

  /**
   * Bar tooltip 처리
   */
  private handleTooltipMouseMove(canvas: HTMLCanvasElement, event: MouseEvent): void {
    const state = this.tooltipStates.get(canvas);

    if (!state || state.data.length === 0) {
      this.hideTooltip();
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;

    // Canvas 밖
    if (mouseX < 0 || mouseX > state.width) {
      this.hideTooltip();
      return;
    }

    /**
     * 현재 마우스가 위치한 bar index
     *
     * barWidth:
     * 10
     *
     * mouseX:
     * 25
     *
     * => index 2
     */
    const index = Math.floor(mouseX / state.barWidth);

    if (index < 0 || index >= state.data.length) {
      this.hideTooltip();
      return;
    }

    const value = state.data[index];

    this.showTooltip(event.clientX, event.clientY, String(value));
  }

  /**
   * Tooltip 표시
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
  private getDataId(data: unknown[]): string {
    let id = this.dataIds.get(data);

    if (!id) {
      id = String(++this.dataIdSequence);

      this.dataIds.set(data, id);
    }

    return id;
  }
}
