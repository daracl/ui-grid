import { CellInfo } from "@/types/GridConfig";
import { PointerHandler } from "@/event/PointerHandler";

export interface PointerPosition {
  x: number;
  y: number;
}

export type PointerState = "IDLE" | "PRESSED" | "DRAGGING";

export interface PointerSession {
  state?: PointerState;
  event: Event;
  startPos: PointerPosition;
  currentPos: PointerPosition;
  startTime: number;
  lastClickTime: number;
  clickCount: number;

  handler?: PointerHandler;
  cellInfo?: CellInfo;
  cellEl?: HTMLElement;
}
