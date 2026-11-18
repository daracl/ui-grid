import { EventHandler } from '../../../event/EventHandler.js';
import { GridMain } from '../../GridMain.js';
import { Header } from './Header';
/**
 * sort button event class
 *
 * @class SortButtonEvent
 * @typedef {SortButtonEvent }
 */
export declare class SortButtonEvent implements EventHandler {
    private readonly gridMain;
    private readonly header;
    private readonly sortOpts;
    constructor(gridMain: GridMain, header: Header);
    /**
     * init
     *
     */
    init(): void;
}
