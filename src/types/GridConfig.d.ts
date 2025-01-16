import { OptionCallback, AnyKeyMap, StringKeyMap, Map } from "./Common";
import FieldInfoMap from "../FieldInfoMap";
import { FieldItem } from "./GridField";

/**
 * grid config info
 */
export interface Config {
  gridWidth: {
    aside: number;
    left: number;
    main: number;
    total: number;
    mainOverWidth: number;
    mainInsideWidth: number;
  };
  allColumnMap: {
    [key: string]: FieldItem;
  };

  currentHeaderItems: FieldItem[];
  container: {
    height: number;
    width: number;
    bodyHeight: number;
  };
  searchEnable: boolean;
  header: {
    height: number;
    width: number;
  };
  footer: { height: number; width: number };
  navi: { height: number; width: number };
  toolbar: { height: number; width: number };
  initSettingFlag: boolean;
  aside: {
    items: Array;
    lineNumberCharLength: number;
    initWidth: number;
  };
  select: AnyKeyMap;
  template: AnyKeyMap;
  items: Array;
  dataInfo: {
    colLen: number;
    rowLen: number;
    lastRow: number;
    orginLeafHeaders: Array;
    orginLeafHeaderKeyMap: AnyKeyMap;
  };
  rowHeight: number;
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
  fixedHeaderIndex: number;
  scroll: Scroll;
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
  maxViewCount: number;
  viewCount: number;
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
  grid: HTMLElement;
  hidden: HTMLElement;
  container: HTMLElement;
  toolbar: HTMLElement;
  left: HTMLElement;
  header: HTMLElement;
  body: HTMLElement;
  footer: HTMLElement;
  navi: HTMLElement;
  navSelectionInfo: HTMLElement;

  status: HTMLElement;

  hScrollBar: HTMLElement;
  vScrollBar: HTMLElement;

  hScrollEdge: HTMLElement;
  resizeHelper: HTMLElement;
  asideContent: HTMLElement[][];
  leftContent: HTMLElement[][];
  bodyContent: HTMLElement[][];

  pasteArea: HTMLElement;

  // measure element
  measureEl: HTMLElement;
}
