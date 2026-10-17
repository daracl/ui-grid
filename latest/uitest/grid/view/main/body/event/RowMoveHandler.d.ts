import { PointerContext } from '../../../../event/PointerContext.js';
import { PointerSession } from '../../../../event/PointerSession.js';
import { BodyEvent } from './BodyEvent';
import { CellClickHandler } from './CellClickHandler';
/**
 * RowMoveHandler class
 *
 * @class RowMoveHandler
 * @typedef {RowMoveHandler}
 */
export declare class RowMoveHandler extends CellClickHandler {
    priority: number;
    private readonly ROW_DRAG_RATIO;
    private readonly rowMoveOptions;
    private readonly rowMoveDropHelperElement;
    private readonly language;
    private rowMoveElement;
    private dropRowIdx;
    private moveStartItem;
    private moveRowIndexs;
    private moveViewItems;
    private isDropForbidden;
    private isMoveRowSequential;
    private readonly isSelectionRowMode;
    constructor(context: PointerContext, bodyEvent: BodyEvent);
    initTemplate(): void;
    canHandle(session: PointerSession): boolean;
    onClick(session: PointerSession): void;
    onActivate(session: PointerSession): false | undefined;
    /** move 중 */
    onPointerMove(session: PointerSession): void;
    /**
     * drop 금지 시, 드롭 위치에 X 표시, 허용 시 O 표시
     */
    preventDrop(): void;
    onPointerUp(session: PointerSession): void;
}
