import { ScrollDirectionX } from '../../../constants.js';
import { PointerContext } from '../../../event/PointerContext.js';
import { BasePointerHandler } from '../../../event/PointerHandler.js';
import { PointerSession } from '../../../event/PointerSession.js';
import { SelectionInfo } from '../../../selection/selection.js';
import { CellInfo } from '../../../types/GridConfig.js';
import { HeaderEvent } from './HeaderEvent';
/**
 * HeaderCellClickHandler class
 *
 * @class HeaderCellClickHandler
 * @typedef {HeaderCellClickHandler}
 */
export declare class HeaderCellClickHandler extends BasePointerHandler {
    priority: number;
    protected readonly rowHeight: number;
    protected readonly selectionInfo: SelectionInfo;
    private readonly dragDelay;
    protected readonly selectionMode: string;
    protected headerPosition: any;
    private beforeEndCol;
    private startCellIdx;
    private readonly editable;
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
    protected scrollDirectionX: ScrollDirectionX | null;
    protected dragAnimationId: number;
    private lastScrollTime;
    private currentSelectionMode;
    private readonly headerElement;
    constructor(context: PointerContext, headerEvent: HeaderEvent);
    canHandle(session: PointerSession): void | boolean;
    onPointerDown(session: PointerSession): void | boolean;
    onActivate(session: PointerSession): false | undefined;
    onPointerMove(session: PointerSession): void;
    protected startAutoScroll(selection?: boolean): void;
    protected stopAutoScroll(): void;
    onPointerUp(session: PointerSession): void;
    onClick(session: PointerSession): void;
}
