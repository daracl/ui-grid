import type { ChangeSet, DataSourceOptions, LoadFunction, LoadResult, RemoveFunction, SaveResult } from '../../types/DataSource.js';
/** RemoteDataController가 사용하는 정규화된 DataSource. 설정되지 않은 작업은 undefined이다. */
export interface DataSource {
    load?: LoadFunction;
    save?: (changes: ChangeSet, signal: AbortSignal) => Promise<SaveResult>;
    remove?: RemoveFunction;
}
/**
 * dataSource 옵션(HTTP 설정 또는 사용자 함수)을 동일한 함수 형태로 정규화한다.
 */
export declare function createDataSource(options: DataSourceOptions, loaderContainer?: HTMLElement): DataSource;
/**
 * 조회 응답 검증. 배열 또는 `{ items, total }`을 허용한다.
 */
export declare function normalizeLoadResult(response: unknown): LoadResult;
/**
 * 저장 응답 검증. 본문이 없거나 객체가 아니면 전체 성공으로 본다.
 */
export declare function normalizeSaveResult(response: unknown): SaveResult;
