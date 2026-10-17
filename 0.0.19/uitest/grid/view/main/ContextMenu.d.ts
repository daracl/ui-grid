import { ContextMenuItem } from '../../types/ContenxtMenu.js';
import { GridMain } from '../GridMain';
/**
 * Body class
 *
 * @class Body
 * @typedef {Body}
 */
export declare class ContextMenu {
    private readonly gridMain;
    private readonly contextOpts;
    private contextElement;
    private _isActive;
    private readonly contextData;
    constructor(gridMain: GridMain);
    init(): void;
    create(): void;
    private initEvent;
    private initItemClickEvent;
    private initSubmenuEvent;
    /**
     * change header label
     *
     * @public
     * @param {string} label header label
     */
    changeHeader(label: string): void;
    /**
     * html template
     *
     * @public
     * @param {string} type position type
     * @returns {string} template string
     */
    template(data: ContextMenuItem[], id: string, depth: number): string;
}
