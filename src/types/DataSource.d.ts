import type { LoadingOptions } from '@daracl/core';
import type { DataSourceError } from '@/service/remote/DataSourceError';
import type { DaraGrid } from '@/DaraGrid';
import type { RowId } from './Common';

/** DataSource가 수행하는 서버 작업 */
export type DataSourceOperation = 'load' | 'save' | 'remove';

/** 서버 조회 조건 */
export type RemoteParams = Record<string, unknown>;

/** 서버 행 데이터 */
export type RemoteRow = Record<string, any>;

/** 조회 결과 */
export interface LoadResult<T = RemoteRow> {
  items: T[];
  /** 서버 페이징 전체 건수. 없으면 items 길이를 사용한다. */
  total?: number;
}

/** 저장 요청 데이터. 변경된 행만 포함한다. */
export interface ChangeSet<T = RemoteRow> {
  created: T[];
  updated: T[];
  deleted: T[];
}

/** 서버 삭제 요청 데이터 */
export interface RemoveRequest<T = RemoteRow> {
  deleted: T[];
}

/**
 * 저장 결과
 *
 * - idMap : 저장 요청의 신규 행 ID → 서버가 부여한 ID. `rowIdField`(또는 tree.idField)를 지정한 경우에만 반영한다.
 * - failed : 저장에 실패한 행의 ID(요청 행의 ID 필드 값). 해당 행은 변경 상태를 유지한다.
 */
export interface SaveResult {
  idMap?: Record<string, RowId>;
  failed?: RowId[];
}

/** save() 결과 요약 */
export interface SaveSummary {
  created: number;
  updated: number;
  deleted: number;
  /** 실패로 보고되어 변경 상태가 유지된 행 수 */
  failed: number;
}

