import { OptionCallback } from "./Common";
import { AnyKeyMap, StringKeyMap, Map } from "./DataMap";
import FieldInfoMap from "../FieldInfoMap";
import { FieldItem } from "./GridField";

export interface AllColumnMap {
  [key: string]: FieldItem;
}

/**
 * grid config info
 */
export interface GridConfig {
  gridWidth: {
    aside: number;
    left: number;
    main: number;
    total: number;
    mainOverWidth: number;
    mainInsideWidth: number;
  };
  allColumnMap: AllColumnMap;
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
