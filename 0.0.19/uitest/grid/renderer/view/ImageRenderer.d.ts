import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo, Config } from '../../types/GridConfig.js';
import { GridOptions } from '../../types/GridOptions.js';
/**
 * image renderer
 *
 * @class ImageRenderer
 * @typedef {ImageRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class ImageRenderer extends ViewCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    getMinWidth(cfg: Config, opts: GridOptions): number;
}
