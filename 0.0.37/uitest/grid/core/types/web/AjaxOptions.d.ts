import { ajaxCallback, OptionCallback } from "../callbackFunction";
import { LoadingOptions } from "../LoadingOptions";


export interface GlobalAjaxOptions {
  baseUrl?: string;
  method?: string;
  /** "json"(기본) 은 파싱, "text" 등은 원문 문자열, "blob"/"arraybuffer" 는 바이너리(data 로 반환, responseText 는 빈 문자열) */
  responseType?: string;
  timeout?: number;
  errorAlertView?: boolean;
  headers?: any;
  enableDefaultLoader?: boolean;
  loaderContainer?: string | HTMLElement;
  loaderOption?: LoadingOptions;
  validMethods?: string[];
  beforeRequest?: ajaxCallback;
  beforeResponse?: ajaxCallback;
  /** External cancellation; never aborted by the library. */
  signal?: AbortSignal;
  /** XHR supports same-origin/include; omit requires fetch. */
  credentials?: RequestCredentials;
  /** Query parameters for any HTTP method. GET data remains supported. */
  params?: Record<string, unknown>;
  /** false disables the loader even when globally enabled. */
  enableLoader?: boolean;
  /** true 면 data 를 가공하지 않고 그대로 본문으로 보낸다(multipart 로 감싸거나 JSON 으로 직렬화하지 않음). File/Blob·ArrayBuffer·typed array·문자열·URLSearchParams 만 허용하며 그 외 객체는 TypeError 다. Content-Type 은 직접 지정하거나, 없으면 Blob 의 type 을 브라우저가 사용한다. presigned URL 업로드처럼 파일 바이트만 받는 API 용이다. */
  rawBody?: boolean;
  /** true 면 로더에 진행률(%)을 표시한다. 파일이 든 업로드와 responseType 이 blob/arraybuffer 인 다운로드에만 적용하고, 로더가 표시되는 요청에만 적용한다. Fetch 는 진행 이벤트가 없으므로 fetchMode "fetch" 와 함께 쓰면 TypeError 로 거부한다(fetchMode "xhr" 사용). 전체 크기를 알 수 없으면(lengthComputable=false) 갱신하지 않는다. */
  showProgress?: boolean;
  /** Override the instance transport for this request. */
  fetchMode?: "fetch" | "xhr";
  /** Defaults to HTTP 200-299. */
  validateStatus?: (status: number) => boolean;
  /** Custom query string serializer for `params` (e.g. array format). Defaults to objectToQueryString. */
  paramsSerializer?: (params: Record<string, unknown>) => string;

}



export interface AjaxOptions {
  /** External cancellation; never aborted by the library. 전역 signal 과 함께 지정하면 둘 중 하나만 취소돼도 요청이 취소된다. */
  signal?: AbortSignal;
  /** XHR supports same-origin/include; omit requires fetch. */
  credentials?: RequestCredentials;
  /** Query parameters for any HTTP method. GET data remains supported. */
  params?: Record<string, unknown>;
  /** false disables the loader even when globally enabled. */
  enableLoader?: boolean;
  /** true 면 data 를 가공하지 않고 그대로 본문으로 보낸다(multipart 로 감싸거나 JSON 으로 직렬화하지 않음). File/Blob·ArrayBuffer·typed array·문자열·URLSearchParams 만 허용하며 그 외 객체는 TypeError 다. Content-Type 은 직접 지정하거나, 없으면 Blob 의 type 을 브라우저가 사용한다. presigned URL 업로드처럼 파일 바이트만 받는 API 용이다. */
  rawBody?: boolean;
  /** true 면 로더에 진행률(%)을 표시한다. 파일이 든 업로드와 responseType 이 blob/arraybuffer 인 다운로드에만 적용하고, 로더가 표시되는 요청에만 적용한다. Fetch 는 진행 이벤트가 없으므로 fetchMode "fetch" 와 함께 쓰면 TypeError 로 거부한다(fetchMode "xhr" 사용). 전체 크기를 알 수 없으면(lengthComputable=false) 갱신하지 않는다. */
  showProgress?: boolean;
  /** Override the instance transport for this request. */
  fetchMode?: "fetch" | "xhr";
  /** Defaults to HTTP 200-299. */
  validateStatus?: (status: number) => boolean;
  /** Custom query string serializer for `params` (e.g. array format). Defaults to objectToQueryString. */
  paramsSerializer?: (params: Record<string, unknown>) => string;
  url?: string;
  method?: string;
  /** "json"(기본) 은 파싱, "text" 등은 원문 문자열, "blob"/"arraybuffer" 는 바이너리(data 로 반환, responseText 는 빈 문자열) */
  responseType?: string;
  /** false 면 동기 XHR. 동기에서는 timeout 과 blob/arraybuffer 를 쓸 수 없다. */
  async?: boolean;
  data?: any;
  timeout?: number;
  errorAlertView?: boolean;
  headers?: any;
  loaderContainer?: string | HTMLElement;
  loaderOption?: LoadingOptions;
  beforeRequest?: ajaxCallback;
  beforeResponse?: ajaxCallback;
  /** 업로드 진행 콜백({ xhr, ev }). Fetch 는 업로드 진행을 지원하지 않으므로 fetchMode "fetch" 와 함께 지정하면 TypeError 로 거부한다(fetchMode "xhr" 사용). */
  onUploadProgress?: OptionCallback;
  /** 다운로드 진행 콜백({ xhr, ev }). Fetch 는 지원하지 않으므로 fetchMode "fetch" 와 함께 지정하면 TypeError 로 거부한다(fetchMode "xhr" 사용). */
  onDownloadProgress?: OptionCallback;
}
