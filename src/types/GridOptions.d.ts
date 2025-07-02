import { FORM_MODE, POSITION_TYPE, RENDER_TYPE, SELECTION_MODE, THEME_TYPE } from "src/constants";
import { OptionCallback } from "./Common";
import { FieldItem } from "./GridField";

/**
 * grid options
 *
 * @interface GridOptions
 * @typedef {GridOptions}
 */
export interface GridOptions {
  /**
   *  테마 값
   */
  theme: THEME_TYPE;
  /**
   * 높이
   */
  height: "auto" | number;
  /**
   *  넓이값
   */
  width: "auto" | number;

  /**
   * window resize delay
   */
  windowResizeDelay: number;

  /**
   *  왼쪽 고정 컬럼
   */
  fixedLeftIndex: number;

  /**
   *  오른쪽 고정 컬럼
   */
  fixedRightIndex: number;

  /**
   *
   */
  styleClass: string;

  /**
   * 넓이 고정 여부.
   */
  enableWidthFixed: boolean;
  /**
   * 기본 포멧터 사용여부
   */
  useDefaultFormatter: boolean;
  /**
   * cell 선택 모드 row, cell, multiple-row, multiple-cell
   */
  selectionMode: SELECTION_MODE;
  /**
   * 툴팁 활성화 여부
   */
  enableTooltip: boolean;
  /**
   * add시 item max로 유지할 카운트
   */
  addLimitRow: number;
  /**
   * value filter function (colItem, objectValue)
   */
  valueFilter: boolean | OptionCallback;

  dataTypeFormatter: {
    money: ValueFormatter;
    number: ValueFormatter;
  };

  /**
   * 수정 모드 활성화
   */
  editable: boolean;
  /**
   * header options
   */
  header: HeaderOptions;
  /**
   * find option
   */
  finder: FindOptions;
  /**
   * toolbar option
   */
  toolbar: ToolbarOptions;
  /**
   * aside option
   */
  aside: AsideOptions;

  /**
   * body option
   */
  body: BodyOptions;

  /**
   * scroll option
   */
  scroll: ScrollOptions;
  /**
   * paging option
   */
  paging?: PagingParam;
  /**
   * footer option
   */
  footer: FooterOptions;
  /**
   * icon
   */
  icon: {
    sortup: string;
    sortdown: string;
  };
  /**
   * i18n
   */
  i18n: any;
  /**
   * setting condition operator
   */
  operators: any;

  /**
   * column info
   */
  fields: FieldItem[];
  /**
   * row info
   */
  items: any[];

  /**
   * 요약정보
   */
  summary?: SummaryOptions;
}

/**
 * header options
 *
 * @interface HeaderOptions
 * @typedef {HeaderOptions}
 */
export interface HeaderOptions {
  /**
   * header 보기 여부
   * @default true
   */
  view: boolean;

  /**
   * header 높이
   * @default 25
   */
  height: number;

  /**
   * 헤더 그룹일 경우 높이 값
   *
   * @type {number[]}
   */
  heights: number[];

  /**
   * 정렬 여부
   *
   * @default true
   */
  sort: {
    /**
     * 정렬 활성화 여부
     */
    enabled: boolean;
    /**
     * null value 를 항상 끝으로 유지 할지 여부
     */
    nullsLast: boolean;
    /**
     * custom sorting function
     */
    customSorting: boolean | OptionCallback;
  };

  /**
   * header resize option
   */
  resize: {
    /**
     *  resize 활성화 여부
     */
    enabled: boolean; // 활성화여부

    /**
     * 변경시 콜백 함수
     */
    update: boolean | OptionCallback;
    /**
     * 컬럼 최소 넓이
     */
    minWidth: number;
    /**
     * 컬럼 최대 넓이
     */
    maxWidth: number; // 컬럼 최대 넓이
  };
  /**
   * 전체 선택 활성화 여부
   */
  enableAllColumnSelection: boolean;
  /**
   * 마우스 휠로 가로 스크롤 이동할지 여부.
   */
  enableScroll: boolean;
  /**
   * char 의 넓이값
   */
  charWidth: number;
  /**
   * 모든 header label 활성화 할지 여부
   */
  enableViewAllLabel: boolean;

  /**
   *header contextmenu event
   */
  contextMenu: boolean | OptionCallback;

