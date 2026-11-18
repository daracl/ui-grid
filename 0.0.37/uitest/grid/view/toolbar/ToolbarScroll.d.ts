import { ToolbarOptions } from '../../types/GridOptions.js';
import { GridMain } from '../GridMain';
export declare class ToolbarScroll {
    private readonly gridMain;
    private readonly toolbarElement;
    private readonly toolbarOpts;
    private arrowScrollFrame;
    constructor(gridMain: GridMain, toolbarElement: HTMLElement, toolbarOpts: ToolbarOptions);
    init(): void;
    resizeArrowVisibility(): void;
    destroy(): void;
    private initWheelEvent;
    private initArrowEvents;
    private bindArrowEvents;
    private startArrowScrolling;
    private stopArrowScrolling;
    private scrollByDirection;
    private getScrollElement;
}
