export type DataSourceErrorCode = 'CONFIG' | 'UNSUPPORTED' | 'BUSY' | 'UNSAVED_CHANGES' | 'DESTROYED' | 'HTTP' | 'NETWORK' | 'TIMEOUT' | 'ABORT' | 'INVALID_RESPONSE' | 'INTERNAL';
/** DataSource 작업(조회·저장·삭제) 오류 */
export declare class DataSourceError extends Error {
    readonly code: DataSourceErrorCode;
    readonly status?: number | undefined;
    readonly response?: unknown;
    readonly cause?: unknown;
    constructor(code: DataSourceErrorCode, message: string, status?: number | undefined, response?: unknown, cause?: unknown);
}
/** 코어 Ajax 또는 사용자 함수가 던진 오류를 DataSourceError로 정규화한다. */
export declare function toDataSourceError(error: unknown): DataSourceError;
/**
 * 서버 통신이 아닌 단계(beforeLoad 핸들러, 화면 반영 등)에서 던져진 오류를 DataSourceError로 정규화한다.
 * 서버 오류(NETWORK 등)로 오인하지 않도록 INTERNAL 코드를 사용하고 원래 오류는 cause에 보관한다.
 */
export declare function toInternalError(error: unknown): DataSourceError;
