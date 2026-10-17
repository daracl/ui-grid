import { EditCellRenderer } from '../EditCellRenderer.js';
import { GridOptions } from '../../types/GridOptions.js';
import { ValidResult } from '../../types/ValidResult.js';
import { GridMain } from '../../view/GridMain.js';
import { CellInfo, Config } from '../../types/GridConfig.js';
import { FieldItem } from '../../types/GridField.js';
/**
 * Switch renderer
 *
 * @class SwitchRenderer
 * @typedef {SwitchRenderer}
 * @extends {EditCellRenderer}
 */
export declare class SwitchRenderer extends EditCellRenderer {
    private readonly trueValue;
    private readonly falseValue;
    private readonly showLabel;
    constructor(field: FieldItem, gridMain: GridMain);
    render(cellInfo: CellInfo, element: HTMLElement): void;
    toggle(sliderElement: HTMLElement, value: string | boolean): void;
    initClick(contentElement: HTMLElement): void;
    valid(value: any): ValidResult | boolean;
    supportsInteraction(): boolean;
    alignStyle(): string;
    getMinWidth(cfg: Config, opts: GridOptions): number;
}
