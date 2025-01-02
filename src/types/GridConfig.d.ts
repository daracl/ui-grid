import { OptionCallback } from "./Common";
import { AnyKeyMap, StringKeyMap, Map } from "./DataMap";

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
}
