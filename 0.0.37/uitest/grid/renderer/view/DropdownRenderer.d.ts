import { GridMain } from '../../view/GridMain.js';
import { CellInfo, Config } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridOptions } from '../../types/GridOptions.js';
/**
 * dropdown renderer
 *
 * @class DropdownRenderer
 * @typedef {DropdownRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class DropdownRenderer extends ViewCellRenderer {
    private readonly valueDelimiter;
    private listItems;
    private valueLabelMap;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    getLabel(value: string | string[]): string[];
    initEvent(contentElement: HTMLElement): void;
    /**
     * click
     * @param e event
     * @param cellElement cell element
     * @param cellInfo cell info
     * @returns
     */
    click(e: Event, cellElement: HTMLElement, cellInfo: CellInfo): void;
    supportsEdit(): boolean;
    alignStyle(): string;
    getMinWidth(cfg: Config, opts: GridOptions): number;
}
