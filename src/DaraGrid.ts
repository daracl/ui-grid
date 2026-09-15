import { GridOptions } from '@t/GridOptions';

import { HIDDEN_ELEMENT_SELECTOR } from './constants';
import { BodyStyle, ThemeType } from './constantStyles';

import { FieldItem } from '@t/GridField';
import { Message } from '@t/Message';
import { PagingInfo } from '@t/PagingInfo';
import { ALL_ICONS } from './constantIcons';
import { AddRowOptions, RowId, RowSelectOptions, SearchMode } from './types/Common';
import { createHTMLElement } from './util/domUtils';
import { Language } from './util/Language';
import { isUndefined } from './util/utils';
import { GridMain } from './view/GridMain';
import { setDefaultOptions } from './defaultGridOption';

declare const APP_VERSION: string;

let HIDDEN_ELEMENT: HTMLElement | null = null;

/**
 * DaraGrid class
 *
 * @class DaraGrid
 * @typedef {DaraGrid}
 */
export class DaraGrid {
  public static VERSION = `${APP_VERSION}`;

  private gridMain: GridMain;

  constructor(gridElement: HTMLElement, options: GridOptions, message?: Message) {
    if (gridElement == null || isUndefined(gridElement)) {
      throw new Error(`${gridElement} grid element not found`);
    }

    this.createGrid(gridElement, options, message);
  }

  initGlobalConfig() {
    if (HIDDEN_ELEMENT === null) {
      const hiddenElement = createHTMLElement('div', HIDDEN_ELEMENT_SELECTOR.replace('.', ''));
      document.body.appendChild(hiddenElement);
      HIDDEN_ELEMENT = hiddenElement;
    }
  }

  public static create(gridElement: HTMLElement, options: GridOptions, message?: Message): DaraGrid {
    return new DaraGrid(gridElement, options, message);
  }

  public static message(message: Message): void {
    Language.setGlobalMessage(message);
  }

  public static setDefaultOptions(options: GridOptions): void {
    setDefaultOptions(options);
  }

  private createGrid(gridElement: HTMLElement, opts: GridOptions, message?: Message) {
    this.initGlobalConfig();

    this.gridMain = new GridMain(this, gridElement, opts, message);
    this.gridMain.init();
  }

  public getOptions(): GridOptions {
    return this.gridMain.options();
  }

  public instanceId() {
    return this.gridMain.uid();
  }

  /**
   * grid instance 구하기
   *
   * @param {(HTMLElement | string)} eleOrId grid element, grid uid
   * @returns {DaraGrid} 그리드 object
   */
  public static instance(eleOrId: HTMLElement | string): DaraGrid | null {
    return GridMain.getInstance(eleOrId);
  }
  /**
   * 모든 field 얻기
   */
  public getFields(): FieldItem[] {
    return this.gridMain.config().currentFields;
  }

  /**
   * 그리드의 전체 행 데이터를 반환한다.
   *
   * @returns 전체 행 데이터 배열
   */
  public getItems() {
    return this.gridMain.config().dataManager.getAllRowItems();
  }

  /**
   * 현재 표시 중인 모든 레이어(드롭다운, 팝업 등)를 숨긴다.
   */
  public hideLayer() {
    this.gridMain.hideLayer('all');
  }

  /**
   * 그리드에 focusout 처리를 설정한다.
   *
   * 포커스를 잃었을 때 필요한 UI 처리(예: 레이어 닫기)를 수행한다.
   */
  public setFocusOut() {
    this.gridMain.setGridFocusOut();
  }

  /**
   * 툴바에 설정된 현재 값을 반환한다.
   *
   * @returns 툴바 값 객체
   */
  public getToolbarValues() {
    return this.gridMain.getToolbarValues();
  }

  /**
   * 툴바 값을 설정한다.
   *
   * @param values - 설정할 툴바 값 객체
   */
  public setToolbarValues(values: any) {
    this.gridMain.setToolbarValues(values);
  }

  /**
   * item index 값으로 item 얻기
   *
   * @param {number[]} indexs index
   * @returns {{}}
   */
  public getItemsByIndexs(indexs: number[]) {
    const result = [];
    const dataManager = this.gridMain.config().dataManager;
    const viewItems = dataManager.getViewItems();
    for (const index of indexs) {
      const viewItem = viewItems[index];
      if (viewItem) {
        result.push(dataManager.getRowItem(viewItem.id));
      }
    }
    return result;
  }

  public selectRowById(rowId: RowId, opts: RowSelectOptions) {
    return this.gridMain.config().dataManager.selectRowById(rowId, opts);
  }

  /**
   * 지정한 행 ID에 해당하는 데이터를 반환합니다.
   *
   * @param rowId 조회할 행의 ID
   * @returns 행 ID에 해당하는 데이터 객체
   */
  public getItemById(rowId: RowId) {
    return this.gridMain.config().dataManager.getRowItem(rowId);
  }

  /**
   * 지정한 행 ID 목록에 해당하는 데이터들을 반환합니다.
   *
   * 반환되는 배열의 순서는 전달된 rowIds의 순서와 동일합니다.
   *
   * @param rowIds 조회할 행 ID 목록
   * @returns 행 ID 목록에 해당하는 데이터 객체 배열
   */
  public getItemsByIds(rowIds: RowId[]) {
    const result = [];
    const dataManager = this.gridMain.config().dataManager;
    for (const rowId of rowIds) {
      result.push(dataManager.getRowItem(rowId));
    }
    return result;
  }

