import { GridOptions, PagingParam } from '@t/GridOptions';
import { Config, EditInfo, FieldHeaderGroupInfo, ScrollInfo, Selection, SelectionRange } from './types/GridConfig';
import { FieldItem } from '@t/GridField';
import { isPlainObject } from '@/util/utils';
import { DataManager } from '@/service/DataManager';
import { ALL_SELECT_VALUE, ROW_ID_FIELD_NAME } from '@/constants';
import { EventManager } from '@/event/EventManager';

/**
 * 
 * 
    mainHeaderHeight: number;
    mainBodyHeight: number;
    mainSummaryHeight: number;


 * grid default config
 */
export function initConfig(opts: GridOptions): Config {
  const pagingInfo = (isPlainObject(opts.paging) ? opts.paging : {}) as PagingParam;

  let rowIdField = ROW_ID_FIELD_NAME;
  if (opts.rowIdField) {
    rowIdField = opts.rowIdField;
  } else if (opts.tree) {
    rowIdField = opts.tree.idField || 'id';
  }

  return {
    rowIdField: rowIdField,
    dataManager: {} as DataManager,
    eventManager: new EventManager(),
    theme: 'light',
    selectRowOnCellClick: opts.body?.row?.selectRowOnCellClick === true,
    enableHeaderHelpButton: opts.header?.help?.enabled,
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
    summary: {
      heights: [],
    },
    fontFamily: 'Noto Sans KR',
    fontSize: '12px',
    isCellEdit: false,
    isRowAllowMultiSelect: opts.aside?.rowCheckbox?.allowMultiSelect ?? true,
    searchEnable: false,
    searchParameter: {
      matchCase: false,
      matchWholeWord: false,
      useRegex: false,
      searchFields: ALL_SELECT_VALUE,
      searchText: '',
    },
    searchMatchInfo: {
      currentMatchIndex: -1,
      matchCount: -1,
      matchRowIndex: -1,
      itemIndex: -1,
      id: '',
    },
    fieldHeaderGroup: defaultFieldGroupInfo(),
    footer: { height: 0, width: 0 },
    navi: { height: 0, width: 0 },
    toolbar: { height: 0, width: 0 },
    initSettingFlag: false,
    template: {},
    isHeaderResize: false,
    isOpenLayer: false,
    currentFields: [],
    allFieldMap: new Map(),
    dataInfo: {
      colLength: 0,
      rowLength: 0,
      asideLength: 0,
      startCol: 0,
      lastRow: 0,
      orginLeafHeaders: [],
      orginLeafHeaderKeyMap: {},
    },
    cellWidths: [],
    rowHeight: Math.max(opts.body.row.height ?? 25, 25),
    enableSortButton: opts.header?.sort.enabled,
    sort: { orders: [] },
    paging: pagingInfo,
    selection: {} as Selection,
    focus: false,
    isMoveRow: false,
    isBodyDragging: false,
    isHeaderDragging: false,
    mouseEnter: false,
    currentClickInfo: {},
    allCheck: false,
    settingConfig: {
      viewInitFlag: true,
      filterTemplate: '',
      filterOperatorTemplate: {}, // filter html template
      searchCheckItem: false, // 검색 정규식
      filterCheckItem: false, // filter info {checkFn, check condition}
    },
    fixedLeftIndex: Math.max(opts.fixedLeftIndex, 0),
    fixedRightIndex: Math.max(opts.fixedRightIndex, 0),
    scroll: initScrollInfo(),
    edit: initEditInfo(),
    canvasContext: undefined,
    activeComponent: '',
  };
}

/**
 * 선택영역 설정 정보
 *
 * @returns {Selection} 선택 영역 정보
 */
export function initSelectionInfo(): Selection {
  return {
    id: '',
    range: initSelectionRange(),
    allRange: new Map<string, SelectionRange>(),
    isSelect: false,
    isMouseDown: false,
    all: false,
    minIdx: -1,
    maxIdx: -1,
    minCol: -1,
    maxCol: -1,
    startCell: { startIdx: -1, startCol: -1 },
  };
}

export function initSelectionRange(): SelectionRange {
  return {
    modifierKey: -1,
    type: 'cell',
    mode: '',
    startIdx: -1,
    endIdx: -1,
    startCol: -1,
    endCol: -1,
    minIdx: -1,
    maxIdx: -1,
    minCol: -1,
    maxCol: -1,
  };
}

/**
 * scroll info
 *
 * @returns {ScrollInfo} scroll init info
 */
export function initScrollInfo(): ScrollInfo {
  return {
    centerLeftPosition: 0,
    before: {
      startIdx: 0,
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
}

/**
 * field group info
 *
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
