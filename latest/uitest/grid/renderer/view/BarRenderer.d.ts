import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridOptions } from '../../types/GridOptions.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo, Config } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * bar renderer
 *
 * @class BarRenderer
 * @typedef {BarRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class BarRenderer extends ViewCellRenderer {
    private readonly min;
    private readonly max;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    getMinWidth(cfg: Config, opts: GridOptions): number;
}
