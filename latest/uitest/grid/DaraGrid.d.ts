import { GridOptions } from './types/GridOptions.js';
import { BodyStyle, ThemeType } from './constantStyles';
import { FieldItem } from './types/GridField.js';
import { Message } from './types/Message.js';
import { PagingInfo } from './types/PagingInfo.js';
import { AddRowOptions, RowId, RowSelectOptions, SearchMode } from './types/Common';
import type { PdfExportOptions } from './export/pdf/PdfConverter';
import type { ExcelExportOptions } from './export/excel/ExcelConverter';
import type { CsvExportOptions } from './export/csv/CsvConverter';
import type { JsonExportOptions } from './export/json/JsonConverter';
import type { LoadOptions, LoadResult, RemoteParams, RemoveOptions, RemoveSummary, SaveSummary } from './types/DataSource';
/**
 * DaraGrid class
 *
 * @class DaraGrid
 * @typedef {DaraGrid}
 */
export declare class DaraGrid {
    static VERSION: string;
    private gridMain;
    /** 내보내기 동안 재사용하는 막대 차트 색상. 내보내기를 시작할 때 비운다. */
    private pdfBarColors;
    constructor(gridElement: HTMLElement, options: GridOptions, message?: Message);
    initGlobalConfig(): void;
    static create(gridElement: HTMLElement, options: GridOptions, message?: Message): DaraGrid;
    static message(message: Message): void;
    static setDefaultOptions(options: GridOptions): void;
    private createGrid;
    getOptions(): GridOptions;
    instanceId(): string;
    /**
     * grid instance 구하기
     *
     * @param {(HTMLElement | string)} eleOrId grid element, grid uid
     * @returns {DaraGrid} 그리드 object
     */
    static instance(eleOrId: HTMLElement | string): DaraGrid | null;
    /**
     * 모든 field 얻기
     */
    getFields(): FieldItem[];
    /**
     * 현재 표시 대상의 실제 행 데이터를 반환한다.
     * 페이징은 현재 페이지, 검색은 검색 결과, 트리는 펼친 행만 포함한다.
     * 그룹 소계·총계와 내부 관리 필드는 제외한다.
     *
     * @returns 현재 표시 대상 행의 얕은 복사본 배열
     */
    getItems(): any[];
    /**
     * 검색·페이징·트리 펼침 상태와 무관하게 로드된 전체 원본 행을 반환한다.
     * 트리는 자손을 포함한 평탄한 배열이며, soft 삭제 행도 포함한다.
     * 그룹 가상 행과 내부 관리 필드는 제외한다. 외부 페이징은 로드된 행만 반환한다.
     *
     * @returns 전체 원본 행의 얕은 복사본 배열
     */
    getAllItems(): Record<string, any>[];
    /**
     * 내보내기 가능한 현재 뷰의 모든 행을 PDF로 다운로드합니다.
     *
     * 사용자 정의 글꼴은 fetch 등의 방법으로 읽은 ArrayBuffer 또는 Uint8Array로 전달합니다.
     */
    exportPdf(options?: PdfExportOptions): Promise<Blob>;
    /** CSV를 필요한 시점에 로드하여 실제 데이터 행을 다운로드한다. */
    exportCsv(options?: CsvExportOptions): Promise<Blob>;
    /** JSON 모듈을 필요한 시점에 로드하고 필드명을 키로 하는 행 배열을 다운로드한다. */
    exportJson(options?: JsonExportOptions): Promise<Blob>;
    /** CSV·JSON의 대상 행과 열을 선택하며 화면·선택 상태는 유지한다. */
    private createDataExportContext;
    /** 현재 뷰의 표시 값·그룹 합계·셀 병합을 XLSX로 다운로드한다. */
    exportExcel(options?: ExcelExportOptions): Promise<Blob>;
    private createPdfCellStyleResolver;
    private getPdfCellBorders;
    private getPdfCellChart;
    /**
     * 현재 표시 중인 모든 레이어(드롭다운, 팝업 등)를 숨긴다.
     */
    hideLayer(): void;
    /**
     * 그리드에 focusout 처리를 설정한다.
     *
     * 포커스를 잃었을 때 필요한 UI 처리(예: 레이어 닫기)를 수행한다.
     */
    setFocusOut(): void;
    /**
     * 툴바에 설정된 현재 값을 반환한다.
     *
     * @returns 툴바 값 객체
     */
    getToolbarValues(): Record<string, unknown>;
    /**
     * 툴바 값을 설정한다.
     *
     * @param values - 설정할 툴바 값 객체
     */
    setToolbarValues(values: any): void;
    /**
     * item index 값으로 item 얻기
     *
     * @param {number[]} indexs index
     * @returns {{}}
     */
    getItemsByIndexs(indexs: number[]): any[];
    selectRowById(rowId: RowId, opts: RowSelectOptions): void;
    /**
     * 지정한 행 ID에 해당하는 데이터를 반환합니다.
     *
     * @param rowId 조회할 행의 ID
     * @returns 행 ID에 해당하는 데이터 객체
     */
    getItemById(rowId: RowId): any;
    /**
     * 지정한 행 ID 목록에 해당하는 데이터들을 반환합니다.
     *
     * 반환되는 배열의 순서는 전달된 rowIds의 순서와 동일합니다.
     *
     * @param rowIds 조회할 행 ID 목록
     * @returns 행 ID 목록에 해당하는 데이터 객체 배열
     */
    getItemsByIds(rowIds: RowId[]): any[];
    setPaging(paging: PagingInfo): void;
    /**
     * set items
     *
     * @param {any[]} items
     */
    setItems(items: any[]): void;
    clearItems(): void;
    /**
     * 행 데이터를 추가
     *
     * @param items - 추가할 행 데이터 배열
     * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
     *
     * @example
     * // 기본 추가
     * grid.addItems(items, {});
     *
     * @example
     * // 특정 행의 앞에 추가
     * grid.addItems(items, {
     *   rowId: targetRowId,
     *   position: 'before',
     * });
     *
     * @example
     * // 특정 행의 뒤에 추가
     * grid.addItems(items, {
     *   rowId: targetRowId,
     *   position: 'after',
     * });
     *
     * @example
     * // 특정 행의 내부에 추가
     * grid.addItems(items, {
     *   rowId: targetRowId,
     *   position: 'inside',
     * });
     */
    addItems(items: any[], addOpts?: AddRowOptions): void;
    /**
     * 새로운 item을 Grid에 추가
     *
     *
     * @param item 추가할 item
     * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
     * @example
     * // 특정 행의 내부에 생성
     * grid.createItem(item, {
     *   rowId: targetRowId,
     *   position: 'before'|'after'|'inside', <-- inside 트리 형식일때 사용.
     * });
     */
    createItem(item: any, addOpts?: AddRowOptions): void;
    /**
     * remove row item
     *
     * @param {any[]} ids rowid
     */
    removeItems(ids: any[]): void;
    setSize(width: number, height: number): void;
    /**
     * 현재 선택된 정보를 반환
     *
     * header field 정보와 선택 모드에 따라 선택된 Row 또는 Cell 정보
     * 필요 시 숫자 필드의 합계 정보
     *
     * @param numberFieldSummary 숫자 필드의 정보를 포함할지 여부
     * @returns 선택 정보
     */
    getSelection(numberFieldSummary?: boolean): any;
    /**
     * 현재 선택된 row 를 반환
     * @returns 선택 row
     */
    getSelectedRows(): any[];
    /**
     * 현재 선택된 row ids 를 반환
     * @returns 선택된 row id 배열
     */
    getSelectedRowIds(): any[];
    /**
     * get checked items
     *
     * @returns {*}
     */
    getCheckedItems(names?: string | string[]): any[];
    /**
     * get checked items
     *
     * @returns {*}
     */
    getCheckedIds(): any[];
    /**
     * 현재 체크된 항목들에서 지정한 필드(`name`)의 값을 배열로 반환합니다.
     *
     * @param name - 반환할 필드명 (예: 'id', 'code', 'name' 등)
     * @returns 체크된 항목들의 해당 필드값 배열
     *
     * 예시:
     * - name이 "id"인 경우 → 체크된 row들의 id만 추출하여 배열로 반환
     */
    getCheckedItemByName(name: string): any[];
    /**
     * set all check items
     *
     * @param {boolean} checked
     */
    setAllCheckedItems(checked: boolean): void;
    /**
     * 특정 필드값(`name`)을 기준으로 주어진 값(`values`)과 일치하는 항목을 체크 상태로 설정합니다.
     *
     * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
     * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
     *
     */
    setCheckedItemByValue(name: string, values: any): void;
    /**
     * 주어진 값(`values`)과 일치하는 항목을 체크 상태로 **추가**합니다.
     * 기존 체크 상태는 유지되고, 해당 값만 추가로 체크됩니다.
     *
     * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
     * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
     */
    addCheckedItemByValue(name: string, values: any): void;
    /**
     * 주어진 값(`values`)과 일치하는 항목을 체크 해제합니다.
     * 기존 체크 상태 중 해당 값들만 체크 해제되며, 나머지는 유지됩니다.
     *
     * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
     * @param values - 체크 해제할 값 또는 값 배열 (단일 값도 허용됨)
     */
    unCheckedItemByValue(name: string, values: any): void;
    /**
     * 변경된 행 데이터를 반환
     *
     * 추가, 수정, 삭제 등 데이터 변경 상태가 있는 item만 반환
     *
     * @returns 변경된 행 데이터 배열
     */
    getChangedItems(): Record<string, any>[];
    /**
     * 그리드 테마를 변경합니다.
     *
     * @param themeName - 변경할 테마 이름 (예: 'light', 'dark').
     *                    생략하거나 빈 값이면 그리드별 테마 지정을 해제하고 상위 요소의 data-daracl-theme 를 따른다.
     */
    setTheme(themeName?: ThemeType | ''): void;
    /**
     * 그리드 스타일 변경
     *
     *  BodyStyle 스타일
     *  ex) default, striped, borderless, list
     *
     * @param styleName 적용할 그리드 스타일
     *
     */
    setStyle(styleName: BodyStyle): void;
    /**
     * grid height
     *
     * @public
     * @returns {*}
     */
    getGridHeight(): number;
    copyData(): void;
    changeContextMenuHeader(label: string): void;
    expandAll(): void;
    collapseAll(): void;
    search(searchText: string, opts: SearchMode): any;
    /**
     * dataSource.load로 서버 데이터를 조회한다. 조회 조건을 생략하면 마지막 조건을 사용한다.
     *
     * 미저장 변경이 있으면 UNSAVED_CHANGES 오류로 거부한다. 변경을 버리려면 `{ discardChanges: true }`를 전달한다.
     *
     * @param params 서버 조회 조건
     * @param options 조회 옵션
     * @returns 조회 결과. before 이벤트로 취소되었거나 더 새로운 조회에 밀렸으면 null
     * @example
     * await grid.load({ status: 'ACTIVE' });
     */
    load(params?: RemoteParams, options?: LoadOptions): Promise<LoadResult | null>;
    /**
     * 검색 조건을 적용하여 서버에서 조회한다. 서버 페이징이면 첫 페이지부터 조회한다.
     * 클라이언트 검색(`search()`)과는 별개이다.
     */
    searchRemote(params: RemoteParams, options?: LoadOptions): Promise<LoadResult | null>;
    /**
     * infinite 페이징에서 다음 페이지를 조회해 기존 데이터 뒤에 붙인다. 보통은 스크롤이 끝에 가까워지면 자동 호출된다.
     * 다른 조회·저장·삭제가 진행 중이거나 더 받을 데이터가 없으면 요청하지 않고 null을 반환한다.
     *
     * @returns 이번에 받은 페이지 결과. 요청하지 않았거나 취소되었으면 null
     */
    loadMore(): Promise<LoadResult | null>;
    /**
     * 마지막 조회 조건(과 현재 페이지)으로 다시 조회한다. infinite 페이징은 첫 페이지부터 다시 조회한다.
     */
    reload(options?: LoadOptions): Promise<LoadResult | null>;
    /**
     * 변경된 행(추가·수정·삭제)을 dataSource.save로 저장한다. 변경이 없으면 요청하지 않는다.
     * 성공하면 변경 상태를 확정하고 Undo/Redo 이력을 초기화한다.
     *
     * @returns 저장 요약. before 이벤트로 취소되면 null
     */
    save(): Promise<SaveSummary | null>;
    /**
     * 선택된 행(또는 `options.rowIds`)을 dataSource.remove로 서버에서 삭제한다.
     * 저장된 적 없는 신규 행은 요청 없이 로컬에서만 제거한다.
     */
    removeRemote(options?: RemoveOptions): Promise<RemoveSummary | null>;
    /** dataSource가 없으면 동기 예외 대신 reject된 Promise를 반환한다. */
    private remote;
    static setIcons(icons: any): void;
    /**
     * grid destroy
     *
     * @public
     */
    destroy(): void;
}
