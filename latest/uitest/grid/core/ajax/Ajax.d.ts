import { AjaxOptions, GlobalAjaxOptions } from "../types/web/AjaxOptions";
import type { AjaxResponse } from "../types/web/AjaxResponse";
/** 진행 중인 요청의 조회 정보입니다. 본문과 인증 헤더는 보관하지 않습니다. */
export interface PendingAjaxRequest {
    readonly id: number;
    readonly url: string;
    readonly method: string;
    readonly startedAt: number;
}
/**
 * Ajax 클래스
 */
export declare class Ajax {
    private fetchAjax;
    private xhrAjax;
    private isFetchSupported;
    private options;
    private readonly pendingRequestMap;
    private nextRequestId;
    /**
     * 진행 중인 요청의 스냅샷을 반환합니다. 동일 URL 요청도 별도 ID로 구분합니다.
     * @returns 진행 중인 요청 Map의 복사본
     */
    get pendingRequests(): ReadonlyMap<number, PendingAjaxRequest>;
    constructor(options?: GlobalAjaxOptions);
    /** 전역 옵션의 기본값을 만듭니다. 내부용이며 기존 호환을 위해 공개로 유지합니다. */
    createGlobalAjaxOptions(): GlobalAjaxOptions;
    /** 요청 옵션의 기본값(전역 옵션 반영)을 만듭니다. 내부용이며 기존 호환을 위해 공개로 유지합니다. */
    createDefaultOptions(): AjaxOptions;
    /**
     * Ajax 인스턴스를 생성합니다.
     * @param {?AjaxOptions} [options]  ajax 옵션
     * @returns {Ajax} Ajax 인스턴스
     */
    static create(options?: GlobalAjaxOptions): Ajax;
    private combineSignals;
    private _request;
    /**
     * 요청을 보냅니다. URL 과 메서드는 options.url, options.method 로 지정합니다.
     *
     * @param {?AjaxOptions} [options]  ajax 옵션
     * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 을 사용합니다. true 여도 fetchMode 가 "fetch" 일 때만 Fetch 를 사용합니다(기본 fetchMode 는 "xhr").
     * @returns {*}
     */
    request<T = any>(options?: AjaxOptions, useFetch?: boolean): Promise<AjaxResponse<T>>;
    /**
     * get 요청을 보냅니다.
     *
     * @param {string} url api URL
     * @param {?AjaxOptions} [options]  ajax 옵션
     * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
     * @returns {*}
     */
    get<T = any>(url: string, options?: AjaxOptions, useFetch?: boolean): Promise<AjaxResponse<T>>;
    /**
     * post 요청을 보냅니다.
     *
     * @param {string} url api URL
     * @param {?AjaxOptions} [options]  ajax 옵션
     * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
     * @returns {*}
     */
    post<T = any>(url: string, options?: AjaxOptions, useFetch?: boolean): Promise<AjaxResponse<T>>;
    /**
     * put 요청을 보냅니다.
     *
     * @param {string} url api URL
     * @param {?AjaxOptions} [options]  ajax 옵션
     * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
     * @returns {*}
     */
    put<T = any>(url: string, options?: AjaxOptions, useFetch?: boolean): Promise<AjaxResponse<T>>;
    /**
     * DELETE 요청을 보냅니다.
     *
     * @param {string} url api URL
     * @param {?AjaxOptions} [options]  ajax 옵션
     * @param {boolean} [useFetch=true] false 면 fetchMode 와 관계없이 XHR 사용
     * @returns {*}
     */
    delete<T = any>(url: string, options?: AjaxOptions, useFetch?: boolean): Promise<AjaxResponse<T>>;
}
