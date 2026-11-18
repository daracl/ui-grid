/**
 *  왼쪽 오른쪽 공백 제거
 *  '  as df  ' -> 'as df'
 * @param s
 * @returns
 */
export declare function trim(s: string): string;
/**
 *  왼쪽 공백 제거
 *  '  as df  ' -> 'as df  '
 * @param s
 * @returns
 */
export declare function leftTrim(s: string): string;
/**
 *  오른쪽 공백 제거
 *  '  as df  ' -> '  as df'
 * @param s
 * @returns
 */
export declare function rightTrim(s: string): string;
/**
 * 모든 공백 제거
 * '  as df  ' -> 'asdf'
 * @param s
 * @returns
 */
export declare function allTrim(s: string): string;
/**
 * 동일한 문자열 갯수
 *
 * @param {string} str 문자열
 * @param {string} matchString 체크할 문자
 * @returns {number}
 */
export declare function matchCount(str: string, matchString: string): number;
/**
 * 왼쪽 문자 채우기
 *
 * @param {string} str  문자열
 * @param {number} len    채울 자릿수
 * @param {string} [ch='0'] 채울문자
 * @returns {string}
 */
export declare function leftPad(str: any, len: number, ch?: string): string;
/**
 * 왼쪽 문자 채우기 + 길이 고정(clamp)
 *
 * padSize(len)보다 문자열이 길 경우 → 앞에서부터 len만큼만 남기고 잘라낸다.
 * padSize(len)보다 문자열이 짧으면 → 왼쪽에 ch 문자를 채워서 길이를 맞춘다.
 *
 * 예)
 * leftPadClamp("123456", 4, "0") → "1234"
 * leftPadClamp("12", 4, "0")     → "0012"
 *
 * @param {string} str  문자열
 * @param {number} len  고정할 전체 길이
 * @param {string} [ch='0'] 채울 문자
 * @returns {string}
 */
export declare function leftPadClamp(str: any, len: number, ch?: string): string;
/**
 * 오른쪽 문자 채우기
 *
 * @param {string} str  문자열
 * @param {number} len   채울 자릿수
 * @param {string} [ch='0'] 채울문자 default '0'
 * @returns {string}
 */
export declare function rightPad(str: any, len: number, ch?: string): string;
/**
 * 오른쪽 문자 채우기 + 길이 고정(clamp)
 *
 * padSize(len)보다 문자열이 길 경우 → 앞에서부터 len만큼만 남기고 잘라낸다.
 * padSize(len)보다 문자열이 짧으면 → 오른쪽에 ch 문자를 채워서 길이를 맞춘다.
 *
 * 예)
 * rightPadClamp("123456", 4, "0") → "1234"
 * rightPadClamp("12", 4, "0")     → "1200"
 *
 * @param {string} str  문자열
 * @param {number} len  고정할 전체 길이
 * @param {string} [ch='0'] 채울 문자
 * @returns {string}
 */
export declare function rightPadClamp(str: any, len: number, ch?: string): string;
/**
 * html escape. & < > " ' 를 이스케이프하므로 작은따옴표·큰따옴표 속성 안에도 안전합니다.
 * <div>asdfa</div> -> &lt;div&gt;test&lt;/div&gt;
 * @param {string} html
 * @returns {string}
 */
export declare function escapeHTML(html: string): string;
/**
 * xss 문자 변경.
 *
 * @param inputText text
 * @returns replace text
 *
 */
export declare function xss(inputText: string): string;
/**
 * xss 로 변경된 문자 원본 분자로 변경.
 * @param inputText text
 * @returns text
 */
export declare function unXss(inputText: string): string;
/**
 * 첫글자 대문자 처리
 *
 * @param {string} str
 * @returns {string} test -> Test
 */
export declare function capitalize(str: string): string;
/**
 * 글자 대문자 처리
 *
 * @param {string} str
 * @returns {string} test -> TEST
 */
export declare function upperCase(str: string): string;
/**
 * 글자 소문자 처리
 *
 * @param {string} str
 * @returns {string} Test -> test
 */
export declare function lowerCase(str: string): string;
/**
 * HTML 문자열을 일반 텍스트로 변환
 * @param {string} html HTML 문자열
 * @returns {string} 일반 텍스트
 */
export declare function convertHtmlToText(html: string | null | undefined): string;
