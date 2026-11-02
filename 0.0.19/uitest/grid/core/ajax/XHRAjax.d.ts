import { AjaxOptions, GlobalAjaxOptions } from "../types/web/AjaxOptions";
import { AjaxAbstract } from "./AjaxAbstract";
/**
 * XHRAjax 클래스
 *
 * XHR 기반의 Ajax 요청을 처리하는 클래스입니다.
 */
export declare class XHRAjax extends AjaxAbstract {
    constructor(options: GlobalAjaxOptions);
    request(url: string, method: string, opts: AjaxOptions): Promise<unknown>;
    private parseResponse;
    private getResponseHeaders;
    private setHeaders;
    private prepareRequest;
}
