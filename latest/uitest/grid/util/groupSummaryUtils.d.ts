import type { GridOptions } from '../types/GridOptions.js';
import type { SummaryItem } from '../types/Summary.js';
import type { FieldItem } from '../types/GridField.js';
/** field를 우선하고 기존 name 설정도 지원한다. */
export declare function getSummaryField(summary: SummaryItem): string;
export declare function formatSummaryValue(value: number, summary: SummaryItem | undefined, field: FieldItem): string;
export declare function getGroupSummaries(options: Pick<GridOptions, 'groupSummaryFields'>): SummaryItem[];
export declare function getGroupSummaryFields(options: Pick<GridOptions, 'groupSummaryFields'>): string[];
export declare function calculateGroupSummary(items: Record<string, any>[], summary: SummaryItem): number;
