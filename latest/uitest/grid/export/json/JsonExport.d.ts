import type { PdfRendererContext } from '../pdf/PdfRenderer';
import type { JsonExportOptions } from './JsonConverter';
export { JsonConverter } from './JsonConverter';
export type { JsonExportOptions } from './JsonConverter';
/** 필드명을 키로 사용하며 내부 행 ID·상태와 그룹 가상 행은 제외한다. 트리는 평탄한 행 배열이다. */
export declare function createJsonData(context: PdfRendererContext, options?: JsonExportOptions): Record<string, unknown>[];
