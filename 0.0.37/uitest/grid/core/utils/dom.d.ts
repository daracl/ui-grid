export type ElementAttributes = Record<string, string | number | boolean | null | undefined | Record<string, unknown>>;
/** 공백으로 구분된 클래스 중 하나라도 포함하는지 검사합니다. */
export declare function hasClass(element: Element, className: string): boolean;
/** 크기가 있고 visibility가 hidden이 아닌 요소인지 검사합니다. */
export declare function isVisible(element: HTMLElement): boolean;
/** HTML 요소를 만들고 class·style·dataset·일반 속성과 textContent를 적용합니다. HTML 문자열을 실행하지 않습니다. */
export declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(tagName: K, className?: string, attrs?: ElementAttributes, text?: string): HTMLElementTagNameMap[K];
export declare function createHTMLElement(tagName: string, className?: string, attrs?: ElementAttributes, text?: string): HTMLElement;
/** 신뢰할 수 있는 HTML 문자열의 첫 번째 요소를 반환합니다. sanitize 기능은 없습니다. */
export declare function templateToElement(html: string): Element | null;
/** 숫자·단위 없는 양의 정수 문자열에 px를 붙입니다. 0은 빈 문자열입니다. */
export declare function normalizeCssLength(value: number | string): string;
/** 클래스 문자열 또는 콜백 결과를 기존 core 클래스 토큰 처리로 정규화합니다. */
export declare function resolveClassName<T>(value: string | ((params?: T) => string) | undefined, params?: T): string[];
/** 스크롤바 포함 여부에 따라 브라우저의 사용 가능한 크기를 반환합니다. */
export declare function getBrowserSize(usableSize?: boolean): {
    width: number;
    height: number;
};
/** 페이지의 현재 스크롤 좌표를 반환합니다. */
export declare function getScrollPosition(): {
    top: number;
    left: number;
};
/** 페이지 좌표의 레이어가 화면을 벗어나지 않도록 위치를 조정합니다. */
export declare function outerLayerPosition(layer: HTMLElement, position: {
    x: number;
    y: number;
}): {
    top: number;
    left: number;
};
/** 컨테이너 내 팝업의 크기·위치를 대상 요소와 viewport 기준으로 계산합니다. */
export declare function innerLayerPosition(container: HTMLElement, target: HTMLElement, layer: HTMLElement, margin?: number): {
    top: number;
    left: number;
    height: number;
    width: number;
};
export interface ScrollTarget {
    element?: HTMLElement;
    top: number;
    bottom: number;
}
/** 요소·가까운 선택자·스크롤 가능한 상위 요소 순으로 스크롤 대상을 정합니다. */
export declare function resolveScrollElement(container: HTMLElement, option?: string | HTMLElement): HTMLElement | undefined;
/** 스크롤 대상과 viewport가 겹치는 세로 영역을 반환합니다. */
export declare function measureScrollTarget(element?: HTMLElement): ScrollTarget;
/** 스크롤 대상 선택과 영역 측정을 함께 수행합니다. */
export declare function resolveScrollTarget(container: HTMLElement, option?: string | HTMLElement): ScrollTarget;
/** Escape 키인지 검사합니다. */
export declare function isEsc(event: KeyboardEvent): boolean;
/** 주 포인터의 왼쪽 버튼 또는 터치 입력인지 검사합니다. */
export declare function isPrimaryPointer(event: Event): boolean;
/** 두 좌표의 이동 거리가 임계값을 초과했는지 검사합니다. */
export declare function isMouseMoved(start: {
    x: number;
    y: number;
}, current: {
    x: number;
    y: number;
}, threshold?: number): boolean;
/** URL의 실행 스킴과 공백·제어 문자로 숨긴 스킴을 검사합니다. */
export declare function isSafeUrl(url: string): boolean;
/** 접두사가 붙은 클래스 이름 생성 함수를 반환합니다. */
export declare function createClassNamer(prefix: string): (...names: string[]) => string;
