import { Ajax } from '@daracl/core';
import type {
  DataSourceOperation,
  DataSourceOptions,
  ErrorInfo,
  HttpEndpoint,
  HttpHeaders,
  HttpMethod,
  HttpRequest,
  ResponseInfo,
} from '@/types/DataSource';
import { joinUrl } from '@/util/utils';
import { DataSourceError, toDataSourceError } from './DataSourceError';

const VALID_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * 코어 Ajax(또는 주입된 request 함수)로 서버와 통신하는 DataSource.
 *
 * 조회(GET)는 쿼리 스트링, 저장·삭제는 JSON 본문으로 전송한다.
 */
export class HttpDataSource {
  private ajax?: Ajax;

  constructor(private readonly opts: DataSourceOptions, private readonly defaultLoaderContainer?: HTMLElement) {}

  /**
   * 엔드포인트로 요청을 보내고 (responseFilter·errorFilter·responseMap이 적용된) 응답을 반환한다.
   */
  public async send(
    operation: DataSourceOperation,
    endpoint: HttpEndpoint,
    payload: unknown,
    signal: AbortSignal,
  ): Promise<unknown> {
    const method = (endpoint.method ?? (operation === 'load' ? 'GET' : 'POST')).toUpperCase() as HttpMethod;

    if (!VALID_METHODS.includes(method)) {
      throw new DataSourceError('CONFIG', `Unsupported HTTP method: ${method}`);
    }
    if (method === 'GET' && operation !== 'load') {
      throw new DataSourceError('CONFIG', `${operation} cannot use the GET method`);
    }

    const request: HttpRequest = {
      url: joinUrl(this.opts.baseUrl, endpoint.url),
      method,
      headers: await this.resolveHeaders(method, endpoint),
      data: this.opts.requestMap ? this.opts.requestMap(payload, operation) : payload,
      signal,
      credentials: endpoint.credentials ?? this.opts.credentials,
      timeout: endpoint.timeout ?? this.opts.timeout,
      ...this.resolveLoader(operation),
    };

    let response: unknown;
    let info: ResponseInfo = { ok: true, status: 200 };
    // errorFilter가 오류를 복구한 값이면 responseFilter는 건너뛰고 responseMap으로 이어진다.
    let recovered = false;

    try {
      const result = this.opts.request
        ? { data: await this.opts.request(request) }
        : await this.sendByAjax(request);
      response = result.data;
      info = { ok: true, status: result.status ?? 200, headers: result.headers };
    } catch (error) {
      const dsError = toDataSourceError(error);
      // 취소(ABORT)는 사용자의 의도이므로 필터를 거치지 않는다.
      if (dsError.code === 'ABORT') throw dsError;

      if (this.opts.errorFilter) {
        // 서버 응답이 없는 오류(NETWORK·TIMEOUT)도 받는다. 상태·헤더·본문은 응답이 있을 때만 채워진다.
        response = await this.runErrorFilter(this.opts.errorFilter, dsError, error, operation);
        recovered = true;
      } else if (dsError.code === 'HTTP' && this.opts.responseFilter) {
        // errorFilter가 없으면 기존처럼 상태 코드 오류를 responseFilter(info.ok === false)가 처리한다.
        response = parseBody(dsError.response);
        info = {
          ok: false,
          status: dsError.status ?? 0,
          statusText: (error as { statusText?: string })?.statusText,
          headers: extractHeaders(error),
          error: dsError,
        };
      } else {
        throw dsError;
      }
    }

    // responseFilter(검사·정리·오류 복구) → responseMap(모양 변환) 순서로 적용한다. 필터가 던진 오류도 DataSourceError로 정규화한다.
    try {
      if (this.opts.responseFilter && !recovered) response = await this.opts.responseFilter(response, operation, info);
    } catch (error) {
      // DataSourceError는 그대로 전달하고, 그 외 오류는 응답이 유효하지 않은 것으로 본다.
      if (error instanceof DataSourceError) throw error;
      throw new DataSourceError('INVALID_RESPONSE', (error as Error)?.message || 'Response rejected by responseFilter', undefined, response, error);
    }

    return this.opts.responseMap ? this.opts.responseMap(response, operation) : response;
  }