/** removeRemote() 결과 요약 */
export interface RemoveSummary {
  /** 서버 삭제 요청으로 삭제한 행 수 */
  removed: number;
  /** 서버 요청 없이 제거한 미저장 신규 행 수 */
  discarded: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpHeaders = Record<string, string>;

/** HTTP 요청 정보. `request` 주입 함수가 전달받는다. */
export interface HttpRequest {
  url: string;
  method: HttpMethod;
  headers: HttpHeaders;
  /** GET은 쿼리 스트링, 그 외 메서드는 JSON 본문으로 전송할 데이터 */
  data?: unknown;
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  timeout?: number;
  /** 코어 Ajax 로더를 표시할 컨테이너. 없으면 로더를 표시하지 않는다. */
  loaderContainer?: string | HTMLElement;
  loaderOption?: LoadingOptions;
}

/** 코어 Ajax 로더(loaderContainer) 설정 */
export interface DataSourceLoader {
  /** 로더를 표시할 컨테이너(selector 또는 요소). @default 그리드 요소 */
  container?: string | HTMLElement;
  /** 코어 Loading 옵션 */
  options?: LoadingOptions;
  /** 로더를 표시할 작업. 저장 중에도 편집이 가능하도록 기본은 조회만 표시한다. @default ['load'] */
  operations?: DataSourceOperation[];
}

export interface HttpEndpoint {
  url: string;
  /** @default load는 'GET', save/remove는 'POST' */
  method?: HttpMethod;
  headers?: HttpHeaders;
  credentials?: RequestCredentials;
  timeout?: number;
}

/** responseFilter에 전달되는 응답 정보 */
export interface ResponseInfo {
  /** HTTP 상태 코드가 성공(2xx)인지 여부 */
  ok: boolean;
  status: number;
  statusText?: string;
  /**
   * 응답 헤더(이름은 소문자). 코어 Ajax 응답은 성공·오류 모두 제공한다.
   * request 함수를 주입한 경우 성공 응답에는 없고, 오류는 던진 오류 객체의 headers가 있으면 사용한다.
   */
  headers?: Record<string, string>;
  /** ok가 false일 때의 기본 오류(DataSourceError, code 'HTTP'). 그대로 던지면 기본 동작과 같다. */
  error?: DataSourceError;
}

/** errorFilter에 전달되는 오류 응답 정보. 서버 응답이 없는 오류(NETWORK·TIMEOUT)는 값이 비어 있다. */
export interface ErrorInfo {
  /** HTTP 상태 코드. 응답이 있을 때만 제공한다. */
  status?: number;
  statusText?: string;
  /** 응답 헤더(이름은 소문자) */
  headers?: Record<string, string>;
  /** 응답 본문. JSON이면 파싱한 값, 아니면 문자열이며 HTTP 오류에서만 제공한다. */
  data?: unknown;
}

export type LoadFunction = (params: RemoteParams, signal: AbortSignal) => Promise<LoadResult>;
export type SaveFunction = (changes: ChangeSet, signal: AbortSignal) => Promise<SaveResult | void>;
export type RemoveFunction = (request: RemoveRequest, signal: AbortSignal) => Promise<unknown>;

/** 이벤트 공통 정보 */
export interface DataSourceEventBase {
  grid: DaraGrid;
  operation: DataSourceOperation;
}

export interface BeforeLoadEvent extends DataSourceEventBase {
  params: RemoteParams;
}
export interface LoadEvent extends BeforeLoadEvent {
  items: RemoteRow[];
  total: number;
}
export interface BeforeSaveEvent extends DataSourceEventBase {
  changes: ChangeSet;
}
export interface SaveEvent extends BeforeSaveEvent {
  summary: SaveSummary;
}
export interface BeforeRemoveEvent extends DataSourceEventBase {
  request: RemoveRequest;
}
export interface RemoveEvent extends BeforeRemoveEvent {
  summary: RemoveSummary;
}
export interface DataSourceErrorEvent extends DataSourceEventBase {
  error: Error;
}
export interface LoadingChangeEvent extends DataSourceEventBase {
  loading: boolean;
}

type Cancelable<E> = (event: E) => boolean | void | Promise<boolean | void>;
type Listener<E> = (event: E) => void;

/** before* 이벤트가 false(또는 resolve false)를 반환하면 작업을 취소한다. */
export interface DataSourceEvents {
  beforeLoad?: Cancelable<BeforeLoadEvent>;
  load?: Listener<LoadEvent>;
  loadError?: Listener<DataSourceErrorEvent>;
  beforeSave?: Cancelable<BeforeSaveEvent>;
  save?: Listener<SaveEvent>;
  saveError?: Listener<DataSourceErrorEvent>;
  beforeRemove?: Cancelable<BeforeRemoveEvent>;
  remove?: Listener<RemoveEvent>;
  removeError?: Listener<DataSourceErrorEvent>;
  loadingChange?: Listener<LoadingChangeEvent>;
}

export interface DataSourceOptions {
  load?: HttpEndpoint | LoadFunction;
  save?: HttpEndpoint | SaveFunction;
  remove?: HttpEndpoint | RemoveFunction;

  /** 상대 URL 앞에 붙는 공통 주소 */
  baseUrl?: string;
  /** 공통 헤더. 함수이면 요청마다 호출하므로 인증 토큰 갱신에 사용할 수 있다. */
  headers?: HttpHeaders | (() => HttpHeaders | Promise<HttpHeaders>);
  credentials?: RequestCredentials;
  timeout?: number;
  /** 코어 Ajax 전송 방식 */
  fetchMode?: 'fetch' | 'xhr';
  /**
   * 그리드 생성 직후 load()를 자동 실행한다. 툴바 사용 여부와 무관하며 dataSource.load가 필요하다.
   * 조회 조건은 툴바 값(툴바가 있을 때)만 사용하고, 실패는 loadError 이벤트로 알린다.
   * @default false
   */
  autoLoad?: boolean;
  /**
   * load()·searchRemote() 호출 시 툴바 필드 값을 조회 조건에 포함한다. 같은 이름의 명시 조건이 우선한다.
   * @default true
   */
  toolbarParams?: boolean;
  /** HTTP 요청 중 코어 Ajax 로더 표시 설정. false이면 표시하지 않는다. */
  loader?: false | DataSourceLoader;
  /** 코어 Ajax 대신 사용할 HTTP 전송 함수. 응답 본문(JSON)을 resolve한다. */
  request?: (request: HttpRequest) => Promise<unknown>;

