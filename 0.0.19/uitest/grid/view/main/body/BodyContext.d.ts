import { DaraElement } from '../../../element/DaraElement.js';
import { SelectionInfo } from '../../../selection/selection.js';
import { GridMain } from '../../GridMain.js';
/**
 * Body 하위 모듈에서 공유하는 상태와 DOM 참조를 관리
 */
export declare class BodyContext {
    readonly gridMain: GridMain;
    readonly selectionInfo: SelectionInfo;
    bodyElement: DaraElement;
    leftElement: DaraElement;
    centerElement: DaraElement;
    rightElement: DaraElement;
    allRowElements: Record<string, HTMLElement[]>;
    allCellElements: Record<string, HTMLElement[][]>;
    cellClassNameCache: WeakMap<HTMLElement, string[]>;
    constructor(gridMain: GridMain);
    resetCellState(): void;
}
