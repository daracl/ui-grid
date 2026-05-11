import { POSITION_TYPE, SELECTION_MODE, THEME_TYPE } from '@/constants';
import { DisplayFormatOptions, OptionCallback } from './Common';
import { CellInfo } from './GridConfig';
import { FieldItem } from './GridField';
import { RendererInfo } from './RendererInfo';

/**
 * grid options
 *
 * @interface GridOptions
 * @typedef {GridOptions}
 */
export interface GridOptions {
  /**
   * 고유 아이디 키값
   */
  rowIdField: string;
  /**
   *  테마 값
   */
  theme: THEME_TYPE;
  /**
   * 높이
   */
  height: 'auto' | number;
  /**
   *  넓이값
   */
  width: 'auto' | number;

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
  search: SearchOptions;
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

  /**
   * context menu option
   *
   * @type {ContextMenuOptions}
   */
  contextMenu?: ContextMenuOptions;

  tree?: TreeOptions;
}

export interface TreeOptions {
  /**
   * 각 row를 고유하게 식별하는 필드명
   * 예: 'id'
   * ⚠️ 모든 row는 반드시 unique 해야 함
   */
  idField: string;

  /**
   * 부모 row의 id를 참조하는 필드명
   * 예: 'parentId'
   * - 루트 노드는 null, undefined, '0' 등으로 처리 가능
   */
  parentIdField: string;

  /**
   * 자식 노드 배열이 저장되는 필드명
   * 기본값: 'children'
   * 예: 'nodes', 'items', 'childList'
   * ⚠️ API마다 다르므로 옵션으로 분리하는 것이 중요
   */
  childrenField?: string;

  /**
   * 초기 렌더 시 자동으로 펼칠 depth
   * 예: 0 = 루트만, 1 = 1단계까지 펼침
   * ⚠️ defaultExpandedIds보다 우선순위 낮게 처리하는 것을 권장
   */
  expandDepth?: number;

  /**
   * 특정 row들을 초기 상태에서 펼칠 때 사용
   * 예: ['A', 'B']
   * - 서버에서 expand 상태를 내려줄 때 유용
   * - expandDepth보다 우선 적용 권장
   */
  defaultExpandedIds?: RowId[];

  /**
   * flat 데이터 구조를 tree 구조로 변환할지 여부
   * true: [{id, parentId}] → tree 변환
   * false: 이미 children 구조를 가진 데이터로 간주
   * ⚠️ 대용량 데이터에서는 변환 비용 고려 필요
   */
  isFlatData?: boolean;
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
  height: number | number[];

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
  resize: HeaderResize;
  /**
   * 전체 선택 활성화 여부
   */
  enableAllColumnSelection: boolean;
  /**
   * 마우스 휠로 가로 스크롤 이동할지 여부.
   */
  enableScroll: boolean;
  /**
   * 모든 header label 활성화 할지 여부
   */
  enableViewAllLabel: boolean;

