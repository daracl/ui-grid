import { FieldItem } from '@t/GridField';
import { ViewCellRenderer } from '@/renderer/ViewCellRenderer';
import { GridMain } from '@/view/GridMain';
import { getElementRect } from '@/util/domUtils';
import { CellInfo } from '@t/GridConfig';
import { ROW_FIELD } from '@/constants';

/**
 * Sparkline renderer
 *
 * @class SparklineRenderer
 * @typedef {SparklineRenderer}
 * @extends {ViewCellRenderer}
 */
export class SparklineRenderer extends ViewCellRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = this.getValue(item);
    const refValue = this.getRefValue(value, item);

    const data = refValue.value;

    if (!Array.isArray(data) || data.length === 0) {
      // 데이터가 없으면 비워두기
      element.innerHTML = '';
      return;
    }

    const cellElement = this.getClosestCellElement(element);

    const rect = getElementRect(cellElement);

    const width = rect.width;
    const height = rect.height - 5;

    // 기존 canvas가 있으면 재사용, 없으면 생성
    let canvas = element.querySelector('canvas') as HTMLCanvasElement | null;

    if (canvas) {
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    } else {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      element.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const yPadding = 5;
    const xPadding = 5;
    const graphHeight = height - yPadding * 2;
    const graphWidth = width - xPadding * 2;
    const step = graphWidth / (data.length - 1);

    ctx.clearRect(0, 0, width, height);

    // 라인 그리기
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

    // 점 그리기
    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      const x = xPadding + i * step;
      const y = yPadding + (1 - (val - min) / range) * graphHeight;

      if (val === max) {
        ctx.fillStyle = '#28a745'; // green
      } else if (val === min) {
        ctx.fillStyle = '#dc3545'; // red
      } else if (i === 0 || i === data.length - 1) {
        ctx.fillStyle = '#0000ff'; // blue
      } else {
        ctx.fillStyle = '#ff9900'; // orange
      }

      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
