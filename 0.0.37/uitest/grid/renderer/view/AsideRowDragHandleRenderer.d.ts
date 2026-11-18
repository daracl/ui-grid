import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
/**
 * rowDragHandle renderer
 *
 * @class AsideRowDragHandleRenderer
 * @typedef {AsideRowDragHandleRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class AsideRowDragHandleRenderer extends ViewCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    alignStyle(): string;
    supportsEdit(): boolean;
}
