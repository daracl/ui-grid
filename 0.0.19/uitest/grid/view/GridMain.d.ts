import { Config } from '../types/GridConfig.js';
import { BodyStyle, ThemeType } from '../constantStyles.js';
import { DaraGrid } from '../DaraGrid.js';
import { DaraElement } from '../element/DaraElement.js';
import { SelectionInfo } from '../selection/selection.js';
import { RemoteDataController } from '../service/remote/RemoteDataController.js';
import { AddRowOptions } from '../types/Common.js';
import { GridOptions } from '../types/GridOptions.js';
import { Message } from '../types/Message.js';
import { PagingInfo } from '../types/PagingInfo.js';
import { Language } from '../util/Language.js';
import { Toolbar } from './toolbar/Toolbar.js';
import { StructureBuilder } from './builder/StructureBuilder';
import { Footer } from './footer/Footer';
import { Body } from './main/body/Body';
import { ContextMenu } from './main/ContextMenu';
import { Header } from './main/header/Header';
import { Scroll } from './main/scroll/Scroll';
import { Summary } from './main/Summary';
import { DataSearch } from './search/DataSearch';
interface GridSize {
    height: number;
    width: number;
}
/**
 * GridMain class
 *
 * @class GridMain
 * @typedef {GridMain}
 */