  /**
   * help 버튼 옵션
   */
  help: {
    /**
     * header help btn 활성 여부.
     */
    enabled: boolean;
    /**
     * help content
     */
    content: string | OptionCallback;
    /**
     * click event
     */
    click?: OptionCallback;
    /**
     * delay
     */
    showDelay: number;
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

export interface HeaderResize {
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
}

/**
 * search options
 *
 * @interface SearchOptions
 * @typedef {SearchOptions}
 */
export interface SearchOptions {
  /**
   * 활성화 여부
   */
  enabled?: boolean;

  /**
   * 검색어 완전 일치 여부 (정규식)
   */
  matchWholeRegex?: RegExp;

  /**
   * find mode
   * @example
   * "search" | "full"
   */
  mode?: 'simple' | 'full';

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
  width?: number;

  /**
   * 높이
   */
  height?: number;

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
   * item name
   */
  name: string;
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
  renderer?: RendererInfo;
  /**
   * 값 변경시 callback
   */
  change?: OptionCallback;
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
   * cell double click 이벤트
   */
  cellDblClick?: OptionCallback;

  /**
   * row(click) 이벤트
   */
  cellClick?: OptionCallback;

  /**
   * disable keydown
   */
  disableKeydown?: boolean;

  /**
   * 화살표 키 이동 등 key 이벤트 핸들러
   */
  keyNavHandler?: OptionCallback;

  /**
   * 붙여넣기 전 호출 이벤트
   */
  pasteBefore?: OptionCallback;

  /**
   * 붙여넣기 후 호출 이벤트
   */
  pasteAfter?: OptionCallback;

  /**
   * 행 이동(row drag & drop / reorder / tree 이동) 옵션
   */
  rowMove?: RowMoveOptions;

  /**
   * row 단위 옵션
   */
  row: {
    /**
     * row 높이
     */
    height: number;

    /**
     * 추가 스타일 적용 여부
     * boolean 또는 callback으로 row 단위 제어 가능
     */
    addStyle: boolean | OptionCallback;

    /**
     * row double click 이벤트
     */
    dblClick: boolean | OptionCallback;

    /**
     * double click 시 row checkbox 체크 여부
     */
    selectRowOnCellClick: boolean;
  };
}

export interface RowMoveEventParams {
  moveItems: CellInfo[];
  dropItemIdx: number;
  position: 'before' | 'after' | 'inside';
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
  enableWheelInContainer?: boolean;
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
  /**
   * header 높이
   * @type number |number[]
   */
  height: number | number[];

  position: top | bottom;

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

  colspan: number;

  rowspan: number;

  /**
   * sum, avg 연산
   */
  expression: string | OptionCallback;
  /**
   *display format
   */
  displayFormat?: DisplayFormatOptions;
}

/**
 * context menu
 *
 * @export
 * @interface ContextMenuOptions
 * @typedef {ContextMenuOptions}
 */
export interface ContextMenuOptions {
  /**
   * click before
   *
   */
  beforeActivate: OptionCallback;
  /**
   * 컨텍스트 메뉴 오픈시 disable item
   */
  disableItem: OptionCallback;
  /**
   * click callback
   */
  callback: OptionCallback;
  /**
   * context mene items
   */
  items: ContextMenuItem[];

  /**
   * enable header
   */
  enableHeader: boolean;
}

/**
 * context menu item
 *
 * @export
 * @interface ContextMenuItem
 * @typedef {ContextMenuItem}
 */
export interface ContextMenuItem {
  /**
   * context menu header
   *
   * @type {?string}
   */
  header?: string;

  /**
   * key
   *
   * @type {?string}
   */
  key?: string;
  /**
   * click disabled
   */
  disabled?: boolean;
  /**
   * hotkey
   */
  hotkey?: string;
  /**
   * context menu label
   */
  label: string;
  /**
   * checkbox
   */
  checkbox?: boolean;

  /**
   * click callback
   *
   * @type {?OptionCallback}
   */
  callback?: OptionCallback;

  styleClass: string;

  /**
   * 구분선
   *
   * @type {?boolean}
   */
  divider?: boolean;
  /**
   * children
   *
   * @type {ContextMenuItem[]}
   */
  children?: ContextMenuItem[];
}

export interface RowMoveOptions {
  /**
   * 기능 활성화 여부
   */
  enabled: boolean;

  enableDragHandle?: boolean;

  /**
   * 드래그 핸들 컬럼 지정
   * 컬럼 key 또는 배열로 지정 가능
   * 지정하지 않으면 전체 row 어디서든 drag 가능
   */
  dragHandle?: string;

  /**
   * 드래그 가능 여부를 동적으로 제어
   * @param rowData 현재 row 데이터
   * @param rowIndex row index
   */
  draggable?: (rowData: any, rowIndex: number) => boolean;

  /**
   * 다른 parent(row)로 이동 허용 여부
   * tree 구조를 고려한 옵션
   */
  allowChangeParent?: boolean;

  /**
   * 드래그 시작 이벤트
   *  @param params.moveItems 이동하는 row 데이터 배열
   * @returns 이동 허용 여부 (false 반환 시 해당 드래그 동작 취소)
   * - 드래그 시작 시점에 이동을 허용할지 여부를 결정하는 콜백 함수
   * - 예: 특정 row는 이동 불가하도록 설정 가능
   * - 반환값이 false인 경우 해당 드래그 동작이 취소되고, row는 원래 위치에 남게 됨
   * - 반환값이 true이거나 undefined인 경우 드래그가 정상적으로 진행됨
   */
  dragStart?: (params: { moveItems: any[] }) => boolean | void;

  /**
   * 드래그 중 위치 변경 이벤트
   * (UI 업데이트, placeholder 이동 등)
   * @param params.moveItems 이동하는 row 데이터 배열
   * @param params.dropItemIdx 현재 드롭 위치의 row index
   * @returns 드롭 허용 여부 (false 반환 시 해당 위치로의 드롭 금지)
   * - 드래그 중에 현재 드롭 위치가 유효한지 여부를 결정하는 콜백 함수
   * - 예: 특정 위치에는 드롭 불가하도록 설정 가능
   * - 반환값이 false인 경우 해당 위치로의 드롭이 금지되고, UI 상에서 드롭 위치 표시 등이 업데이트되지 않음
   * - 반환값이 true이거나 undefined인 경우 해당 위치로의 드롭이 허용되고, UI 업데이트 등이 정상적으로 진행됨
   */
  dragOver?: (params: RowMoveEventParams) => boolean | void;

  /**
   * 드롭 완료 이벤트
   * @param params.moveItems 이동하는 row 데이터 배열
   * @param params.dropItemIdx 드롭된 위치의 row index
   * @param params.position 드랍 위치
   * @returns 드롭 허용 여부 (false 반환 시 드롭 동작 취소)
   * - 드롭이 완료된 후에 해당 드롭 동작을 최종적으로 허용할지 여부를 결정하는 콜백 함수
   * - 예: 특정 조건에서는 드롭을 취소하도록 설정 가능
   * - 반환값이 false인 경우 해당 드롭 동작이 취소되고, row는 원래 위치로 돌아감
   * - 반환값이 true이거나 undefined인 경우 드롭이 정상적으로 완료되고, row는 새로운 위치에 남게 됨
   */
  drop?: (params: RowMoveEventParams) => boolean | void;

  /**
   * 드래그 종료 이벤트
   * @param params.moveItems 이동하는 row 데이터 배열
   * @param params.dropItemIdx 드롭된 위치의 row index (drop이 취소된 경우에도 마지막 드롭 위치)
   * @param params.position 드랍 위치
   * @returns void
   * - 드래그가 종료된 후에 호출되는 콜백 함수로, 드롭 성공 여부와 관계없이 항상 호출됨
   * - 예: 드래그 종료 시점에 리소스 정리, 상태 초기화 등의 작업 수행 가능
   */
  dragEnd?: (params: RowMoveEventParams) => boolean | void;

  dragTemplate?: OptionCallback;
}
