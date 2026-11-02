/**
 * baseUrl 과 url 을 슬래시가 겹치거나 빠지지 않게 합친다.
 * 절대 URL(http://, //) 은 baseUrl 을 붙이지 않고, 쿼리(?)/해시(#) 로 시작하는 url 은 그대로 이어 붙인다.
 *
 * @param {string | undefined} baseUrl
 * @param {string} url
 * @returns {string}
 */
export declare function joinUrl(baseUrl: string | undefined, url: string): string;
