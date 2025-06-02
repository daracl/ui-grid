import { GridOptions, PagingOptions } from "@t/GridOptions";
import { Config, EditInfo, FieldHeaderGroupInfo, ScrollInfo, Selection } from "./types/GridConfig";
import { FieldItem } from "@t/GridField";
import { PagingInfo } from "@t/PagingInfo";
import { isPlainObject } from "./util/utils";

/**
 * 
 * 
    mainHeaderHeight: number;
    mainBodyHeight: number;
    mainSummaryHeight: number;


 * grid default config
 */
export const initConfig = (opts: GridOptions): Config => {
  const pagingInfo = (isPlainObject(opts.paging) ? opts.paging : {}) as PagingOptions;

  return {
    dimensions: {
      width: 0,
      height: 0,
      toolbarHeight: 0,
      footerHeight: 0,
      mainInsideWidth: 0,
      mainHeaderHeight: 0,
      mainBodyHeight: 0,
      mainSummaryHeight: 0,
      mainHeight: 0,
      mainLeftWidth: 0,
      mainCenterWidth: 0,
      mainRightWidth: 0,
      mainTotalWidth: 0,
      mainCenterOverWidth: 0,
      mainCenterViewWidth: 0,
    },
    isCellEdit: false,
    allColumnMap: {},
    searchEnable: false,
    fieldHeaderGroup: defaultFieldGroupInfo(),
    footer: { height: 0, width: 0 },
    navi: { height: 0, width: 0 },
    toolbar: { height: 0, width: 0 },
    initSettingFlag: false,
    select: {},
    template: {},
    items: [],
    orginItems: [],
    isHeaderResize: false,
    currentFields: [],
    dataInfo: { colLength: 0, rowLength: 0, asideLength: 0, lastRow: 0, orginLeafHeaders: [], orginLeafHeaderKeyMap: {} },
    cellWidths: [],
    rowHeights: [],
    sort: { orders: [] },
    paging: pagingInfo,
    selection: {} as Selection,
    searchOn: false,
    focus: false,
    isBodyDragging: false,
    isHeaderDragging: false,
    mouseEnter: false,
    currentClickInfo: {},
    allCheck: false,
    settingConfig: {
      viewInitFlag: true,
      filterTemplate: "",
      filterOperatorTemplate: {}, // filter html template
      searchCheckItem: false, // 검색 정규식
      filterCheckItem: false, // filter info {checkFn, check condition}
    },
    fixedLeftIndex: opts.fixedLeftIndex > 0 ? opts.fixedLeftIndex : 0,
    fixedRightIndex: opts.fixedRightIndex > 0 ? opts.fixedRightIndex : 0,
    scroll: initScrollInfo(),
    edit: initEditInfo(),
    element: {
      grid: undefined,
      container: undefined,
      toolbar: undefined,
      main: undefined,

      // main header
      mainHeaderLeft: undefined,
      mainHeaderCenter: undefined,
      mainHeaderRight: undefined,

      // main body
      mainBodyLeft: undefined,
      mainBodyCenter: undefined,
      mainBodyRight: undefined,

      // main summary
      mainSummaryLeft: undefined,
      mainSummaryBody: undefined,
      mainSummaryRight: undefined,

      footer: undefined,

      status: undefined,

      hScrollBar: undefined,
      vScrollBar: undefined,

      hScrollEdge: undefined,

      resizeHelper: undefined,

      pasteArea: undefined,

      // measure element
      measureEl: undefined,
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
    id: "",
    mode: "0",
    range: {
      _key: "",
      mode: "",
      startIdx: -1,
      endIdx: -1,
      startCol: -1,
      endCol: -1,
      minIdx: -1,
      maxIdx: -1,
      minCol: -1,
      maxCol: -1,
    },
    allRange: {},
    isSelect: false,
    isMouseDown: false,
    unSelectPosition: {},
    all: false,
    minIdx: -1,
    maxIdx: -1,
    minCol: -1,
    maxCol: -1,
    startCell: { startIdx: -1, startCol: -1 },
  };
};

/**
 * scroll info
 *
 * @returns {ScrollInfo} scroll init info
 */
export const initScrollInfo = (): ScrollInfo => {
  return {
    centerLeftPosition: 0,
    before: {
      viewRow: 0,
      startCol: 0,
      endCol: 0,
      hideLastRow: false,
    },
    top: 0,
    left: 0,
    startCol: 0,
    endCol: 0,
    insideStartCol: 0,
    insideEndCol: 0,
    viewRow: 0,
    insideViewRow: 0,
    startIdx: 0,

    oneColMove: 0,
    oneRowMove: 0,
    vHeight: 0,
    vBarPosition: 0,
    vThumbHeight: 0,
    vTrackHeight: 0,

    hWidth: 0,
    hBarPosition: 0,
    hThumbWidth: 0,
    hTrackWidth: 0,
    enableVertical: false,
    enableHorizontal: false,
    verticalScrollTimer: -1,
    horizontalScrollTimer: -1,
    mouseDown: false,
  };
};

/**
 * field group info
 *
 * @export
 * @returns {FieldHeaderGroupInfo}
 */
export function defaultFieldGroupInfo(): FieldHeaderGroupInfo {
  return {
    left: [],
    center: [],
    right: [],
    leaf: [],
    leafLeft: [],
    leafCenter: [],
    leafRight: [],
    heights: [],
    depth: 1,
  };
}

/**
 * init edit info
 *
 * @export
 * @returns {EditInfo} editinfo
 */
export function initEditInfo(): EditInfo {
  return {
    enable: false,
    cell: {
      r: -1,
      c: -1,
      field: {} as FieldItem,
      item: {},
      rowIndex: -1,
    },
  };
}
