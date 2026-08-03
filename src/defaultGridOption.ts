import { EditRendererInfo, ViewRendererInfo } from '@/types/RendererInfo';
import { FieldItem } from '@t/GridField';
import { GridOptions } from '@t/GridOptions';
import { EDIT_RENDERER, VIEW_RENDERER } from './constantRenders';
import { FOOTER_HEIGHT, SelectionModeMap, TOOLBAR_HEIGHT } from './constants';
import { BODY_STYLE } from './constantStyles';
import { ToolbarFieldItem } from './types/Toolbar';

/**
 * Grid 생성 시 사용되는 기본 옵션 객체
 * 사용자가 전달한 옵션은 이 객체와 병합
 *
 * @type {GridOptions}
 */
export const DEFAULT_OPTIONS: GridOptions = {
  /**
   * 행을 구분하기 위한 고유 ID 필드명
   */
  rowIdField: '',

  /**
   * 그리드 테마
   *
   * @default 'light'
   */
  theme: 'light',

  /**
   * 그리드 높이
   *
   * `auto`, 숫자(px), CSS 크기
   *
   * @default 'auto'
   */
  height: 'auto',

  /**
   * 그리드 너비
   *
   * `auto`, 숫자(px), CSS 크기
   *
   * @default 'auto'
   */
  width: 'auto',

  /**
   * 브라우저 리사이즈 이벤트 처리 지연 시간(ms)
   *
   * @default 50
   */
  windowResizeDelay: 50,

  /**
   * 왼쪽 고정 컬럼의 마지막 인덱스
   *
   * `-1`이면 고정 컬럼을 사용하지 않음
   */
  fixedLeftIndex: -1,

  /**
   * 오른쪽 고정 컬럼의 시작 인덱스
   *
   * `-1`이면 고정 컬럼을 사용하지 않음
   */
  fixedRightIndex: -1,

  /**
   * 그리드 스타일 프리셋
   */
  style: BODY_STYLE.default,

  /**
   * 컬럼 너비를 고정할지 여부
   */
  enableWidthFixed: false,

  /**
   * 데이터 타입별 기본 포맷터 사용 여부
   */
  useDefaultFormatter: true,

  /**
   * 셀 편집 기능 활성화 여부
   */
  editable: false,

  /**
   * 선택 모드
   *
   * - row
   * - cell
   * - multiRow
   * - multiCell
   */
  selectionMode: SelectionModeMap.row,

  /**
   * hover mode
   * cell, row, none
   */
  hoverMode: 'cell',

  /**
   * 툴팁 사용 여부
   */
  enableTooltip: false,

  /**
   * 추가 시 유지할 최대 행 개수
   *
   * `-1`이면 제한이 없습니다.
   */
  addLimitRow: -1,

  /**
   * 값 필터 함수 사용 여부
   */
  valueFilter: false,

  /**
   * 데이터 타입별 기본 포맷터 설정
   */
  dataTypeFormatter: {
    /**
     * 금액 포맷 설정
     */
    money: {
      /**
       * 앞에 붙는 문자열
       */
      prefix: '$',

      /**
       * 뒤에 붙는 문자열
       */
      suffix: '원',

      /**
       * 소수점 자리수
       */
      fixed: 0,
    },

    /**
     * 숫자 포맷 설정
     */
    number: {
      prefix: '',
      suffix: '',
      fixed: 0,
    },
  },

  /**
   * 헤더 영역 설정
   */
  header: {
    /**
     * 헤더 표시 여부
     */
    view: true,

    /**
     * 헤더 높이(px)
     */
    height: 28,

    /**
     * 정렬 설정
     */
    sort: {
      /**
       * 정렬 기능 활성화 여부
       */
      enabled: true,

      /**
       * null 값을 항상 마지막에 배치할지 여부
       */
      nullsLast: false,

      /**
       * 사용자 정의 정렬 함수
       */
      customSorting: undefined,
    },

    /**
     * 컬럼 리사이즈 설정
     */
    resize: {
      /**
       * 리사이즈 활성화 여부
       */
      enabled: true,

      /**
       * 리사이즈 중 즉시 너비를 적용할지 여부
       */
      update: false,

      /**
       * 최소 컬럼 너비(px)
       */
      minWidth: 2,

      /**
       * 최대 컬럼 너비(px)
       */
      maxWidth: 1500,
    },

    /**
     * 전체 컬럼 선택 기능 사용 여부
     */
    enableAllColumnSelection: true,

    /**
     * 마우스 휠로 가로 스크롤 이동 여부
     */
    enableScroll: true,

    /**
     * 모든 라벨 표시 여부
     */
    enableViewAllLabel: false,

    /**
     * 헤더 도움말 버튼 설정
     */
    help: {
      /**
       * 도움말 버튼 활성화 여부
       */
      enabled: false,

      /**
       * 도움말 내용
       */
      content: '',

      /**
       * 클릭 이벤트 콜백
       */
      click: undefined,

      /**
       * 툴팁 표시 지연 시간(ms)
       */
      showDelay: 300,
    },

    /**
     * 컬럼 드래그 설정
     */
    drag: {
      /**
       * 드래그 기능 활성화 여부
       */
      enabled: false,

      /**
       * 드롭 대상 셀렉터
       */
      dropSelector: '',

      /**
       * 드롭 전에 호출되는 콜백
       *
       * `false`를 반환하면 드롭을 취소
       */
      dropCallback: (colItem: any) => true,
    },
  },

  /**
   * 검색 영역 설정
   */
  search: {
    /**
     * 검색 기능 활성화 여부
     */
    enabled: false,

    /**
     * 검색 UI 모드
     *
     * - simple
     * - full
     */
    mode: 'simple',

    /**
     * 검색 처리를 외부에서 직접 수행할지 여부
     */
    click: false,

    /**
     * 닫기 버튼만 표시할지 여부
     */
    onlyCloseButton: false,

    /**
     * 검색어를 로컬 스토리지에 저장할지 여부
     */
    useRememberValue: false,

    /**
     * 검색 영역 너비(px)
     */
    width: 250,

    /**
     * 검색 영역 높이(px)
     */
    height: 30,

    callback: false,

    rememberValue: {
      field: '',
      keyword: '',
    },
  },

  /**
   * 툴바 설정
   */
  toolbar: {
    enabled: false,

    /**
     * 툴바 위치
     *
     * - left
     * - center
     * - right
     */
    position: 'right',

    height: TOOLBAR_HEIGHT,

    /**
     * 툴바 아이템 목록
     */
    items: [],
  },

  /**
   * 왼쪽 보조 영역 설정
   */
  aside: {
    /**
     * 라인 번호 컬럼 설정
     */
    lineNumber: {
      enabled: true,
      label: '',
      order: 0,
      width: 40,
    },

    /**
     * 행 체크박스 컬럼 설정
     */
    rowCheckbox: {
      enabled: false,

      /**
       * 다중 선택 허용 여부
       */
      allowMultiSelect: true,

      width: 25,

      order: 1,

      /**
       * 체크박스 클릭 시 호출
       *
       * `false`를 반환하면 체크되지 않음
       */
      click: (rowInfo: any) => {
        // click event , return false 일경우 체크 안함.
      },
    },

    /**
     * 수정 여부 표시 컬럼 설정
     */
    modifyInfo: {
      enabled: false,
      order: 3,
      label: '',
      width: 20,
    },
  },

  /**
   * 본문(body) 영역 설정
   */
  body: {
    /**
     * 셀 더블클릭 이벤트 핸들러
     */
    cellDblClick: undefined,

    /**
     * 셀 클릭 이벤트 핸들러
     */
    cellClick: undefined,

    /**
     * 방향키 이동 핸들러
     */
    keyNavHandler: undefined,

    /**
     * 붙여넣기 전 호출되는 콜백
     */
    pasteBefore: undefined,

    /**
     * 붙여넣기 후 호출되는 콜백
     */
    pasteAfter: undefined,

    /**
     * 행(row) 설정
     */
    row: {
      /**
       * 행 높이(px)
       */
      height: 26,

      /**
       * 추가 스타일 함수 사용 여부
       */
      addStyle: false,

      /**
       * 행 더블클릭 이벤트 사용 여부
       */
      dblClick: false,

      /**
       * 셀 클릭 시 행 선택 여부
       */
      selectRowOnCellClick: false,
    },

    /**
     * 행 이동(Drag & Drop) 설정
     */
    rowMove: {
      /**
       * 행 이동 기능 활성화 여부
       */
      enabled: false,

      /**
       * 드래그 핸들  field name
       *
       */
      dragHandle: undefined,

      /**
       * 트리 구조에서 부모 변경 허용 여부
       */
      allowChangeParent: false,

      /**
       * 드래그 가능 여부를 결정하는 함수
       */
      draggable: undefined,

      dragStart: undefined,
      dragOver: undefined,
      drop: undefined,
      dragEnd: undefined,

      /**
       * 드래그 중 표시할 템플릿
       */
      dragTemplate: undefined,
    },
  },

  /**
   * 요약 영역 설정
   */
  summary: {
    height: 28,
    position: 'bottom',
    items: [],
  },

  /**
   * 스크롤 설정
   */
  scroll: {
    /**
     * 그리드 내부에서만 휠 스크롤을 사용할지 여부
     */
    enableWheelInContainer: false,

    /**
     * 세로 스크롤바 너비(px)
     */
    width: 12,

    /**
     * 세로 스크롤 설정
     */
    vertical: {
      enable: true,

      /**
       * 스크롤 속도(행 단위)
       */
      speed: 3,

      /**
       * 스크롤 위치 변경 시 호출
       */
      onUpdate: () => true,

      /**
       * 아이템 수 툴팁 표시 여부
       */
      enableTooltip: false,
    },

    /**
     * 가로 스크롤 설정
     */
    horizontal: {
      enable: true,

      /**
       * 스크롤 속도
       */
      speed: 1,

      /**
       * 마우스 휠로 가로 스크롤 이동 여부
       */
      enableWheel: false,

      onUpdate: false,
    },
  },

  /**
   * 컬럼 정의 목록
   */
  fields: [],

  /**
   * 그리드 데이터 목록
   */
  items: [],

  /**
   * 푸터 영역 설정
   */
  footer: {
    enabled: false,
    height: FOOTER_HEIGHT,

    /**
     * 페이징 표시 설정
     */
    paging: {
      enabled: false,
      position: 'center',
      formatPosition: 'right',
      format: '{{start}} - {{end}} of {{total}}',
    },

    /**
     * 선택 정보 표시 설정
     */
    selection: {
      position: 'left',
      format: 'Count : {{count}} {{if(enableSummary)}} Avg : {{avg}} Min : {{min}} Max : {{max}} Sum : {{sum}}{{/if}}',
    },
  },

  /**
   * 페이징 정보
   */
  paging: {
    totalCount: 0,
    currPage: 1,
    countPerPage: 10,
    unitPage: 5,
  },

  /**
   * 다국어 리소스
   */
  i18n: {
    empty: 'no data',
    'search.label': 'Find',
    'search.button': 'Search',
    'setting.speed.label': 'Scroll Speed',
    'setting.column.fixed.label': 'Fixed Column',
    'setting.column.fixed.notused': 'Not Used',
  },

  /**
   * 사용자 정의 연산자 목록
   */
  operators: {},

  /**
   * 트리 설정
   *
   * `undefined`이면 트리 모드를 사용하지 않음
   */
  tree: undefined,
};

