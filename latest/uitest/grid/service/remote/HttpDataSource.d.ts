import type { DataSourceOperation, DataSourceOptions, HttpEndpoint } from '../../types/DataSource.js';
/**
 * 코어 Ajax(또는 주입된 request 함수)로 서버와 통신하는 DataSource.
 *
 * 조회(GET)는 쿼리 스트링, 저장·삭제는 JSON 본문으로 전송한다.
 */
export declare class HttpDataSource {
    private readonly opts;
    private readonly defaultLoaderContainer?;
    private ajax?;
    constructor(opts: DataSourceOptions, defaultLoaderContainer?: HTMLElement | undefined);
    /**
     * 엔드포인트로 요청을 보내고 (responseFilter·errorFilter·responseMap이 적용된) 응답을 반환한다.
     */
    send(operation: DataSourceOperation, endpoint: HttpEndpoint, payload: unknown, signal: AbortSignal): Promise<unknown>;
    /**
     * errorFilter를 호출한다. 값을 반환하면 오류 복구, 던지면 그 오류를 전달한다.
     * DataSourceError가 아닌 오류는 원래 오류의 code·status·response를 유지한 채 메시지만 바꿔 정규화한다.
     */
    private runErrorFilter;
    /** 코어 Ajax의 loaderContainer·loaderOption 값을 구한다. */
    private resolveLoader;
    private resolveHeaders;
    private sendByAjax;
}
