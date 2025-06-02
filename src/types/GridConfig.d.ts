import { OptionCallback, AnyKeyMap, StringKeyMap, Map } from "./Common";
import FieldInfoMap from "../FieldInfoMap";
import { FieldItem } from "./GridField";
import DaraElement from "src/element/DaraElement";
import { PagingInfo } from "./PagingInfo";
import { PagingOptions } from "./GridOptions";

/**
 * grid config info
 */
export interface Config {
  dimensions: {
    // grid total width
    width: number;
    // grid total height
    height: number;
    // toolbar height
    toolbarHeight: number;
    // footer height
    footerHeight: number;
    // main inside  width
    mainInsideWidth: number;
    // main element height
    mainHeight: number;

    mainHeaderHeight: number;
    mainBodyHeight: number;
    mainSummaryHeight: number;

    // main left panel width
    mainLeftWidth: number;
    // main center panel width
    mainCenterWidth: number;
    // main right panel width
    mainRightWidth: number;
    // grid total width
    mainTotalWidth: number;

    // center over width;
    mainCenterOverWidth: number;

    // center view width;
    mainCenterViewWidth: number;
  };
  allColumnMap: {
    [key: string]: FieldItem;
  };

  currentFields: FieldItem[];

  isCellEdit: boolean;

  searchEnable: boolean;
  fieldHeaderGroup: FieldHeaderGroupInfo;
  footer: { height: number; width: number };
  navi: { height: number; width: number };
  toolbar: { height: number; width: number };
  initSettingFlag: boolean;
  select: AnyKeyMap;
  template: AnyKeyMap;
  orginItems: Array;
  items: Array;
  dataInfo: {
    colLength: number;
    rowLength: number;
    lastRow: number;
    orginLeafHeaders: Array;
    orginLeafHeaderKeyMap: AnyKeyMap;
    asideLength: number;
  };
  cellWidths: Array;
  rowHeights: Array;
  sort: {
    orders: Array;
  };
  paging: PagingOptions;
  selection: Selection;
  searchOn: boolean;
  isHeaderResize: boolean;
  focus: boolean;
  isBodyDragging: boolean;
  isHeaderDragging: boolean;
  mouseEnter: boolean;
  currentClickInfo: AnyKeyMap;
  allCheck: boolean;
  settingConfig: {
    viewInitFlag: boolean;
    filterTemplate: string;
    filterOperatorTemplate: AnyKeyMap; // filter html template
    searchCheckItem: boolean; // 검색 정규식
    filterCheckItem: boolean; // filter info {checkFn; check condition}
  };
  fixedLeftIndex: number;
  fixedRightIndex: number;
  scroll: ScrollInfo;
  element: GridElement;
  edit: EditInfo;
}

export interface CellInfo {
  /**
   * view row index
   */
  r: number;
  /**
   * view column index
   */
  c: number;
  /**
   * row index
   */
  rowIndex: number;
  /**
   * field info
   */
  field: FieldItem;
  /**
   * item
   */
  item: any;
}

export interface EditInfo {
  enable: boolean;
  cell: CellInfo;
}

export interface Selection {
  /**
   * selection id
   */
  id: string;
  /**
   * mode
   */
  mode: string;

  /**
   * 현재 설정 range
   */
  range: SelectionRange;
  /**
   * 모든 선택 영역 정보
   */
  allRange: {
    [key: string]: SelectionRange;
  };
  /**
   * 선택여부
   */
  isSelect: boolean;
  /**
   * 마우스 다운여부
   */
  isMouseDown: boolean;
  /**
   * 취소 영역
   */
  unSelectPosition: {
    [key: string]: string;
  };
  /**
   * 전체 선택 여부
   */
  all: boolean;

  minIdx: number;
  maxIdx: number;
  minCol: number;
  maxCol: number;
  /**
   * 시작 위치 값
   */
  startCell: { startIdx: number; startCol: number };
}

export interface SelectionRange {
  _key: string;
  /**
   *
   */
  mode?: "" | "add" | "remove";
  startIdx: number;
  endIdx: number;
  startCol: number;
  endCol: number;
  minIdx: number;
  maxIdx: number;
  minCol: number;
  maxCol: number;
}

export interface ScrollInfo {
  /**
   * 스크롤 데이터 초기화
   */

  enableVertical: boolean;
  enableHorizontal: boolean;
  centerLeftPosition: number;
  before: {
    viewRow: number;
    startCol: number;
    endCol: number;
    hideLastRow: boolean;
  };
  top: number;
  left: number;
  startCol: number;
  endCol: number;
  insideStartCol: number;
  insideEndCol: number;

  // grid 보여지는 row 수
  viewRow: number;
  // 화면에 완전하게 보여지는 row 수
  insideViewRow: number;
  // 시작 start row
  startIdx: number;

  vHeight: number;
  vBarPosition: number;
  vThumbHeight: number;
  vTrackHeight: number;

  hWidth: number;
  hBarPosition: number;
  hThumbWidth: number;
  hTrackWidth: number;

  oneColMove: number;
  oneRowMove: number;
  verticalScrollTimer: any;
  horizontalScrollTimer: any;
  mouseDown: boolean;
}

// element 처리할것.
export interface GridElement {
  grid?: DaraElement;
  container?: DaraElement;
  toolbar?: DaraElement;
  main?: DaraElement;

  // main header
  mainHeaderLeft?: DaraElement;
  mainHeaderCenter?: DaraElement;
  mainHeaderRight?: DaraElement;

  // main body
  mainBodyLeft?: DaraElement;
  mainBodyCenter?: DaraElement;
  mainBodyRight?: DaraElement;

  // main summary
  mainSummaryLeft?: DaraElement;
  mainSummaryBody?: DaraElement;
  mainSummaryRight?: DaraElement;

  footer?: DaraElement;

  status?: DaraElement;

  hScrollBar?: DaraElement;
  vScrollBar?: DaraElement;

  hScrollEdge?: DaraElement;
  resizeHelper?: DaraElement;

  pasteArea?: DaraElement;

  // measure element
  measureEl?: DaraElement;
}

/**
 * field header group
 *
 * @export
 * @interface FieldHeaderGroupInfo
 * @typedef {FieldHeaderGroupInfo}
 */
export interface FieldHeaderGroupInfo {
  left: FieldItem[][];
  center: FieldItem[][];
  right: FieldItem[][];
  leaf: FieldItem[];

  leafLeft: FieldItem[];
  leafCenter: FieldItem[];
  leafRight: FieldItem[];
  heights: number[];
  depth: number;
}