export const DEFAULT_RENDERER_INFO: ViewRendererInfo = {
  type: 'text',
};

export const DEFAULT_EDIT_RENDERER_INFO: EditRendererInfo = {
  type: 'text',
  trueValue: true,
  falseValue: false,
  showLabel: false,
};

export const DEFAULT_TOOLBAR_FIELD_INFO: ToolbarFieldItem = {
  name: '',
  label: '',
  width: 0,
  renderer: {
    type: 'text',
    trueValue: true,
    falseValue: false,
  },
  $renderer: EDIT_RENDERER['text'],
  $uid: '',
  $width: 0,
};

export const DEFAULT_FIELD_INFO: FieldItem = {
  name: '',
  label: '',
  width: 0,
  colspan: 0,
  rowspan: 0,
  hidden: false,
  sort: false,
  editable: true,
  align: 'center',
  renderer: {
    type: 'text',
  },
  displayFormat: undefined,
  defaultValue: '',
  cellClassName: undefined,
  tooltip: {
    enabled: false,
    content: undefined,
  },
  headerHelp: undefined,
  editRenderer: {
    type: 'text',
    trueValue: true,
    falseValue: false,
    showLabel: false,
  },
  $renderer: VIEW_RENDERER['text'],
  $editRenderer: EDIT_RENDERER['text'],
  $colspan: 0,
  $rowspan: 0,
  $depth: 0,
  $isLeaf: false,
  $childLength: 0,
  $resizeIdx: 0,
  $width: 0,
  $alignStyle: '',
  $isAside: false,
  $panel: 'center',
  $uid: '',
  $colSeq: 0,
  $enableHelp: false,
};
