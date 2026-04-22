import { FieldItem } from '@t/GridField';

import { ValidResult } from '@t/ValidResult';
import * as utils from '@/util/utils';
import { Renderer } from './Renderer';
import { GridMain } from '@/view/GridMain';
import { CellInfo } from '@t/GridConfig';
import { getElementRect, getLayerElement } from '@/util/domUtils';
import { FIELD_LAYER_CLASS, ROW_CUD_KEY } from '@/constants';

export abstract class EditRenderer extends Renderer {
  private readonly enableView: boolean = true;
  protected readonly rendererContainer: HTMLElement;

  private validatorElement: HTMLElement;

  constructor(field: FieldItem, gridMain: GridMain) {
    super(field, gridMain);

    this.rendererContainer = this.gridMain.getRendererContainer();
  }

  /**
   * view render
   *
   * @param {HTMLElement} element td element
   * @param {*} value value row item
   */
  public abstract render(cellInfo: CellInfo, element: HTMLElement): void;

  public abstract valid(value: any): ValidResult | boolean;

  /**
   * set value items
   *
   * @public
   * @param {any[]} listItem list items dropdown,checkbox,radio value
   */
  public setValueItems(listItem: any[]): void {
    // intentionally empty
  }

  /**
   * 값 얻기
   *
   * @param {any} value row item
   * @returns {any} field value
   */
  public getValue(value: any, formatFlag?: boolean) {
    return value[this.field.name];
  }

  /**
   * 값 셋팅
   *
   * @public
   * @param {HTMLElement} element cell element
   * @param {any} value row value
   */
  public setValue(e: Event, item: any, value: string) {
    if (!this.valid(value)) {
      return false;
    }

    if (this.changeEventCall(e, item, value)) {
      if (item[this.fieldName] == value) return;

      if (item[ROW_CUD_KEY] == 'R') {
        item[ROW_CUD_KEY] = 'U';
      }
      item[this.fieldName] = value;

      // 데이터 변경후 그리드 리프레시
      this.gridMain.getBody().dataDraw('dataChange');
    }
  }
  public isEnableView() {
    return this.enableView;
  }

  public valuesLabelValue(label: string, val: any) {
    let replaceFlag = false;
    const resultValue = label.replace(/\{\{([A-Za-z0-9_.]*)\}\}/g, (match, key) => {
      replaceFlag = true;
      return val[key] || '';
    });

    if (replaceFlag) {
      return resultValue;
    }

    return val[label] || '';
  }

  public changeEventCall(e: Event | null, item: any, value: any): boolean {
    const field = this.field;
    const fieldValue = value;

    if (field.renderer.change) {
      const changeInfo: any = {
        field: field,
        evt: e,
        item: utils.merge({}, item),
        //oldValue: field.$value,
        value: fieldValue,
      };

      if (changeInfo.oldValue !== changeInfo.value && field.renderer.change.call(null, changeInfo) === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * 유효성 검증 html element
   * @returns div element
   */
  public getValidatorElement() {
    if (this.validatorElement) {
      return this.validatorElement;
    }

    const div = getLayerElement('div', 'dg-validator-message ' + FIELD_LAYER_CLASS, 'validator');

    this.validatorElement = div;

    this.rendererContainer.appendChild(div);

    return div;
  }

  /**
   * 유효성 메시지 보이기
   *
   * @param result 유효성 검증 결과
   * @param cellElement cell element
   * @returns
   */
  public showInvalidMessage(result: ValidResult, cellElement: HTMLElement) {
    if (!this.gridMain.config().isOpenLayer) return true;

    const message = this.language.validMessage(this.field, result);

    if (message.length > 0) {
      const element = this.getValidatorElement();
      element.textContent = message[0];

      const cellRect = getElementRect(cellElement);
      const rendererContainer = getElementRect(this.rendererContainer);

      const style = element.style;

      this.gridMain.openLayer(element);
      style.top = `${cellRect.top - rendererContainer.top - element.offsetHeight}px`;
      style.left = `${cellRect.left - rendererContainer.left}px`;

      return true;
    }

    return false;
  }
}
