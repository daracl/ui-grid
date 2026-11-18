export interface LoadingOptions {
  /** 기본값 auto는 시스템 설정 또는 상위 요소의 data-daracl-theme(light|dark) 속성을 따릅니다. 공유 화면은 최초 생성자의 테마를 사용합니다. */
  theme?: "auto" | "light" | "dark";
  /**
   * 사라지는 시간(밀리초).
   * 지정하지 않으면 자동으로 사라지지 않습니다.
   * 공유 화면에서도 이 인스턴스에만 적용되며 다른 참여자가 남아 있으면 화면을 유지합니다.
   *
   * @type {number|undefined}
   */
  timeout?: number;

  /**
   * 시간 표시 여부. 공유 화면에서는 활성화한 참여자 중 가장 이른 시작부터 경과한 초를 표시합니다.
   *
   * @type {boolean|undefined}
   */
  enableTime?: boolean;

  /** 같은 컨테이너에서 처리 중인 요청 수를 표시합니다. 기본값은 false입니다. */
  enableRequestCount?: boolean;

  /** 이 로딩 인스턴스가 담당하는 요청 수입니다. Ajax는 요청마다 1을 지정합니다. */
  requestCount?: number;

  /**
   * 표시할 HTML 내용. script·on* 속성처럼 위험한 요소는 제거하고 허용된 태그(b, i, span, p 등)만 표시합니다.
   * 공유 화면에서는 현재 참여자 중 마지막으로 지정한 비어 있지 않은 내용을 표시합니다.
   *
   * @type {string|undefined}
   */
  content?: string;

  /**
   * 배경 색상(CSS color 문자열).
   *
   * @type {string|undefined}
   */
  bgColor?: string;

  /**
   * z-index 값으로 레이어 우선순위를 지정합니다.
   *
   * @type {number|undefined}
   */
  zIndex?: number;

  /**
   * 불투명도(opacity) 값(CSS 문자열 또는 숫자 형식).
   *
   * @type {string|undefined}
   */
  opacity?: string;

  /**
   * 로딩 이미지 경로 또는 data:image URL. 비어 있거나 javascript: 같은 안전하지 않은 URL이면 테마 색상의 CSS 스피너를 표시합니다.
   *
   * @type {string|undefined}
   */
  loadingImg?: string;

  /**
   * 마우스 커서 스타일(CSS cursor 값).
   *
   * @type {string|undefined}
   */
  cursor?: string;

  /**
   * 취소 버튼 표시 여부.
   * 공유 화면에서는 참여자 중 하나라도 활성화하면 표시합니다.
   *
   * @type {boolean|undefined}
   */
  enableCancelButton?: boolean;

  /**
   * 취소 또는 완료 시 호출되는 콜백 함수.
   * 콜백에 현재 옵션 객체를 전달하며, boolean을 반환하면 내부 동작을 제어할 수 있습니다.
   *
   * @param {LoadingOptions} param - 호출 시 전달되는 현재 옵션 객체
   * @returns {boolean|void} - true/false를 반환하거나 아무 것도 반환하지 않을 수 있습니다.
   */
  callback?: (param: LoadingOptions) => boolean | void;
}