  /**
   * help 버튼 옵션
   */
  help: {
    /**
     * header help btn 활성 여부.
     */
    enabled: boolean;
    /**
     * tooltip title
     */
    title: string;
    /**
     * click event
     */
    click: boolean | OptionCallback;
    /**
     * double click event
     */
    dblclick: boolean | OptionCallback;
  };

  /**
   * drag 여부
   */
  drag: {
    /**
     * 활성화여부
     */
    enabled?: boolean;
    /**
     * drop selector
     */
    dropSelector?: string;
    /**
     * drop callback
     */
    dropCallback?: boolean | OptionCallback;
  };
}

/**
 * find options
 *
 * @interface FindOptions
 * @typedef {FindOptions}
 */
export interface FindOptions {
  /**
   * 활성화 여부
   */
  enabled?: boolean;

  /**
   * find mode
   * @example
   * "search" | "full"
   */
  mode?: "simple" | "full";

  /**
   * 고정 컬럼 활성여부
   */
  enableColumnFix?: boolean;

  /**
   * 직접 처리 할경우. function 으로 처리.
   */
  click?: boolean | OptionCallback;

  /**
   * button 으로만 닫기 여부
   */
  onlyCloseButton?: boolean;

  /**
   * 검색어 local storage에 저장 여부
   */
  useRememberValue?: boolean;

  /**
   * 넓이
   */
  width?: string | number;

  /**
   * 높이
   */
  height?: string | number;

  /**
   * click 콜백
   */
  callback?: boolean | OptionCallback;

  /**
   * 이전 설정값
   */
  rememberValue?: {
    /**
     *  검색 필드
     */
    field?: string;
    /**
     * 검색어
     */
    keyword?: string;
  };
  util: {
    /**
     * number 타입 체크 callback
     */
    isTypeNumber: OptionCallback;
  };
}

/**
 * toolbar options
 *
 * @interface ToolbarOptions
 * @typedef {ToolbarOptions}
 */
export interface ToolbarOptions {
  /**
   * 활성화 여부
   */
  enabled: boolean;
  /**
   * 위치
   */
  position: POSITION_TYPE;
  /**
   * 높이
   */
  height: number;
  /**
   * toolbar items
   */
  items: ToolbarItem[];
}

/**
 * toolbar item
 *
 * @interface ToolbarItem
 * @typedef {ToolbarItem}
 */
export interface ToolbarItem {
  /**
   * 검색 활성화 여부
   */
  search?: bolean;
  /**
   * 검색 콜백
   */
  searchCallback?: OptionCallback;
  /**
   * 구분선 추가 여부
   */
  divider?: true;
  /**
   * item key
   */
  key?: string;
  /**
   * label
   */
  label?: string;
  /**
   * 값 width
   */
  valueWidth?: string;
  /**
   * label width
   */
  labelWidth?: string;
  /**
   * render type
   */
  renderType?: RENDER_TYPE;
  /**
   * render item
   */
  renderItem?: {
    list: RenderItem[];
  };
  /**
   * 값 변경시 callback
   */
  change?: OptionCallback;
}

/**
 * Render item
 *
 * @interface RenderItem
 * @typedef {RenderItem}
 */
export interface RenderItem {
  /**
   * label
   */
  label: string;
  /**
   * value
   */
  value: any;
}

/**
 * aside option
 *
 * @interface AsideOptions
 * @typedef {AsideOptions}
 */
export interface AsideOptions {
  /**
   * 번호 보일지 여부
   */
  lineNumber: {
    /**
     *  활성화 여부
     */
    enabled?: boolean;
    /**
     * 컬럼명
     */
    label?: string;
    /**
     * 넓이
     */
    width?: number;
    /**
     * 순서
     */
    order?: number;
    /**
     * click시 row 전체 선택여부
     */
    enableRowSelection?: boolean; // 선택 여부
  };
  /**
   * 체크 박스
   */
  rowCheckbox: {
    /**
     * 활성화 여부
     */
    enabled: boolean;
    /**
     * 넓이
     */
    width?: number;
    /**
     * 순서
     */
    order?: number;
    /**
     * click 콜백
     */
    click?: OptionCallback;

    /**
     * 다중 선택 허용 여부
     *
     */
    allowMultiSelect?: boolean;
  };
  /**
   * 수정 여부
   */
  modifyInfo: {
    /**
     * 활성화 여부
     */
    enabled: boolean;
    /**
     * 컬럼명
     */
    label?: string;
    /**
     * 순서
     */
    order?: number;
    /**
     * 넓이
     */
    width?: number;
  };
}

