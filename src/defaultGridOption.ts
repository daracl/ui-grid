import { FieldItem } from "@t/GridField";
import { GridOptions } from "@t/GridOptions";
import { EDIT_RENDERER, FOOTER_HEIGHT, TOOLBAR_HEIGHT, VIEW_RENDERER } from "./constants";

/**
 * grid default option
 */
export const DEFAULT_OPTIONS: GridOptions = {
  theme: "light", // 테마 값
  height: "auto", // 높이 값
  width: "auto", // 넓이값
  fixedLeftIndex: -1,
  fixedRightIndex: -1,
  styleClass: "default",
  enableWidthFixed: false, // 넓이 고정 여부.
  useDefaultFormatter: true, // 기본 포멧터 사용여부
  editable: false, // 편집 모드 활성화
  selectionMode: "multiple-cell", //cell 선택 모드 row, cell, multiple-row, multiple-cell
  enableTooltip: false, // tooltip flag
  addLimitRow: -1, // add시 item max로 유지할 카운트
  valueFilter: false, // value filter function (colItem, objectValue)
  dataTypeFormatter: {
    money: { prefix: "$", suffix: "원", fixed: 0 }, // money 설정 prefix : 앞에 붙일 문구 , suffix : 마지막에 붙일 문구 , fixed : 소수점
    number: { prefix: "", suffix: "", fixed: 0 }, // number 값 설정
  },
  autoResize: {
    //리사이즈 설정
    enabled: true, // auto resize 활성화 여부
    threshold: 50, // resize 반응 시간
  },
  header: {
    view: true, //  보기 여부
    height: 25, //  높이
    heights: [], // 그룹일 경우 높이 배열
    sort: {
      enabled: true,
      nullsLast: false, // null value 를 항상 끝으로 유지 할지 여부
      customSorting: (a, b, key, sortType) => {
        // custom sorting function
      },
    }, // 초기에 정렬할 값
    resize: {
      // resize 설정
      enabled: true, // 활성화여부
      update: false, // 변경시 콜랙 함수
      minWidth: 2, // 컬럼 최소 넓이
      maxWidth: 1500, // 컬럼 최대 넓이
    },
    enableAllColumnSelection: true, // 전체 선택 여부.
    enableScroll: true, // 마우스 휠로 가로 스크롤 이동할지 여부.
    charWidth: 7, // char 의 넓이값
    enableViewAllLabel: true,
    contextMenu: false, // header contextmenu event
    help: {
      //	header help btn 설정
      enabled: false, // header help btn 활성 여부.
      title: "", // tooltip
      click: (clickInfo: any) => {}, // click event
      dblclick: (clickInfo: any) => {}, // double click event
    },
    drag: {
      enabled: false, // 활성화여부
      dropSelector: "", // drop selector
      dropCallback: (colItem: any) => {
        // drop 전에 이벤트
        return true;
      },
    },
  },
  finder: {
    // 그리드 설정
    mode: "simple", // simple (search , fixed) , full(column config , filter)
    enabled: false, // 활성여부
    enableColumnFix: false, // 고정 컬럼 활성여부
    click: false, // 직접 처리 할경우. function 으로 처리.
    onlyCloseButton: false, // button 으로만 닫기 여부
    useRememberValue: false, // 검색어 local storage에 저장 여부
    width: "auto",
    height: "auto",
    callback: false,
    rememberValue: {
      field: "",
      keyword: "",
    },
    util: {
      isTypeNumber: (hederInfo: any): boolean => {
        return hederInfo.type == "number";
      },
    },
  },
  toolbar: {
    enabled: false,
    position: "right", // left, center, right
    height: TOOLBAR_HEIGHT,
    items: [],
  },
  aside: {
    // aside 옵션
    lineNumber: {
      // 번호
      enabled: true, // 활성화 여부
      label: "", //  컬럼명
      order: 0, // 순서
      width: 40, // 넓이
      enableRowSelection: true, // 선택 여부
    },
    rowCheckbox: {
      // 체크 박스
      enabled: false, // 활성화 여부
      label: "V", // name
      width: 25, // 넓이값
      order: 1,
      click: (rowInfo: any) => {
        // click event , return false 일경우 체크 안함.
      },
    },
    modifyInfo: {
      // 수정 여부
      enabled: false, // 활성화 여부
      order: 3,
      label: "modify", // name
      width: 10, // 넓이값
    },
  },
  body: {
    // body option
    cellDblClick: false, // body td click
    keyNavHandler: false, // arrows key handler function
    pasteBefore: false, // 붙여 넣기 전 호출 메소드
    pasteAfter: false, // 붙여 넣기 후 호출 메소드
    row: {
      // 로우 옵션.
      height: 22, // cell 높이
      click: false, //row(tr) click event
      contextMenu: false, // row(tr) contextmenu event
      addStyle: false, // 추가할 style method
      dblClick: false, // row dblclick event
      dblClickCheck: false, // double click row checkbox checked true 여부.
    },
  },
  summary: { items: [] },
  scroll: {
    // 스크롤 옵션
    enableStopPropagation: false, // 이벤트 전파 여부.
    width: 14, // 세로 스크롤
    vertical: {
      enable: true,
      speed: 3, // 스크롤 스피드 row 1
      onUpdate: (item) => {
        // 스크롤 업데이트.
        return true;
      },
      enableTooltip: false, // item count tooltip
    },
    horizontal: {
      enable: true,
      speed: 1, // 스크롤 스피드
      enableWheel: false, //  wheel 로 스크롤 이동.
      onUpdate: false,
    },
  },
  fields: [], //head item
  items: [], // body item
  footer: {
    enabled: false, // 페이지 사용여부
    enablePaging: false,
    pagingFormat: "{{currStart}} - {{currEnd}} of {{total}}",
    height: FOOTER_HEIGHT, // 높이 값
    position: ["selection", "paing", "status"], // 위치 값
    callback: false, // 페이지 콜백
    enableSelectionInfo: false,
    selectionFormat: "Count : {{count}} {{if(enableSummary)}} Avg : {{avg}} Min : {{min}} Max : {{max}} Sum : {{sum}}{{/if}}",
  },
  paging: false, // paging info
  i18n: {
    empty: "no data",
    "search.label": "설정",
    "search.button": "Search",
    "setting.speed.label": "스크롤속도",
    "setting.column.fixed.label": "고정컬럼",
    "setting.column.fixed.notused": "사용안함",
  },
  icon: {
    sortup: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="50,0 0,100 100,100" fill="#737171"></polygon></g></svg>',
    sortdown: '<svg width="8px" height="8px" viewBox="0 0 110 110" style="enable-background:new 0 0 100 100;"><g><polygon points="0,0 100,0 50,90" fill="#737171"></polygon></g></svg>',
  },
  operators: {}, // setting condition operator
};

export const DEFAULT_FIELD_INFO: FieldItem = {
  name: "",
  label: "",
  width: 0,
  colspan: 0,
  rowspan: 0,
  hidden: false,
  sort: false,
  align: "center",
  renderer: {
    type: "text",
  },
  formatter: undefined,
  defaultValue: "",
  click: undefined,
  styleClass: undefined,
  tooltip: {
    show: false,
    formatter: undefined,
  },
  $renderer: VIEW_RENDERER["text"],
  $editRenderer: EDIT_RENDERER["text"],
  $colspan: 0,
  $rowspan: 0,
  $depth: 0,
  $isLeaf: false,
  $childLength: 0,
  $resizeIdx: 0,
  $width: 0,
  $alignStyle: "",
  $isAside: false,
  $panel: "center",
  $uid: "",
};
