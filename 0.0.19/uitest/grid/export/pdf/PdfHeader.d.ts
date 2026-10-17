import type { FieldItem } from '../../types/GridField.js';
import type { PdfHeaderCell, PdfTableData } from './PdfConverter';
/** 표시 순서와 숨김 열을 반영하여 다단 헤더의 병합 정보를 생성한다. */
export declare function createPdfHeaderRows(roots: FieldItem[], fields: FieldItem[], data: Pick<PdfTableData, 'headerBackgrounds' | 'headerTextColors' | 'headerGradients' | 'headerCellBorders'>): PdfHeaderCell[][] | undefined;
