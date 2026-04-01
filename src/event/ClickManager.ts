import { PointerPosition, PointerSession } from '@/event/PointerSession';
import { PointerHandler } from '@/event/PointerHandler';

const DBLCLICK_DELAY = 400; // ms
const DRAG_THRESHOLD = 3; // px

export class ClickManager {
  private lastClickTime = 0;
  private clickCount = 0;
  private readonly clickDelay: number;
  private currentCellPosition: PointerPosition;
  private clickTimer: any;

  public constructor(delay: number = DBLCLICK_DELAY) {
    this.clickDelay = delay;
    this.resetClick();
  }

  getClickCount() {
    return this.clickCount;
  }

  resetClick() {
    this.clickCount = 0;
    this.currentCellPosition = { x: 0, y: 0 };
  }

  conserveClick(cellPosition: PointerPosition) {
    this.currentCellPosition = cellPosition;
    this.clickCount = 1;
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => this.resetClick(), this.clickDelay);
  }

  processClick(session: PointerSession, handler: PointerHandler) {
    const now = Date.now();

    if (now - this.lastClickTime < DBLCLICK_DELAY) {
      this.clickCount++;
    }

    this.lastClickTime = now;

    const dx = this.currentCellPosition.x - session.startPos.x;
    const dy = this.currentCellPosition.y - session.startPos.y;

    const moved = dx * dx + dy * dy > 2;

    if (this.clickCount === 2) {
      if (!moved) {
        handler.onDoubleClick?.(session);
        this.resetClick();
        return;
      }
    }

    this.conserveClick(session.startPos);
    handler.onClick?.(session);
  }
}
