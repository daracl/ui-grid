import { ScrollDirectionX, ScrollDirectionY } from '../../../../constants.js';
import { PointerContext } from '../../../../event/PointerContext.js';
import { BasePointerHandler } from '../../../../event/PointerHandler.js';
import { PointerSession } from '../../../../event/PointerSession.js';
import { SelectionInfo } from '../../../../selection/selection.js';
import { CellInfo } from '../../../../types/GridConfig.js';
import { BodyEvent } from './BodyEvent';
/**
 * CellClickHandler class
 *
 * @class CellClickHandler
 * @typedef {CellClickHandler}
 */
export declare class CellClickHandler extends BasePointerHandler {
    priority: number;
    protected readonly rowHeight: number;
    protected readonly selectionInfo: SelectionInfo;
    private readonly bodyDragDelay;
    protected readonly selectionMode: string;
    protected bodyPosition: any;
    private readonly moveRange;
    private beforeEndIdx;
    private beforeEndCol;
    private readonly cellClickFn;
    protected readonly multipleFlag: boolean;
    protected gridBounds: {
        gridLeft: number;
        gridRight: number;
        mainLeft: number;
        mainRight: number;
        top: number;
        bottom: number;
    };
    protected startCellInfo: CellInfo;
    private cellElement;
    protected scrollDirectionX: ScrollDirectionX | null;
    protected scrollDirectionY: ScrollDirectionY | null;
    protected dragAnimationId: number;
    private lastScrollTime;
    private currentSelectionMode;
    private readonly cellDblClick;
    private readonly isCellDbClickEvent;
    private readonly bodyElement;
    constructor(context: PointerContext, bodyEvent: BodyEvent);
    onPointerDown(session: PointerSession): void;
    onActivate(session: PointerSession): void;
    onPointerMove(session: PointerSession): void;
    protected startAutoScroll(selection?: boolean): void;
    protected stopAutoScroll(): void;
    onPointerUp(session: PointerSession): void;
    onClick(session: PointerSession): void;
    onDoubleClick(session: PointerSession): void;
    protected setCellClick(e: Event, cellInfo: CellInfo, multipleFlag: boolean, selectionMode: string, cellElement: HTMLElement): void;
}
