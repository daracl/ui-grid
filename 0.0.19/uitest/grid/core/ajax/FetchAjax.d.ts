import { AjaxOptions, GlobalAjaxOptions } from "../types/web/AjaxOptions";
import { Loading } from "../Loading";
import { AjaxAbstract } from "./AjaxAbstract";
/**
 * FetchAjax 클래스
 *
 * Fetch API 기반의 Ajax 요청을 처리하는 클래스입니다.
 */
export declare class FetchAjax extends AjaxAbstract {
    constructor(options: GlobalAjaxOptions);
    request(url: string, method: string, opts: AjaxOptions): Promise<{
        data: any;
        status: number;
        responseText: string;
        config: AjaxOptions;
        xhr: Response;
        headers: Record<string, string>;
        loadingInstance: Loading | null;
    }>;
    private prepareRequest;
    private parseFetchHeaders;
}
