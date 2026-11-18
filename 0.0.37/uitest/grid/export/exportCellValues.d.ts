import type { FieldItem } from '../types/GridField.js';
/** 그리드 렌더러의 표시 포맷·라벨·마스킹을 내보내기에 공통 적용한다. */
export declare function getExportCellValues(fields: FieldItem[], item: Record<string, unknown>): string[];
