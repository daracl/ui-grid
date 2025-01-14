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
  orginData: Array;
  dataInfo: {
    colLen: number;
    rowLen: number;
    lastRowIdx: number;
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
  fixedHeaderIndex: number;
  scroll: {
    /**
     * 스크롤 데이터 초기화
     */
    containerLeft: number;
    before: any;
    top: number;
    left: number;
    startCol: number;
    endCol: number;
    viewIdx: number;
    vBarPosition: number;
    hBarPosition: number;
    maxViewCount: number;
    viewCount: number;
    vTrackHeight: number;
    hTrackWidth: number;
    verticalScrollTimer: number;
    horizontalScrollTimer: number;
    mouseDown: boolean;
  };
}

export interface Selection {
  /**
   * 현재 위치
   */
  curr: string | number;

  /**
   * 현재 설정 range
   */
  range: SelectionRange;
  /**
   * 모든 선택 영역 정보
   */
  allRange: {
    [key: string | number]: SelectionRange;
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
  unSelectPosition: {};
  /**
   * 전체 선택 여부
   */
  allSelect: boolean;

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
  mode: string;
  startIdx: number;
  endIdx: number;
  startCol: number;
  endCol: number;
  minIdx: number;
  maxIdx: number;
  minCol: number;
  maxCol: number;
}
