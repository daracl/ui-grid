import { BasePointerHandler } from './PointerHandler.js';
import { PointerPosition, PointerSession } from './PointerSession.js';
export declare class ClickManager {
    private lastClickTime;
    private clickCount;
    private readonly clickDelay;
    private currentPointerPosition;
    private clickTimer;
    constructor(delay?: number);
    getClickCount(): number;
    resetClick(): void;
    conserveClick(pointerPosition: PointerPosition): void;
    processClick(session: PointerSession, handler: BasePointerHandler): void;
}
