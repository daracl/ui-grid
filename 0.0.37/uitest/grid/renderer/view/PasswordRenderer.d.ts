import { FieldItem } from '../../types/GridField.js';
import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
/**
 * password renderer
 *
 * @typedef {PasswordRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class PasswordRenderer extends ViewCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    alignStyle(): "dg-text-ac";
    supportsEdit(): boolean;
}
