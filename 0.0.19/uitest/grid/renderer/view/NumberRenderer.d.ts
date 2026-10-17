import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
/**
 * number renderer
 *
 * @typedef {NumberRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class NumberRenderer extends ViewCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    alignStyle(): string;
    supportsEdit(): boolean;
}
