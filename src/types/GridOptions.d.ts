import { FORM_MODE, POSITION_TYPE, RENDER_TYPE } from "src/constants";
import { OptionCallback } from "./Common";
import { ColumnItem } from "./GridField";


/**
 * grid options
 *
 * @export
 * @interface GridOptions
 * @typedef {GridOptions}
 */
export interface GridOptions {
  /**
   * style 옵션
   *
   * @example
   * ```
   * width: '600px',
      position: 'left',
      labelWidth: '3'
      valueWidth: '9'
   * ```
   */
  style: {
    /**
     * form width
     * @example
     * 600px, 100em
     */
    width: string;
    /**
     * field label width
     * @example
     * bootstrap width 참고 (1 ~ 12) 또는 '600px'
     */
    labelWidth: string | number;
    /**
     * field value width
     * @example
     * bootstrap width 참고 (1 ~ 12) 또는 '600px'
     */
    valueWidth: string | number;
    /**
     * field label position
     * @example
     * "top" | "left" | "left-left" | "left-right" | "right" | "right-left" | "right-right" | "bottom"
     */
    position: string;
  };

  /**
   * 수정 모드 활성화
   */
  enableEdit :boolean;
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
  toolbar:ToolbarOptions;
  /**
   * aside option
   */
  aside :AsideOptions;
  
  /**
   * body option
   */
  body:BodyOptions;
  /**
   * scroll option
   */
  scroll:ScrollOptions;
  /**
   * paging option
   */
  paging : PagingOptions;
  /**
   * navigation option
   */
  navigation : NavigationOptions;
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
  i18n:any;
  /**
   * setting condition operator
   */
  operators: any;

  field:ColumnItem[];
}

/**
 * header options
 *
 * @export
 * @interface HeaderOptions
 * @typedef {HeaderOptions}
 */
export interface HeaderOptions {
  /**
   * header 보기 여부
   * @default true
   */
  view?: boolean;

  /**
   * header 높이
   * @default 25
   */
  height?: number;

  /**
   * 정렬 여부
   *
   * @default true
   */
  sort?: boolean;

  /**
   * header resize option
   */
  resize: {
    /**
     *  resize 활성화 여부
     */
    enabled?: boolean; // 활성화여부

    /**
     * 변경시 콜백 함수
     */
    update?: OptionCallback;
    /**
     * 컬럼 최소 넓이
     */
    minWidth?: number;
    /**
     * 컬럼 최대 넓이
     */
    maxWidth?: number; // 컬럼 최대 넓이
  };
  /**
   * 전체 선택 활성화 여부
   */
  enableAllColumnSelection?: boolean;
  /**
   * 마우스 휠로 가로 스크롤 이동할지 여부.
   */
  enableScroll?: boolean;
  /**
   * char 의 넓이값
   */
  charWidth?: number;
  /**
   * 모든 header label 활성화 할지 여부
   */
  enableViewAllLabel?: boolean;

  /**
   *header contextmenu event
   */
  contextMenu?: boolean | OptionCallback;

  /**
   * help 버튼 옵션
   */
  help?: {
    /**
     * header help btn 활성 여부.
     */
    enabled?: boolean;
    /**
     * tooltip title
     */
    title?: string;
    /**
     * click event
     */
    click?: boolean | OptionCallback;
    /**
     * double click event
     */
    dblclick?: boolean | OptionCallback;
  };

  /**
   * drag 여부
   */
  drag?: {
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
 * @export
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
 * @export
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
  height: 넓이;

  items: ToolbarItem[];
}

/**
 * toolbar item
 *
 * @export
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
  renderItem?:{
    list: RenderItem[]
  };
  /**
   * 값 변경시 callback
   */
  change?: OptionCallback;
}


/**
 * Render item
 *
 * @export
 * @interface RenderItem
 * @typedef {RenderItem}
 */
export interface RenderItem {
  /**
   * label
   */
  label :string;
  /**
   * value
   */
  value : any;
}

/**
 * aside option
 *
 * @export
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
    name?: string;
    /**
     * 넓이
     */
    width?: number;
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
     * 컬럼명
     */
    name?: string;
    /**
    * 넓이
    */
    width?: number;
    /**
     * click 콜백
     */
    click?: OptionCallback;
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
     name?: string;
     /**
     * 넓이
     */
     width?: number;
  };
}

/**
 * body option
 *
 * @export
 * @interface BodyOptions
 * @typedef {BodyOptions}
 */
export interface BodyOptions{
  /**
   * body cell double click
   */
  cellDblClick: boolean | OptionCallback;
  /**
   * arrows key handler function
   */
  keyNavHandler: boolean | OptionCallback;
}

/**
 * scroll option
 *
 * @export
 * @interface ScrollOptions
 * @typedef {ScrollOptions}
 */
export interface ScrollOptions {
  /**
   * 이벤트 전파 여부.
   */
  enableStopPropagation?: boolean;
  /**
   * 세로 스크롤 옵션
   */
  vertical: {
    /**
     * 넓이
     */
    width?: number;
    /**
     * 스크롤 스피드 row 1
     */
    speed?: number;
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
    /**
     * 가로 스크롤 높이
     */
    height?: number; 
    /**
     * 스크롤 스피드
     */
    speed?: number;
    /**
     * 마우스 wheel 로 스크롤 이동 여부
     */
    enableWheel?: boolean;
    /**
     * 스크롤 이벤트 콜백
     */
    onUpdate?: OptionCallback;
  }
}


/**
 * Navigation option
 *
 * @export
 * @interface NavigationOptions
 * @typedef {NavigationOptions}
 */
export interface NavigationOptions{
  /**
   * navigation page 사용여부
   */
  enablePaging?: boolean;
  /**
   * 상태 보이기 여부
   */
  enableStatus?: boolean;
  /**
   * 상태 메시지 포멧
   */
  statusFormat?: string;
  /**
   * 높이
   */
  height?: number; // 높이 값
  /**
   * 위치 값
   */
  position?: POSITION_TYPE; // 위치 값
  /**
   * page num callback
   */
  callback: OptionCallback; // 페이지 콜백
  /**
   * cell 선택 정보 표시 여부
   */
  enableSelectionInfo: boolean;
  /**
   * cell 선택 정보 표시 포켓
   */
  selectionInfoFormat: string;
}


export interface PagingOptions{
}