export type DataSourceErrorCode = 'CONFIG' | 'UNSUPPORTED' | 'BUSY' | 'UNSAVED_CHANGES' | 'DESTROYED' | 'HTTP' | 'NETWORK' | 'TIMEOUT' | 'ABORT' | 'INVALID_RESPONSE';
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
