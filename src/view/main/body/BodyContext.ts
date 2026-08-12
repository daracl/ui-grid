import { DaraElement } from '@/element/DaraElement';
import { SelectionInfo } from '@/selection/selection';
import { GridMain } from '@/view/GridMain';

/**
 * Body 하위 모듈에서 공유하는 상태와 DOM 참조를 관리
 */
export class BodyContext {
  public readonly gridMain: GridMain;
  public readonly selectionInfo: SelectionInfo;

  public bodyElement: DaraElement;
  public leftElement: DaraElement;
  public centerElement: DaraElement;
  public rightElement: DaraElement;

  public allCellElements: Record<string, HTMLElement[][]> = {};

  public cellClassNameCache = new WeakMap<HTMLElement, string[]>();

  constructor(gridMain: GridMain) {
    this.gridMain = gridMain;
    this.selectionInfo = gridMain.selectionInfo;

    this.bodyElement = gridMain.element().findDaraElement('.dg-body');
    this.leftElement = this.bodyElement.findDaraElement('.dg-region[data-region="left"]');
    this.centerElement = this.bodyElement.findDaraElement('.dg-region[data-region="center"]');
    this.rightElement = this.bodyElement.findDaraElement('.dg-region[data-region="right"]');
  }

  public resetCellState(): void {
    this.cellClassNameCache = new WeakMap<HTMLElement, string[]>();
    this.allCellElements = {};
  }
}
