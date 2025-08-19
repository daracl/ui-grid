/**
 * 메시지 정의를 위한 인터페이스
 * 유효성 검사 메시지 및 UI 텍스트를 포함합니다.
 */
export interface Message {
  /** 필수 입력 필드에 대한 메시지 */
  required: string;

  /** 선택 항목에 대한 메시지 */
  selection: string;

  /**
   * 문자열 관련 유효성 검사 메시지
   */
  string?: {
    /** 최소 길이 미만일 때 메시지 */
    minLength?: string;

    /** 최대 길이 초과 시 메시지 */
    maxLength?: string;

    /** 허용된 길이 범위를 벗어났을 때 메시지 */
    between?: string;
  };

  /**
   * 숫자 관련 유효성 검사 메시지
   */
  number?: {
    /** 숫자가 아닌 값(NaN)일 때 메시지 */
    nan?: string;

    /** 최소값 미만일 때 메시지 */
    minimum?: string;

    /** exclusiveMinimum 설정 위반 시 메시지 */
    exclusiveMinimum?: string;

    /** 최대값 초과 시 메시지 */
    maximum?: string;

    /** exclusiveMaximum 설정 위반 시 메시지 */
    exclusiveMaximum?: string;

    /** 허용된 숫자 범위 밖일 때 메시지 */
    between?: string;

    /** 최소값만 exclusive일 때 메시지 */
    betweenExclusiveMin?: string;

    /** 최대값만 exclusive일 때 메시지 */
    betweenExclusiveMax?: string;

    /** 최소/최대 모두 exclusive일 때 메시지 */
    betweenExclusiveMinMax?: string;
  };

  /**
   * 정규식 기반 유효성 검사 메시지
   */
  regexp?: {
    /** 휴대폰 번호 형식이 아닐 때 */
    mobile?: string;

    /** 이메일 형식이 아닐 때 */
    email?: string;

    /** URL 형식이 아닐 때 */
    url?: string;

    /** 숫자가 아닐 때 */
    number?: string;

    /** 알파벳만 허용할 때 위반 메시지 */
    alpha?: string;

    /** 알파벳 + 숫자 조합이 아닐 때 */
    "alpha-num"?: string;

    /** 변수명 형식이 아닐 때 */
    variable?: string;

    /** 숫자 포함 필요할 때 */
    "number-char"?: string;

    /** 대문자 포함 필요할 때 */
    "upper-char"?: string;

    /** 대문자 + 특수문자 포함 필요할 때 */
    "upper-char-special"?: string;

    /** 대문자 + 특수문자 + 숫자 포함 필요할 때 */
    "upper-char-special-number"?: string;
  };

  /** 검색 필드 라벨 텍스트 */
  "search.label": string;

  /** 데이터가 없을 때 표시할 메시지 */
  "no.data": string;

  /** 전체 선택 텍스트 */
  "select.all": string;

  /** "전체" 라벨 */
  all: string;

  /** 선택 라벨 */
  select: string;

  /** 검색 버튼 또는 텍스트 */
  search: string;

  /** 이전 페이지 버튼 텍스트 */
  prev: string;

  /** 다음 페이지 버튼 텍스트 */
  next: string;
}
