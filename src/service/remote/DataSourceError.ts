export type DataSourceErrorCode =
  | 'CONFIG'
  | 'UNSUPPORTED'
  | 'BUSY'
  | 'UNSAVED_CHANGES'
  | 'DESTROYED'
  | 'HTTP'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'ABORT'
  | 'INVALID_RESPONSE';

/** DataSource 작업(조회·저장·삭제) 오류 */
export class DataSourceError extends Error {
  constructor(
    public readonly code: DataSourceErrorCode,
    message: string,
    public readonly status?: number,
    public readonly response?: unknown,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'DataSourceError';
    Object.setPrototypeOf(this, DataSourceError.prototype);
  }
}

/** 코어 Ajax 또는 사용자 함수가 던진 오류를 DataSourceError로 정규화한다. */
export function toDataSourceError(error: unknown): DataSourceError {
  if (error instanceof DataSourceError) return error;

  const e = error as { type?: string; status?: number; statusText?: string; responseText?: string; name?: string; message?: string };
  if (e?.type === 'http') {
    return new DataSourceError('HTTP', `HTTP ${e.status} ${e.statusText ?? ''}`.trim(), e.status, e.responseText, error);
  }
  if (e?.type === 'timeout') return new DataSourceError('TIMEOUT', 'Request timeout', undefined, undefined, error);
  if (e?.type === 'abort' || e?.name === 'AbortError') {
    return new DataSourceError('ABORT', 'Request aborted', undefined, undefined, error);
  }
  if (e?.type === 'network') return new DataSourceError('NETWORK', 'Network error', undefined, undefined, error);
  // 성공 응답의 본문을 JSON 등으로 해석하지 못한 경우: 서버 응답이 형식에 맞지 않는다.
  if (e?.type === 'parse') {
    return new DataSourceError('INVALID_RESPONSE', e.message || 'Failed to parse response body', e.status, e.responseText, error);
  }
  // 허용되지 않은 HTTP 메서드라 요청을 보내지 않은 경우: 설정 오류이다.
  if (e?.type === 'method') return new DataSourceError('CONFIG', e.message || 'Invalid HTTP method', e.status, undefined, error);

  return new DataSourceError('NETWORK', e?.message || 'Request failed', undefined, undefined, error);
}
