import type { FieldItem } from '@/types/GridField';
import type { PdfHeaderCell, PdfTableData } from './PdfConverter';

/** 표시 순서와 숨김 열을 반영하여 다단 헤더의 병합 정보를 생성한다. */
export function createPdfHeaderRows(
  roots: FieldItem[],
  fields: FieldItem[],
  data: Pick<PdfTableData, 'headerBackgrounds' | 'headerTextColors' | 'headerGradients' | 'headerCellBorders'>,
): PdfHeaderCell[][] | undefined {
  const paths = new Map<string, FieldItem[]>();
  const visit = (nodes: FieldItem[], parents: FieldItem[]) => {
    for (const node of nodes) {
      if (node.hidden) continue;
      const path = [...parents, node];
      if (node.children?.length) visit(node.children, path);
      else paths.set(node.name, path);
    }
  };
  visit(roots, []);
  const columns = fields.map((field) => paths.get(field.name) ?? [field]);
  const depth = Math.max(1, ...columns.map((path) => path.length));
  if (depth === 1) return undefined;
  return Array.from({ length: depth }, (_, level) => {
    const cells: PdfHeaderCell[] = [];
    for (let column = 0; column < columns.length; ) {
      const path = columns[column];
      if (level >= path.length) {
        column++;
        continue;
      }
      const node = path[level];
      let end = column + 1;
      while (end < columns.length && columns[end][level] === node) end++;
      cells.push({
        label: node.label ?? '',
        column,
        colSpan: end - column,
        rowSpan: level === path.length - 1 ? depth - level : 1,
        background: data.headerBackgrounds?.[column],
        textColor: data.headerTextColors?.[column],
        gradient: data.headerGradients?.[column],
        borders: data.headerCellBorders?.[column],
      });
      column = end;
    }
    return cells;
  });
}
