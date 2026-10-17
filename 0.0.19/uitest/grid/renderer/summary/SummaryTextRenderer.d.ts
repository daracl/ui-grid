import { CellPositionInfo } from '../../types/GridConfig.js';
import { GridMain } from '../../view/GridMain.js';
import { FieldItem } from '../../types/GridField.js';
import { SummaryRenderer } from '../SummaryRenderer';
import { SummaryItem } from '../../types/Summary.js';
/**
 * text renderer
 *
 * @typedef {TextRenderer}
 * @extends {SummaryRenderer}
 */
export declare class SummaryTextRenderer extends SummaryRenderer {
    constructor(field: FieldItem, gridMain: GridMain, summaryItem: SummaryItem);
    render(cellInfo: CellPositionInfo, element: HTMLElement): void;
}