  /** HTTP 요청 데이터 변환. 반환값이 조회 쿼리 또는 저장·삭제 본문이 된다. */
  requestMap?: (data: any, operation: DataSourceOperation) => unknown;
  /**
   * HTTP 응답 검사·정리. responseMap보다 먼저 호출되며 반환값이 responseMap(없으면 검증)에 전달된다.
   *
   * - 성공 응답: 응답 봉투(`{ code, message, data }`) 검사·해제 등에 사용한다.
   * - 상태 코드 오류(2xx 외: 401/403/404/500 등): errorFilter가 없을 때만(호환용, errorFilter 사용 권장) `info.ok`가 false로 호출되며 `response`는 응답 본문(JSON이면 파싱한 값)이다.
   *   값을 반환하면 오류가 복구되어 정상 응답처럼 이어지고(예: 404 → `{ items: [] }`), 던지면 그 오류가 전달되며,
   *   `info.error`를 던지면 기본 HTTP 오류가 그대로 전달된다. responseFilter가 없으면 기본적으로 HTTP 오류로 reject된다.
   * - 연결 실패·timeout·취소는 응답이 없으므로 호출하지 않는다.
   *
   * 던진 오류는(DataSourceError가 아니면 INVALID_RESPONSE로 변환되어) loadError/saveError/removeError 이벤트와 reject로 전달된다.
   * HTTP 설정에만 적용된다.
   */
  responseFilter?: (response: any, operation: DataSourceOperation, info: ResponseInfo) => unknown | Promise<unknown>;
  /**
   * HTTP 오류 처리. 상태 코드 오류(HTTP)와 연결 실패(NETWORK)·timeout(TIMEOUT)에서 호출되며 취소(ABORT)는 호출하지 않는다.
   *
   * - 값을 반환하면 오류가 복구되어 정상 응답처럼 responseMap(없으면 검증)으로 이어진다(responseFilter는 호출하지 않는다).
   * - 던진 오류는 그대로 전달되고, DataSourceError가 아니면 원래 오류의 code·status를 유지한 채 메시지만 바뀐다.
   *   `error`를 그대로 던지면 기본 동작과 같다.
   * - 복구하면 loadError/saveError/removeError 이벤트는 발생하지 않는다.
   * - errorFilter가 없으면 상태 코드 오류는 responseFilter(`info.ok === false`)로 전달된다(호환용).
   *
   * HTTP 설정에만 적용된다.
   */
  errorFilter?: (error: DataSourceError, operation: DataSourceOperation, info: ErrorInfo) => unknown | Promise<unknown>;
  /** HTTP 응답 변환. load는 LoadResult, save는 SaveResult를 반환해야 한다. */
  responseMap?: (response: any, operation: DataSourceOperation) => unknown;

  /** 서버 페이징. footer.enabled와 footer.paging.enabled가 필요하다. List 모드만 지원한다. */
  paging?: { mode: 'local' | 'server'; pageSize?: number };
  /** 서버 정렬은 아직 지원하지 않는다. 'server'를 지정하면 오류가 발생한다. */
  sorting?: { mode: 'local' | 'server' };
  /** 서버 필터링은 아직 지원하지 않는다. 'server'를 지정하면 오류가 발생한다. */
  filtering?: { mode: 'local' | 'server' };

  events?: DataSourceEvents;
}

export interface LoadOptions {
  /** 미저장 변경사항을 버리고 조회한다. @default false */
  discardChanges?: boolean;
}

export interface RemoveOptions {
  /** 삭제할 행 ID. 생략하면 선택된 행을 삭제한다. */
  rowIds?: RowId[];
}