/**
 * body option
 *
 * @interface BodyOptions
 * @typedef {BodyOptions}
 */
export interface BodyOptions {
  /**
   * body cell double click
   */
  cellDblClick?: OptionCallback;

  /**
   * row(tr) click event
   */
  cellClick?: OptionCallback;
  /**
   * arrows key handler function
   */
  keyNavHandler?: OptionCallback;

  /**
   * 붙여 넣기 전 호출 메소드
   */
  pasteBefore?: OptionCallback;
  /**
   * 붙여 넣기 후 호출 메소드
   */
  pasteAfter?: OptionCallback;

  /**
   * 로우 옵션.
   */
  row: {
    /**
     *  cell 높이
     */
    height: number;
    /**
     * row(tr) contextmenu event
     */
    contextMenu: boolean | OptionCallback;
    /**
     * 추가할 style method
     */
    addStyle: boolean | OptionCallback;
    /**
     * row dblclick event
     */
    dblClick: boolean | OptionCallback;
    /**
     * double click row checkbox checked true 여부.
     */
    enableDblClickRowCheck: boolean;
  };
}

/**
 * scroll option
 *
 * @interface ScrollOptions
 * @typedef {ScrollOptions}
 */
export interface ScrollOptions {
  /**
   * 이벤트 전파 여부.
   */
  enableStopPropagation?: boolean;
  /**
   * size
   */
  width: number;
  /**
   * 세로 스크롤 옵션
   */
  vertical: {
    enable: boolean;
    /**
     * 스크롤 스피드 row 1
     */
    speed: number;
    /**
     * 스크롤 이벤트 콜백
     */
    onUpdate?: OptionCallback;
    /**
     * item 카운트 tooltip
     */
    enableTooltip: boolean;
  };
  /**
   * 가로 스크롤 옵션
   */
  horizontal: {
    enable: boolean;
    /**
     * 스크롤 스피드
     */
    speed: number;
    /**
     * 마우스 wheel 로 스크롤 이동 여부
     */
    enableWheel: boolean;
    /**
     * 스크롤 이벤트 콜백
     */
    onUpdate: OptionCallback | boolean;
  };
}

/**
 * Navigation option
 *
 * @interface FooterOptions
 * @typedef {FooterOptions}
 */
export interface FooterOptions {
  /**
   * navigation page 사용여부
   */
  enabled?: boolean;

  /**
   * 높이
   */
  height?: number; // 높이 값

  paging?: {
    enabled?: boolean;
    /**
     * 위치 값
     */
    position?: POSITION_TYPE;
    /**
     * 페이지 포켓 위치
     */
    formatPosition?: POSITION_TYPE;
    /**
     * 페이지 메시지 포멧
     */
    format?: string | OptionCallback;

    /**
     * page num callback
     */
    callback?: OptionCallback; // 페이지 콜백
  };

  selection?: {
    /**
     * 위치 값
     */
    position?: POSITION_TYPE;
    format: string | OptionCallback;
  };
}

/**
 * paging param
 *
 * @interface PagingParam
 * @typedef {PagingParam}
 */
export interface PagingParam {
  /**
   * 전체 카운트
   */
  totalCount: number;
  /**
   * 현재 페이지 정보
   */
  currPage: number;
  /**
   * 페이지 row 카운트
   */
  countPerPage: number;
  /**
   * 페이지 카운트
   */
  unitPage: number;
}

export interface ValueFormatter {
  /**
   * prefix
   */
  prefix: string;
  /**
   * suffix
   */
  suffix: string;
  /**
   * 소수점.
   */
  fixed: number;
  /**
   * custom formatter
   */
  formatter?: OptionCallback;
}

export interface SummaryOptions {
  items: SummaryItem[][];
}

export interface SummaryItem {
  /**
   * field name
   */
  name: string;
  /**
   * 표시명
   */
  label: string;
  /**
   * sum, avg 연산
   */
  expression: string | OptionCallback;
}
