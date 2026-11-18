import { EventHandler } from '../../../../event/EventHandler.js';
import { SelectionInfo } from '../../../../selection/selection.js';
import { GridMain } from '../../../GridMain.js';
/**
 * paste event class
 */
export declare class PasteEvent implements EventHandler {
    private readonly gridMain;
    private readonly selectionInfo;
    private pasteElement;
    constructor(gridMain: GridMain, selectionInfo: SelectionInfo);
    /**
     * init paste event
     */
    init(): void;
}
