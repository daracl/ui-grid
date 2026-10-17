import { Config } from '../../../types/GridConfig.js';
import { EventHandler } from '../../../event/EventHandler.js';
import { GridMain } from '../../GridMain.js';
import { Header } from './Header';
/**
 * help button event class
 *
 * @class HelpButtonEvent
 * @typedef {HelpButtonEvent }
 */
export declare class HelpButtonEvent implements EventHandler {
    private readonly gridMain;
    private readonly header;
    private readonly helpOpts;
    constructor(gridMain: GridMain, header: Header);
    /**
     * keydown event
     *
     */
    init(): void;
    getHeaderHelpCellInfo(cfg: Config, currentElement: HTMLElement): {
        c: number | undefined;
        field: import("../../..").FieldItem | undefined;
    };
}