  /**
   * errorFilter를 호출한다. 값을 반환하면 오류 복구, 던지면 그 오류를 전달한다.
   * DataSourceError가 아닌 오류는 원래 오류의 code·status·response를 유지한 채 메시지만 바꿔 정규화한다.
   */
  private async runErrorFilter(
    filter: NonNullable<DataSourceOptions['errorFilter']>,
    dsError: DataSourceError,
    rawError: unknown,
    operation: DataSourceOperation,
  ): Promise<unknown> {
    const info: ErrorInfo = {
      status: dsError.status,
      statusText: (rawError as { statusText?: string })?.statusText,
      headers: extractHeaders(rawError),
      data: dsError.code === 'HTTP' ? parseBody(dsError.response) : undefined,
    };

    try {
      return await filter(dsError, operation, info);
    } catch (error) {
      if (error instanceof DataSourceError) throw error;
      throw new DataSourceError(
        dsError.code,
        (error as Error)?.message || dsError.message,
        dsError.status,
        dsError.response,
        error,
      );
    }
  }

  /** 코어 Ajax의 loaderContainer·loaderOption 값을 구한다. */
  private resolveLoader(operation: DataSourceOperation): Pick<HttpRequest, 'loaderContainer' | 'loaderOption'> {
    const loader = this.opts.loader;
    if (loader === false || !(loader?.operations ?? ['load']).includes(operation)) return {};

    return {
      loaderContainer: loader?.container ?? this.defaultLoaderContainer,
      loaderOption: loader?.options,
    };
  }

  private async resolveHeaders(method: HttpMethod, endpoint: HttpEndpoint): Promise<HttpHeaders> {
    const common = this.opts.headers;
    const headers: HttpHeaders = {
      Accept: 'application/json',
      ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
      ...(typeof common === 'function' ? await common() : common),
      ...endpoint.headers,
    };
    return headers;
  }

  private sendByAjax(request: HttpRequest): Promise<{ data: unknown; status?: number; headers?: Record<string, string> }> {
    if (!this.ajax) {
      this.ajax = Ajax.create({ validMethods: VALID_METHODS, fetchMode: this.opts.fetchMode });
    }

    const isGet = request.method === 'GET';

    return this.ajax
      .request({
        url: request.url,
        method: request.method,
        headers: request.headers,
        responseType: 'json',
        params: isGet ? (request.data as Record<string, unknown>) : undefined,
        data: isGet ? undefined : request.data,
        signal: request.signal,
        credentials: request.credentials,
        timeout: request.timeout,
        enableLoader: Boolean(request.loaderContainer),
        loaderContainer: request.loaderContainer,
        loaderOption: request.loaderOption,
      })
      .then((result) => ({ data: result?.data, status: result?.status, headers: result?.headers }));
  }
}

/**
 * 오류 객체에서 응답 헤더를 꺼낸다(이름은 소문자). 코어 Ajax 오류의 xhr(XMLHttpRequest 또는 fetch Response)과
 * 주입한 request 함수가 던진 오류의 headers 객체를 지원한다.
 */
function extractHeaders(error: unknown): Record<string, string> | undefined {
  const source = error as { headers?: unknown; xhr?: { getAllResponseHeaders?: () => string; headers?: unknown } } | null;
  const headers: Record<string, string> = {};

  const raw = source?.xhr?.getAllResponseHeaders?.();
  if (typeof raw === 'string') {
    for (const line of raw.trim().split(/[\r\n]+/)) {
      const index = line.indexOf(':');
      if (index > 0) headers[line.slice(0, index).trim().toLowerCase()] = line.slice(index + 1).trim();
    }
  }

  const fetched = source?.xhr?.headers as { forEach?: (callback: (value: string, key: string) => void) => void } | undefined;
  fetched?.forEach?.((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  if (source?.headers && typeof source.headers === 'object') {
    for (const [key, value] of Object.entries(source.headers as Record<string, unknown>)) {
      headers[key.toLowerCase()] = String(value);
    }
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

/** 오류 응답 본문(문자열)을 JSON이면 객체로, 아니면 문자열 그대로 돌려준다. */
function parseBody(body: unknown): unknown {
  if (typeof body !== 'string' || body === '') return body;
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
