import { GridOptions } from '@t/GridOptions';

import { ADD_ITEM_POSITION, HIDDEN_ELEMENT_SELECTOR, THEME_TYPE } from './constants';

import { FieldItem } from '@t/GridField';
import { Message } from '@t/Message';
import { PagingInfo } from '@t/PagingInfo';
import { createHTMLElement } from './util/domUtils';
import { Language } from './util/Language';
import { isUndefined } from './util/utils';
import { GridMain } from './view/GridMain';
import { AddRowOptions } from './types/Common';

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
   * @public
   * @static
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

  public getItems() {
    return this.gridMain.config().dataManager.getViewItems();
  }

  public hideLayer() {
    this.gridMain.hideLayer('all');
  }

  public setFocusOut() {
    this.gridMain.setGridFocusOut();
  }

  /**
   * item index 값으로 item 얻기
   *
   * @param {number[]} indexs index
   * @returns {{}}
   */
  public getItemsByIndexs(indexs: number[]) {
    const result = [];
    const items = this.gridMain.config().dataManager.getViewItems();
    for (const index of indexs) {
      result.push(items[index]);
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
   * add row items
   *
   * @param items add items
   * @param position add position
   * @param addRowIndex add row index
   */
  public addRows(addOpts: AddRowOptions) {
    this.gridMain.addRows(addOpts);
  }

  /**
   * remove row item
   *
   * @param {any[]} ids row positions
   */
  public removeRows = (ids: any[]) => {
    this.gridMain.removeRows(ids);
  };

  public setSize(width: number, height: number) {
    this.gridMain.setSize(width, height, true);
  }

  /**
   * 선택된 item 얻기
   *
   * @returns {*}
   */
  public getSelectedItems() {
    return this.gridMain.selectionInfo.selectionData('json', false);
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
   * 그리드 테마를 변경합니다.
   *
   * @param themeName - 변경할 테마 이름 (THEME_TYPE enum 값: 예: 'light', 'dark' 등)
   */
  public setTheme(themeName: THEME_TYPE) {
    this.gridMain.setTheme(themeName);
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

  /**
   * grid destroy
   *
   * @public
   */
  public destroy() {
    this.gridMain.destroy();
  }
}
