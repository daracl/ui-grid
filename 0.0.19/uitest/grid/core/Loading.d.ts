import { LoadingOptions } from "./types/LoadingOptions";
/**
 * Loading 모듈
 */
export declare class Loading {
    private selector;
    private containerNode;
    private loadingElement;
    private options;
    private orginStylePosition;
    private intervalId?;
    private timeoutId?;
    private group?;
    private startedAt;
    constructor(selector: string | HTMLElement | null | undefined, options?: LoadingOptions);
    static create(selector: string | HTMLElement | null | undefined, options?: LoadingOptions): Loading;
    static instance(selector: string): Loading;
    static setOptions(options: LoadingOptions): void;
    private cancelHandler;
    private startTimeout;
    private updateSharedOptions;
    /**
     * 이 인스턴스의 요청 수를 갱신하고 공유 화면에 합계를 표시합니다.
     * @param count 진행 중인 요청 수
     * @returns 없음
     */
    setRequestCount(count: number): void;
    private updateRequestCount;
    /**
     * show loading module
     * @public
     */
    show(): void;
    /**
     * set display content
     *
     * @public
     * @param {string} content
     */
    setContent(content: string): void;
    private renderContent;
    /**
     * hide loading module
     *
     * @public
     * @param {?boolean} [flag]
     */
    hide(flag?: boolean): void;
    /**
     * destroy loading instance
     *
     * @public
     * @static
     * @param {string} selector
     */
    static destroy(selector: string): void;
}
