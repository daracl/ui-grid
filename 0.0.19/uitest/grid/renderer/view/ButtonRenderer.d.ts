import { ViewCellRenderer } from '../ViewCellRenderer.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * button renderer
 * @class ButtonRenderer
 * @typedef {ButtonRenderer}
 * @extends {ViewCellRenderer}
 */
export declare class ButtonRenderer extends ViewCellRenderer {
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    initEvent(contentElement: HTMLElement): void;
    alignStyle(): string;
    supportsEdit(): boolean;
}
