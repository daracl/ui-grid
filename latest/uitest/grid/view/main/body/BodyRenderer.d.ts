import { BodyCell } from './BodyCell';
import { BodyContext } from './BodyContext';
import { BodyTemplate } from './BodyTemplate';
import { ViewItem } from '../../../types/Common.js';
/**
 * Body의 virtualized row / cell 렌더링을 담당
 */
export declare abstract class BodyRenderer {
    protected readonly context: BodyContext;
    protected readonly cell: BodyCell;
    protected readonly template: BodyTemplate;
    constructor(context: BodyContext, cell: BodyCell, template: BodyTemplate);
    abstract dataDraw(mode?: string): void;
    protected drawData(mode: string | undefined, renderSpecialRow: (viewItem: ViewItem, rowIndex: number) => boolean): void;
    private updateRowTemplates;
    private updateLastRowVisibility;
    private refreshCellElements;
    selectRowAnchorCell(): void;
    destroy(): void;
}
