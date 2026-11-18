import { PointerContext } from '../../../event/PointerContext.js';
import { BasePointerHandler } from '../../../event/PointerHandler.js';
import { PointerSession } from '../../../event/PointerSession.js';
import { HeaderResize } from '../../../types/GridOptions.js';
import { HeaderEvent } from './HeaderEvent';
/**
 * ResizeHandler class
 *
 * @class ResizeHandler
 * @typedef {ResizeHandler}
 */
export declare class ResizeHandler extends BasePointerHandler {
    priority: number;
    protected readonly rowHeight: number;
    protected resizeOpts: HeaderResize;
    private readonly resizeUpdate;
    private readonly resizerHelperElement;
    private resizeIdx;
    private resizeMoveX;
    private positionLeft;
    constructor(context: PointerContext, headerEvent: HeaderEvent);
    onPointerDown(session: PointerSession): void;
    onActivate(session: PointerSession): void;
    onPointerMove(session: PointerSession): void;
    onPointerUp(session: PointerSession): void;
    /**
     * header column resize
     *
     * @public
     * @param {number} resizeIdx resize index
     * @param {number} resizeWidth resize width
     */
    headerColumnResize(resizeIdx: number, resizeWidth: number): void;
    onDoubleClick(session: PointerSession): void;
}
