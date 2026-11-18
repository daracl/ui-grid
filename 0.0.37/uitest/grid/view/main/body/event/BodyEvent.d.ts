import { SelectionInfo } from '../../../../selection/selection.js';
import { GridMain } from '../../../GridMain.js';
import { Body } from '../Body';
/**
 * Body event class
 *
 * @class BodyEvent
 * @typedef {BodyEvent}
 */
export declare class BodyEvent {
    private readonly gridMain;
    private readonly body;
    private readonly selectionInfo;
    private readonly bodyElement;
    private readonly handlers;
    constructor(gridMain: GridMain, body: Body, selectionInfo: SelectionInfo);
    init(): void;
    /**
     * init mobile touch event
     */
    initMobileTouch(): void;
    private initMouseOver;
    /**
     * init pointer event
     * cell click , cell drag, row move event
     */
    private initPointerEvent;
    destroy(): void;
}
