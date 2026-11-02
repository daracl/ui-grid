/**
 * URL 문자열에서 모든 파라미터를 추출하여 객체 형태로 반환한다.
 * 동일 이름의 파라미터가 여러 번 존재한다면 배열로 처리된다.
 *
 * 예)
 *  const params = getURLParams("https://site.com?a=1&a=2&b=3");
 *  결과: { a: ["1", "2"], b: ["3"] }
 *
 * @param checkUrl - 파싱할 전체 URL 문자열
 * @returns 파라미터(key:값[]) 객체
 */
export declare function getURLParams(checkUrl: string): any;
/**
 * URL 문자열에서 특정 파라미터의 '첫 번째 값'을 반환한다.
 * 동일한 key 가 여러 번 있을 경우 첫 번째 값만 반환된다.
 *
 * 예)
 *  const id = getURLParam("https://site.com?id=100&id=200", "id");
 *  결과: "100"
 *
 * @param checkUrl - 파싱할 전체 URL 문자열
 * @param paramKey - 가져오고 싶은 파라미터 key 이름
 * @returns 파라미터 값(string) 또는 존재하지 않을 경우 null
 */
export declare function getURLParam(checkUrl: string, paramKey: string): any;
