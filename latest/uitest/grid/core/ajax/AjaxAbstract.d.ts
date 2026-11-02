import { AjaxOptions, GlobalAjaxOptions } from "../types/web/AjaxOptions";
import type { Loading } from "../Loading";
import { AjaxError, AjaxErrorType } from "./AjaxError";
/**
 * Ajax 클래스
 */
export declare abstract class AjaxAbstract {
    protected options: GlobalAjaxOptions;
    constructor(options: GlobalAjaxOptions);
    abstract request(url: string, method: string, opts: AjaxOptions): Promise<any>;
    protected containsFile(data: any, seen?: WeakSet<object>): boolean;
    protected isRawBody(data: any): boolean;
    protected buildRequestData(url: string, method: string, opts: AjaxOptions): {
        finalUrl: string;
        preparedData: any;
        isForm: boolean;
    };
    protected assertRawBody(method: string, opts: AjaxOptions): void;
    /** 업로드 진행률 표시 대상인지 판단한다: 파일이 든 본문 또는 rawBody 본문. */
    protected isUploadProgressTarget(opts: AjaxOptions, method: string): boolean;
    protected resolveUrl(url: string, originalUrl: string | undefined, opts: AjaxOptions): string;
    protected getRequestUrl(url: string, method: string, data: any, params?: Record<string, unknown>, serializer?: (params: Record<string, unknown>) => string): string;
    protected createError(params: {
        type: AjaxErrorType;
        opts: AjaxOptions;
        xhr?: any;
        status?: number;
        statusText?: string;
        responseText?: string;
        headers?: Record<string, string>;
        error?: any;
        loadingInstance?: Loading | null;
    }): AjaxError;
    protected readResponseText(xhr: any): string;
    protected isBodylessMethod(method: string): boolean;
    protected binaryToText(value: unknown): Promise<string>;
    protected isBinaryType(responseType?: string): boolean;
    protected isSuccess(status: number, opts: AjaxOptions): boolean;
    protected getUrlWithData(url: string, method: string, data: any): string;
    protected assertNoFileInGet(method: string, data: any): void;
    /** 본문에 파일(File/Blob/FileList 또는 파일이 든 FormData)이 있는지 검사한다. */
    hasFileData(data: any): boolean;
    /** showProgress 로 로더에 진행률을 표시할 요청인지 판단한다: 파일 업로드(rawBody 포함) 또는 blob/arraybuffer 다운로드. */
    needsLoaderProgress(opts: AjaxOptions, method: string): boolean;
    private formDataHasFile;
    private formDataToQuery;
    protected parseJsonBody(text: string, ctx: {
        opts: AjaxOptions;
        xhr?: any;
        status: number;
        statusText: string;
        headers?: Record<string, string>;
        loadingInstance?: Loading | null;
    }): any;
    protected cleanHeaders(headers?: Record<string, any>): Record<string, string>;
    protected appendQuery(url: string, qs: string): string;
    private isFileLike;
    protected buildFormDataFromObject(obj: any): FormData;
}
