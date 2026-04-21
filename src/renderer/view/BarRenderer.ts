import { FieldItem } from '@t/GridField';
import { ViewRenderer } from '../ViewRenderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';

/**
 * bar renderer
 *
 * @class BarRenderer
 * @typedef {BarRenderer}
 * @extends {ViewRenderer}
 */
export class BarRenderer extends ViewRenderer {
  private min: number;
  private max: number;
  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);
    this.min = field.renderer.rule?.minimum ?? 0;
    this.max = field.renderer.rule?.maximum ?? 100;
  }

  public render(cellInfo: CellInfo, element: HTMLElement): void {
    const item = cellInfo.item;
    const fieldValue = this.getValue(item);
    const refValue = this.getRefValue(fieldValue, item);

    const min = this.min;
    const max = this.max;

    let percent = fieldValue;
    let label = fieldValue;

    if (refValue) {
      percent = refValue?.percent ?? 0;
      label = refValue?.label;
    }

    // 바, 라벨 DOM 가져오기 또는 생성
    let text = element.querySelector('.dg-bar-label') as HTMLSpanElement;
    let bar = element.querySelector('.dg-bar-fill') as HTMLDivElement;

    if (!text) {
      text = document.createElement('span');
      text.className = this.getRendererStyleClass('dg-bar-label');
      element.appendChild(text);
    }

    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'dg-bar-fill';
      element.appendChild(bar);
    }

    bar.classList.remove('dg-positive', 'dg-negative');
    if (percent > 0) {
      bar.classList.add('dg-positive');
    } else if (percent < 0) {
      bar.classList.add('dg-negative');
    }

    // 위치 계산
    let width = 0;
    let left = 0;

    if (min < 0 && max > 0) {
      const total = Math.abs(min) + Math.abs(max);
      const p = Math.max(min, Math.min(max, percent));
      const zeroPoint = (Math.abs(min) / total) * 100;

      width = (Math.abs(p) / total) * 100;
      left = p >= 0 ? zeroPoint : zeroPoint - width;
    } else if (min >= 0) {
      const range = max - min;
      const p = Math.max(min, Math.min(max, percent));
      width = ((p - min) / range) * 100;
      left = 0;
    } else {
      const range = Math.abs(min - max);
      const p = Math.max(min, Math.min(max, percent));
      width = (Math.abs(p - max) / range) * 100;
      left = 100 - width;
    }

    // 스타일 속성만 적용
    bar.style.left = `${left}%`;
    bar.style.width = `${width}%`;

    if (text.textContent !== label) {
      text.textContent = label;
    }
  }
}
