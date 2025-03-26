import { OptionCallback, AnyKeyMap, StringKeyMap, Map } from "./Common";
import FieldInfoMap from "../FieldInfoMap";
import { FieldItem } from "./GridField";
import DaraElement from "src/element/DaraElement";

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
    // main
    mainWidth: number;
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
    totalWidth: number;

    mainOverWidth: number;
    mainInsideWidth: number;
  };
  allColumnMap: {
    [key: string]: FieldItem;
  };

  currentFields: FieldItem[];

  searchEnable: boolean;
  fieldHeaderGroup: FieldHeaderGroupInfo;
  footer: { height: number; width: number };
  navi: { height: number; width: number };
  toolbar: { height: number; width: number };
  initSettingFlag: boolean;
  select: AnyKeyMap;
  template: AnyKeyMap;
  items: Array;
  dataInfo: {
    colLength: number;
    rowLength: number;
    lastRow: number;
    orginLeafHeaders: Array;
    orginLeafHeaderKeyMap: AnyKeyMap;
  };
  rowOpt: AnyKeyMap;
  sort: {
    orginData: Array;
    sortMap: Map;
  };
  pagingInfo: boolean;
  selection: {
    startCell: AnyKeyMap;
  };
  searchOn: boolean;
  isResize: boolean;
  focus: boolean;
  isBodyDragging: boolean;
  mouseEnter: boolean;
  currentClickInfo: AnyKeyMap;
  allCheck: boolean;
  currentHeaderResizeFlag: boolean;
  initHeaderResizer: boolean;
  settingConfig: {
    viewInitFlag: boolean;
    filterTemplate: string;
    filterOperatorTemplate: AnyKeyMap; // filter html template
    searchCheckItem: boolean; // 검색 정규식
    filterCheckItem: boolean; // filter info {checkFn; check condition}
  };
  fixedLeftIndex: number;
  fixedRightIndex: number;
  scroll: Scroll;
  element: GridElement;
}

export interface Selection {
  /**
   * 현재 위치
   */
  id: string;

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
  allSelect: boolean;

  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
  /**
   * 시작 위치 값
   */
  startCell: { startRow: number; startCol: number };
}

export interface SelectionRange {
  _key: string;
  /**
   *
   */
  mode?: "" | "add" | "remove";
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
}

export interface Scroll {
  /**
   * 스크롤 데이터 초기화
   */

  enableVertical: boolean;
  enableHorizontal: boolean;
  containerLeft: number;
  before: any;
  top: number;
  left: number;
  startCol: number;
  endCol: number;
  insideStartCol: number;
  insideEndCol: number;
  viewRow: number;
  vBarPosition: number;
  hBarPosition: number;

  vTrackHeight: number;
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
