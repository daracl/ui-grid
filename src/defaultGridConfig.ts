import { Config, Selection } from "./types/GridConfig";

/**
 * grid default config
 */
export const initConfig = (): Config => {
  return {
    gridWidth: { aside: 0, left: 0, main: 0, total: 0, mainOverWidth: 0, mainInsideWidth: 0 },
    allColumnMap: {},
    container: { height: 0, width: 0, bodyHeight: 0 },
    searchEnable: false,
    header: { height: 0, width: 0 },
    footer: { height: 0, width: 0 },
    navi: { height: 0, width: 0 },
    toolbar: { height: 0, width: 0 },
    initSettingFlag: false,
    aside: { items: [], lineNumberCharLength: 0, initWidth: 0 },
    select: {},
    template: {},
    orginData: [],
    dataInfo: { colLen: 0, rowLen: 0, lastRowIdx: 0, orginLeafHeaders: [], orginLeafHeaderKeyMap: {} },
    rowOpt: {},
    sort: { orginData: [], sortMap: new Map() },
    pagingInfo: false,
    selection: {
      startCell: {},
    },
    searchOn: false,
    isResize: false,
    focus: false,
    isBodyDragging: false,
    mouseEnter: false,
    currentClickInfo: {},
    allCheck: false,
    currentHeaderResizeFlag: true,
    initHeaderResizer: false,
    settingConfig: {
      viewInitFlag: true,
      filterTemplate: "",
      filterOperatorTemplate: {}, // filter html template
      searchCheckItem: false, // 검색 정규식
      filterCheckItem: false, // filter info {checkFn, check condition}
    },
    fixedHeaderIndex: -1,
    scroll: {
      containerLeft: 0,
      before: {},
      top: 0,
      left: 0,
      startCol: 0,
      endCol: 0,
      viewIdx: 0,
      vBarPosition: 0,
      hBarPosition: 0,
      maxViewCount: 0,
      viewCount: 0,
      vTrackHeight: 0,
      hTrackWidth: 0,
      verticalScrollTimer: -1,
      horizontalScrollTimer: -1,
      mouseDown: false,
    },
  };
};

/**
 * 선택영역 설정 정보
 *
 * @returns {Selection} 선택 영역 정보
 */
export const initSelectionInfo = (): Selection => {
  return {
    curr: "",
    range: { _key: "", startIdx: -1, endIdx: -1, startCol: -1, endCol: -1 },
    allRange: {},
    isSelect: false,
    isMouseDown: false,
    unSelectPosition: {},
    allSelect: false,
    minIdx: -1,
    maxIdx: -1,
    minCol: -1,
    maxCol: -1,
    startCell: { startIdx: -1, startCol: -1 },
  };
};
