import type { ExcelTableData } from './ExcelData';
/** 셀 차트를 DrawingML 벡터 도형으로 구성한다. 별도 이미지·차트 라이브러리는 필요하지 않다. */
export declare function createChartDrawing(data: ExcelTableData, color: (value: string | undefined, fallback: string) => string, xml: (value: string) => string, headerCount?: number): string | undefined;
