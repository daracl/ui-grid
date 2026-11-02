/** 클립보드 기록을 시도하고 실패 시 임시 textarea로 대체합니다. */
export declare function writeClipboard(text: string): Promise<boolean>;
/** URL을 다운로드합니다. 전달한 URL의 신뢰 여부는 호출자가 확인합니다. */
export declare function downloadUrl(url: string, fileName: string): void;
/** 텍스트를 파일로 다운로드하고 일정 시간 뒤 임시 object URL을 해제합니다. 인자 순서는 fileName, text입니다. */
export declare function downloadText(fileName: string, text: string, type?: string): void;
/** SVG 문자열을 data URL로 변환합니다. */
export declare function svgToDataURL(svg: string): string;
/** 원본을 변경하지 않고 xmlns가 포함된 SVG 문자열을 반환합니다. */
export declare function serializeSvg(svg: SVGElement): string;
