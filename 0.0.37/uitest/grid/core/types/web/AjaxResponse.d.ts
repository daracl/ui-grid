import type { Loading } from "../../Loading";
import type { AjaxOptions } from "./AjaxOptions";

/**
 * Ajax 요청이 성공했을 때 resolve 되는 응답입니다.
 *
 * `T` 는 `data` 의 타입입니다. `responseType` 이 `json` 이면 파싱한 값, `text` 등은 문자열,
 * `blob`/`arraybuffer` 는 `Blob`/`ArrayBuffer` 입니다.
 */
export interface AjaxResponse<T = any> {
  /** 파싱한 응답 본문. 빈 본문(204 등)의 JSON 응답은 null 입니다. */
  data: T;
  /** HTTP 상태 코드 */
  status: number;
  /** 응답 원문 문자열. `blob`/`arraybuffer` 응답은 빈 문자열입니다. */
  responseText: string;
  /** 응답 헤더(이름은 소문자) */
  headers: Record<string, string>;
  /** 이 요청에 적용된 옵션(전역 옵션과 병합된 값) */
  config: AjaxOptions;
  /** XHR 방식은 `XMLHttpRequest`, Fetch 방식은 `Response` 입니다. 기존 호환을 위해 `any` 로 선언합니다. */
  xhr: any;
  /** 이 요청의 로더. 로더를 쓰지 않았으면 null 입니다. */
  loadingInstance: Loading | null;
  /** XHR 방식에서만 채워지는 readyState */
  readyState?: number;
  /** 기존 호환: 선언되지 않은 속성도 읽을 수 있습니다. */
  [key: string]: any;
}