export declare class GridMain {
    private grid;
    private readonly opts;
    private language;
    private cfg;
    private toolbar;
    private header;
    private body;
    private footer;
    private scroll;
    private summary;
    private contextMenu;
    private dataSearch;
    private mainElement;
    private layoutElement;
    private rendererLayerElement;
    private gridKeyInput;
    selectionInfo: SelectionInfo;
    private currentSize;
    private initGridSize;
    /**
     * grid id
     */
    private readonly $instanceId;
    private readonly gridElement;
    private readonly orginStyle;
    private readonly openLayers;
    private readonly layerPositions;
    private resizeObserver;
    private resizeFrame;
    private destroyed;
    private windowResizeHandler?;
    private cancelWindowResize?;
    private readonly structureBuilder;
    /** dataSource 옵션이 있을 때만 생성되는 서버 연동 컨트롤러 */
    private remote?;
    constructor(grid: DaraGrid, element: HTMLElement, options: GridOptions, message?: Message);
    /**
     * 서버 연동 컨트롤러. dataSource 옵션이 없으면 오류를 던진다.
     */
    /** toolbar.remote 설정에 따른 자동 서버 조회. dataSource가 없으면 무시한다. */
    searchByToolbar(trigger: 'search' | 'change'): void;
    getRemote(): RemoteDataController;
    init(): void;
    /**
     * grid 전체 이벤트
     */
    initDocumentGlobalEvent(): void;
    /** 그리드 바깥 클릭 시 모든 인스턴스의 포커스를 해제합니다. */
    private static readonly globalPointerDownHandler;
    static getInstance(eleOrId: HTMLElement | string): DaraGrid | null;
    static allInstance(): Map<string, GridMain>;
    element(): DaraElement;
    getGridKeyInputElement(): HTMLInputElement;
    config(): Config;
    options(): GridOptions;
    i18n(): Language;
    /**
     * init grid element
     */
    private initElement;
    /**
     * init main object viewer
     *
     * @private
     */
    private initMainView;
    getRendererLayerElement(): HTMLElement;
    uid(): string;
    /**
     * init event
     *
     * @public
     */
    initEvent(): void;
    /**
     * set focus in
     *
     * @public
     * @param {Event} e event
     */
    setGridFocusIn(e?: Event): void;
    /**
     * grid focus out
     *
     * @public
     * @param {Event} e event
     */
    setGridFocusOut(e?: Event): void;
    openLayer(layerElement: HTMLElement, updatePosition?: () => void): void;
    hideLayer(hideElement?: HTMLElement | string): void;
    /**
     * resize event
     *
     * @private
     */
    private initResizeEvent;
    /**
     * resize event 처리
     *
     * @param el grid element
     */
    resize(el: DaraElement): void;
    /**
     * grid size 및 field 정보 계산
     */
    calculation(): void;
    calcBody(): void;
    /**
     * main element
     *
     * @public
     * @returns {DaraElement} main element
     */
    getMainElement(): DaraElement;
    getDataSearch(): DataSearch;
    /**
     * body object
     *
     * @public
     * @returns {Body} body object
     */
    getBody(): Body;
    getStructureBuilder(): StructureBuilder;
    /**
     * contextmenu object
     *
     * @returns {ContextMenu}
     */
    getContextMenu(): ContextMenu;
    /**
     * summary object
     *
     * @public
     * @returns {Summary}
     */
    getSummary(): Summary;
    /**
     * footer object
     *
     * @public
     * @returns {Footer}
     */
    getFooter(): Footer;
    /**
     * header object
     *
     * @public
     * @returns {Header} header object
     */
    getHeader(): Header;
    /**
     * scroll object
     *
     * @public
     * @returns {Scroll} object
     */
    getScroll(): Scroll;
    getCurrentSize(): GridSize;
    /**
     * set size
     *
     * @public
     * @param {?number} [width] 넓이
     * @param {?number} [height] 높이
     */
    setSize(width: number, height: number, drawFlag?: boolean): void;
    resizeDraw(): void;
    /**
     * cell size 설정
     */
    fieldResize(): void;
    /**
     * update field width
     */
    private updateFieldWidth;
    setElementDimensions(): void;
    /**
     * change scroll mode
     *
     */
    private changeScrollMode;
    /**
     * set data
     *
     * @param {any[]} items
     */
    setItems(items: any[]): void;
    refreshBody(drawFlag: boolean, mode: string): void;
    /**
     * 데이터를 추가
     *
     * @param items - 추가할 행 데이터 배열
     * @param addOpts - 행 추가 위치 및 대상에 대한 옵션
     * @returns void
     */
    addItems(items: any[], addOpts?: AddRowOptions): void;
    /**
     * 서버에서 받은 데이터를 목록 끝에 붙입니다(infinite 페이징). 스크롤 위치는 유지하고 Undo 이력은 남기지 않습니다.
     *
     * @param items 추가할 행 데이터 배열
     */
    appendItems(items: any[]): void;
    /**
     * 새로운 item을 Grid에 추가합니다.
     *
     * item을 데이터 매니저에 추가하면서 신규 생성 상태(CREATE)를 설정하고,
     * 정상적으로 추가된 경우 해당 row 위치로 스크롤을 이동한 후 body를 갱신합니다.
     *
     * @param item 추가할 item
     * @param addOpts item 추가 옵션
     */
    createItem(item: any, addOpts?: AddRowOptions): void;
    /**
     * item을 삭제
     *
     * @param {any[]} ids rowId
     */
    removeItems(ids: any[]): void;
    /**
     * all items clear
     *
     * @public
     */
    clearItems(): void;
    /**
     * get checked items
     *
     * @param names filed names
     * @returns {array} checked item array
     */
    getCheckedItems(names?: string | string[] | undefined): any[];
    /**
     * get check items
     *
     * @public
     * @param {string} name field name
     * @returns {*} name 값만 리턴
     */
    getCheckedItemByName(name: string): any[];
    getCheckedIds(): any[];
    /**
     * all check
     *
     * @public
     * @param {boolean} checked
     */
    setAllCheckedItems(checked: boolean): void;
    /**
     * name value item check
     *
     * @public
     * @param {string} name field name
     * @param {*} values field value
     */
    setCheckedItemByValue(name: string, values: any): void;
    /**
     * add check item
     *
     * @public
     * @param {string} name field name
     * @param {*} values field value
     */
    addCheckedItemByValue(name: string, values: any): void;
    /**
     * un checked
     *
     * @public
     * @param {string} name field name
     * @param {*} values field values
     */
    unCheckedItemByValue(name: string, values: any): void;
    /**
     * 변경된 아이템 얻기
     */
    getChangedItems(): Record<string, any>[];
    /**
     * 그리드 테마를 변경합니다.
     *
     * @param themeName - 변경할 테마 이름 (예: 'light', 'dark').
     *                    생략하거나 빈 값이면 그리드별 테마 지정을 해제한다.
     *                    (해제되면 상위 요소의 data-daracl-theme 속성, 없으면 기본 테마를 따른다.)
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
    setGridStyle(styleName: BodyStyle): void;
    /**
     * tree 확장
     * @param id id
     */
    expandRow(id: any): void;
    expandAll(): void;
    collapseAll(): void;
    setPaging(paging: PagingInfo): void;
    /**
     * 헤더 전체 체크박스를 현재 체크 상태에 맞춥니다. 행이 추가돼 체크된 행의 비율이 바뀐 뒤에 호출합니다.
     * 체크된 행이 없으면 계산하지 않고 'none'으로 둡니다.
     */
    private refreshCheckboxStyle;
    /**
     * infinite 페이징의 다음 페이지 조회 조건을 확인합니다.
     *
     * @param idleScroll 스크롤 위치가 바뀌지 않은 입력(이미 끝에서 더 스크롤)이면 true
     */
    checkLoadMore(idleScroll?: boolean): void;
    getToolbar(): Toolbar;
    /**
     * toolbar value
     * @returns [] toolbar value
     */
    getToolbarValues(): Record<string, unknown>;
    setToolbarValues(val: any): void;
    destroy(): void;
}
export {};
