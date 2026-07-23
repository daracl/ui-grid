import { BasePointerHandler } from '@/event/PointerHandler';
import { PointerPosition, PointerSession } from '@/event/PointerSession';
import { isMouseMoved } from '@/util/gridUtils';

const DBLCLICK_DELAY = 300; // ms

export class ClickManager {
  private lastClickTime = 0;
  private clickCount = 0;
  private readonly clickDelay: number;
  private currentPointerPosition: PointerPosition;
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
    this.currentPointerPosition = { x: 0, y: 0, clientX: 0, clientY: 0 };
  }

  conserveClick(pointerPosition: PointerPosition) {
    this.currentPointerPosition = pointerPosition;
    this.clickCount = 1;
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => this.resetClick(), this.clickDelay);
  }

  processClick(session: PointerSession, handler: BasePointerHandler) {
    const now = Date.now();

    if (now - this.lastClickTime < DBLCLICK_DELAY) {
      this.clickCount++;
    }

    this.lastClickTime = now;

    if (this.clickCount === 2) {
      if (!isMouseMoved(session.startPos, this.currentPointerPosition, 5)) {
        handler.onDoubleClick?.(session);
        this.resetClick();
        return;
      }
    }

    this.conserveClick(session.startPos);
    handler.onClick?.(session);
  }
}
