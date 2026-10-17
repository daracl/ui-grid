import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * Aside LineNumber renderer
 *
 * @class AsideLineNumberRenderer
 * @typedef {AsideLineNumberRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class AsideLineNumberRenderer extends ViewCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    alignStyle(): string;
}