  public setPaging(paging: PagingInfo) {
    this.gridMain.setPaging(paging);
  }

  /**
   * set items
   *
   * @param {any[]} items
   */
  public setItems(items: any[]) {
    this.gridMain.setItems(items);
  }

  public clearItems() {
    this.gridMain.clearItems();
  }

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
  public addItems(items: any[], addOpts?: AddRowOptions) {
    this.gridMain.addItems(items, addOpts);
  }

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
  public createItem(item: any, addOpts?: AddRowOptions) {
    this.gridMain.createItem(item, addOpts);
  }

  /**
   * remove row item
   *
   * @param {any[]} ids rowid
   */
  public removeItems(ids: any[]) {
    this.gridMain.removeItems(ids);
  }

  public setSize(width: number, height: number) {
    this.gridMain.setSize(width, height, true);
  }

  /**
   * 현재 선택된 정보를 반환
   *
   * header field 정보와 선택 모드에 따라 선택된 Row 또는 Cell 정보
   * 필요 시 숫자 필드의 합계 정보
   *
   * @param numberFieldSummary 숫자 필드의 정보를 포함할지 여부
   * @returns 선택 정보
   */
  public getSelection(numberFieldSummary = false) {
    return this.gridMain.selectionInfo.selectionData('json', numberFieldSummary);
  }

  /**
   * 현재 선택된 row 를 반환
   * @returns 선택 row
   */
  public getSelectedRows() {
    return this.gridMain.selectionInfo.selectionRows();
  }

  /**
   * 현재 선택된 row ids 를 반환
   * @returns 선택된 row id 배열
   */
  public getSelectedRowIds() {
    return this.gridMain.selectionInfo.selectionRowIds();
  }

  /**
   * get checked items
   *
   * @returns {*}
   */
  public getCheckedItems(names?: string | string[]) {
    return this.gridMain.getCheckedItems(names);
  }

  /**
   * get checked items
   *
   * @returns {*}
   */
  public getCheckedIds() {
    return this.gridMain.getCheckedIds();
  }

  /**
   * 현재 체크된 항목들에서 지정한 필드(`name`)의 값을 배열로 반환합니다.
   *
   * @param name - 반환할 필드명 (예: 'id', 'code', 'name' 등)
   * @returns 체크된 항목들의 해당 필드값 배열
   *
   * 예시:
   * - name이 "id"인 경우 → 체크된 row들의 id만 추출하여 배열로 반환
   */
  public getCheckedItemByName(name: string) {
    return this.gridMain.getCheckedItemByName(name);
  }

  /**
   * set all check items
   *
   * @param {boolean} checked
   */
  public setAllCheckedItems(checked: boolean) {
    this.gridMain.setAllCheckedItems(checked);
  }

  /**
   * 특정 필드값(`name`)을 기준으로 주어진 값(`values`)과 일치하는 항목을 체크 상태로 설정합니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   *
   */
  public setCheckedItemByValue(name: string, values: any) {
    this.gridMain.setCheckedItemByValue(name, values);
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 상태로 **추가**합니다.
   * 기존 체크 상태는 유지되고, 해당 값만 추가로 체크됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public addCheckedItemByValue(name: string, values: any) {
    this.gridMain.addCheckedItemByValue(name, values);
  }

  /**
   * 주어진 값(`values`)과 일치하는 항목을 체크 해제합니다.
   * 기존 체크 상태 중 해당 값들만 체크 해제되며, 나머지는 유지됩니다.
   *
   * @param name - 비교에 사용할 항목의 필드명 (예: 'id', 'code' 등)
   * @param values - 체크 해제할 값 또는 값 배열 (단일 값도 허용됨)
   */
  public unCheckedItemByValue(name: string, values: any) {
    this.gridMain.unCheckedItemByValue(name, values);
  }

  /**
   * 변경된 행 데이터를 반환
   *
   * 추가, 수정, 삭제 등 데이터 변경 상태가 있는 item만 반환
   *
   * @returns 변경된 행 데이터 배열
   */
  public getChangedItems() {
    return this.gridMain.getChangedItems();
  }

  /**
   * 그리드 테마를 변경합니다.
   *
   * @param themeName - 변경할 테마 이름 (THEME_TYPE enum 값: 예: 'light', 'dark' 등)
   */
  public setTheme(themeName: ThemeType) {
    this.gridMain.setTheme(themeName);
  }

  /**
   * 그리드 스타일 변경
   *
   *  BodyStyle 스타일
   *  ex) default, striped, borderless, list
   *
   * @param styleName 적용할 그리드 스타일
   *
   */
  public setStyle(styleName: BodyStyle) {
    this.gridMain.setGridStyle(styleName);
  }

  /**
   * grid height
   *
   * @public
   * @returns {*}
   */
  public getGridHeight(): number {
    return this.gridMain.getCurrentSize().height;
  }

  public copyData() {
    this.gridMain.getBody().copyData();
  }

  public changeContextMenuHeader(label: string) {
    this.gridMain.getContextMenu().changeHeader(label);
  }

  public expandAll() {
    this.gridMain.expandAll();
  }

  public collapseAll() {
    this.gridMain.collapseAll();
  }

  public search(searchText: string, opts: SearchMode) {
    return this.gridMain.getDataSearch().search(searchText, opts ?? {});
  }

  public static setIcons(icons: any) {
    Object.assign(ALL_ICONS, icons);
  }

  /**
   * grid destroy
   *
   * @public
   */
  public destroy() {
    this.gridMain.destroy();
  }
}
