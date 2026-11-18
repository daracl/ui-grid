import { EventElementType, EventOptions } from '../types/Event.js';
export declare class EventManager {
    private readonly EVENT_HANDLER_MAP;
    private readonly ELEMENTS;
    private addEventInfo;
    on(opts: EventOptions, listener?: any, fnOpts?: AddEventListenerOptions): void;
    off(el: EventElementType, type: string): void;
    /**
     * 제거
     */
    destroy(): void;
}
