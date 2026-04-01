import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { getElementRect } from '@/util/domUtils';
import { CellInfo } from '@t/GridConfig';

/**
 * Sparkline bar renderer
 *
 * @class SparklineRendererBar
 * @typedef {SparklineRendererBar}
 * @extends {ViewRenderer}
 */
export class SparklineRendererBar extends ViewRenderer {
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const value = item[this.fieldName];
    const refValue = this.getRefValue(value, item);

    const data = refValue.value;

    if (!Array.isArray(data) || data.length === 0) {
      // 데이터가 없으면 비워두기
      element.innerHTML = '';
      return;
    }

    const rect = getElementRect(element);
    const width = rect.width;
    const height = rect.height;

    // 기존 canvas가 있으면 재사용, 없으면 생성
    let canvas = element.querySelector('canvas') as HTMLCanvasElement | null;

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      element.appendChild(canvas);
    } else {
      // 크기 고정 시 다시 설정 필요없으면 생략 가능
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const barWidth = width / data.length;
    const yPadding = 5;
    const graphHeight = height - yPadding * 2;

    const bars = [];

    ctx.clearRect(0, 0, width, height);

    data.forEach((val, i) => {
      const x = i * barWidth;
      const barHeight = ((val - min) / range) * graphHeight;
      const y = height - barHeight - yPadding;

      if (val === max) {
        ctx.fillStyle = '#28a745';
      } else if (val === min) {
        ctx.fillStyle = '#dc3545';
      } else if (i === 0 || i === data.length - 1) {
        ctx.fillStyle = '#0000ff';
      } else {
        ctx.fillStyle = '#ff9900';
      }

      ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

      bars.push({ x, y, width: barWidth, height: barHeight, value: val });
    });
  }
}
