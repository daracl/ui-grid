/** 숫자 타입인지 검사합니다. 숫자 문자열과 NaN은 제외합니다. */
export declare function isNumber(value: unknown): value is number;
/** boolean 타입인지 검사합니다. */
export declare function isBoolean(value: unknown): value is boolean;
/** Promise와 함수형 thenable을 검사합니다. */
export declare function isThenable(value: unknown): value is PromiseLike<unknown>;
/** iframe을 포함한 DOM Element인지 검사합니다. */
export declare function isElement(value: unknown): value is Element;
/** SVG를 제외한 HTML 요소인지 해당 문서의 생성자로 검사합니다. */
export declare function isHTMLElement(value: unknown): value is HTMLElement;
