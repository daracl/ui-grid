import { Ajax } from '@daracl/core';
import type { DataSourceOperation, DataSourceOptions, HttpEndpoint, HttpHeaders, HttpMethod, HttpRequest } from '@/types/DataSource';
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
   * 엔드포인트로 요청을 보내고 (responseMap이 적용된) 응답을 반환한다.
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
      url: (this.opts.baseUrl ?? '') + endpoint.url,
      method,
      headers: await this.resolveHeaders(method, endpoint),
      data: this.opts.requestMap ? this.opts.requestMap(payload, operation) : payload,
      signal,
      credentials: endpoint.credentials ?? this.opts.credentials,
      timeout: endpoint.timeout ?? this.opts.timeout,
      ...this.resolveLoader(operation),
    };

    let response: unknown;
    try {
      response = await (this.opts.request ? this.opts.request(request) : this.sendByAjax(request));
    } catch (error) {
      throw toDataSourceError(error);
    }

    return this.opts.responseMap ? this.opts.responseMap(response, operation) : response;
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

  private sendByAjax(request: HttpRequest): Promise<unknown> {
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
      .then((result) => result?.data);
  }
}
