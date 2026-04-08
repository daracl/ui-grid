import { CellInfo, HeaderCellInfo } from '@/types/GridConfig';
import { PointerHandler } from '@/event/PointerHandler';
import { ClickManager } from './ClickManager';

export interface PointerPosition {
  x: number;
  y: number;
}

export type PointerState = 'IDLE' | 'PRESSED' | 'DRAGGING';

export interface PointerSession {
  state?: PointerState;
  event: Event;
  startPos: PointerPosition;
  currentPos: PointerPosition;
  startTime: number;
  lastClickTime: number;
  clickManager: ClickManager;

  handler?: PointerHandler;
  cellInfo?: CellInfo | HeaderCellInfo;
  cellEl?: HTMLElement;
}
