import type {
  ChangeSet,
  DataSourceOptions,
  LoadFunction,
  LoadResult,
  RemoveFunction,
  RemoveRequest,
  SaveFunction,
  SaveResult,
} from '@/types/DataSource';
import { isArray, isFunction } from '@/util/utils';
import { DataSourceError } from './DataSourceError';
import { HttpDataSource } from './HttpDataSource';

/** RemoteDataController가 사용하는 정규화된 DataSource. 설정되지 않은 작업은 undefined이다. */
export interface DataSource {
  load?: LoadFunction;
  save?: (changes: ChangeSet, signal: AbortSignal) => Promise<SaveResult>;
  remove?: RemoveFunction;
}

/**
 * dataSource 옵션(HTTP 설정 또는 사용자 함수)을 동일한 함수 형태로 정규화한다.
 */
export function createDataSource(options: DataSourceOptions, loaderContainer?: HTMLElement): DataSource {
  const http = new HttpDataSource(options, loaderContainer);
  const source: DataSource = {};

  const { load, save, remove } = options;

  if (isFunction(load)) {
    source.load = (params, signal) => (load as LoadFunction)(params, signal);
  } else if (load) {
    source.load = async (params, signal) => normalizeLoadResult(await http.send('load', load, params, signal));
  }

  if (isFunction(save)) {
    source.save = async (changes, signal) => normalizeSaveResult(await (save as SaveFunction)(changes, signal));
  } else if (save) {
    source.save = async (changes, signal) => normalizeSaveResult(await http.send('save', save, changes, signal));
  }

  if (isFunction(remove)) {
    source.remove = (request, signal) => (remove as RemoveFunction)(request, signal);
  } else if (remove) {
    source.remove = async (request: RemoveRequest, signal) => {
      await http.send('remove', remove, request, signal);
    };
  }

  return source;
}

/**
 * 조회 응답 검증. 배열 또는 `{ items, total }`을 허용한다.
 */
export function normalizeLoadResult(response: unknown): LoadResult {
  const body = response as { items?: unknown; total?: unknown } | null;
  const items = isArray(response) ? response : body?.items;

  if (!isArray(items) || items.some((item) => item === null || typeof item !== 'object' || isArray(item))) {
    throw new DataSourceError('INVALID_RESPONSE', 'Load response must be an array or { items: object[] }', undefined, response);
  }

  const total = isArray(response) ? undefined : body?.total;
  if (total !== undefined && total !== null && (typeof total !== 'number' || !Number.isFinite(total) || total < 0)) {
    throw new DataSourceError('INVALID_RESPONSE', 'Load response total must be a non-negative number', undefined, response);
  }

  return { items: items as LoadResult['items'], total: (total as number | undefined) ?? undefined };
}

/**
 * 저장 응답 검증. 본문이 없거나 객체가 아니면 전체 성공으로 본다.
 */
export function normalizeSaveResult(response: unknown): SaveResult {
  const body = response as SaveResult | null | undefined;
  if (body === null || typeof body !== 'object' || isArray(body)) return {};

  if (body.failed !== undefined && !isArray(body.failed)) {
    throw new DataSourceError('INVALID_RESPONSE', 'Save response failed must be an array', undefined, response);
  }
  if (body.idMap !== undefined && (body.idMap === null || typeof body.idMap !== 'object' || isArray(body.idMap))) {
    throw new DataSourceError('INVALID_RESPONSE', 'Save response idMap must be an object', undefined, response);
  }

  return { idMap: body.idMap, failed: body.failed };
}
