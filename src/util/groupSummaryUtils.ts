import type { GridOptions } from '@/types/GridOptions';
import type { SummaryItem } from '@/types/Summary';
import { formatValue } from './formatUtils';
import type { FieldItem } from '@/types/GridField';
import { calcSummary } from './mathUtils';

/** field를 우선하고 기존 name 설정도 지원한다. */
export function getSummaryField(summary: SummaryItem): string {
  return summary.field ?? summary.name ?? '';
}

export function formatSummaryValue(value: number, summary: SummaryItem | undefined, field: FieldItem): string {
  const displayFormat = summary?.displayFormat ?? field.displayFormat;
  return String(displayFormat ? formatValue(value, displayFormat) : value);
}

export function getGroupSummaries(options: Pick<GridOptions, 'groupSummaryFields'>): SummaryItem[] {
  return options.groupSummaryFields ?? [];
}

export function getGroupSummaryFields(options: Pick<GridOptions, 'groupSummaryFields'>): string[] {
  return getGroupSummaries(options).map((item) => getSummaryField(item));
}

export function calculateGroupSummary(items: Record<string, any>[], summary: SummaryItem): number {
  if (typeof summary.expression === 'function') {
    const result = summary.expression(items);
    if (typeof result !== 'number' || !Number.isFinite(result)) {
      throw new TypeError(`Group summary callback for ${summary.field} must return a finite number`);
    }
    return result;
  }
  if (summary.expression === 'count') return items.length;
  const mode = summary.expression;
  if (!mode || !['sum', 'avg', 'min', 'max'].includes(mode))
    throw new Error(`Unsupported group summary expression: ${mode}`);
  // 숫자 문자열은 허용하고 빈 값은 집계에서 제외한다.
  const values = items.flatMap((item) => {
    const value = item[getSummaryField(summary)];
    if (value === null || value === undefined || value === '') return [];
    const number = Number(value);
    return Number.isFinite(number) ? [{ [getSummaryField(summary)]: number }] : [];
  });
  const result = values.length ? calcSummary(values, mode, getSummaryField(summary)) : 0;
  return typeof result === 'number' ? result : 0;
}
