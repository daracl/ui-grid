import { FormOptions } from "@t/GridOptions";
import { FieldStyle, EditRenderer } from "@t/EditRenderer";
import * as utils from "./util/utils";
import FieldInfoMap from "src/FieldInfoMap";

import styleUtils from "./util/styleUtils";
import DaraForm from "./DaraGrid";
import TabRender from "./renderer/edit/TabRender";
import GridRender from "./renderer/edit/GridRender";

/**
 * form template
 *
 * @class FormTemplate
 * @typedef {FormTemplate}
 */
export default class FormTemplate {
  private readonly options: FormOptions;
  private readonly formElement;

  private fieldInfoMap;

  private daraform: DaraForm;

  private addRowFields: string[] = [];

  constructor(daraform: DaraForm, formElement: Element, fieldInfoMap: FieldInfoMap) {
    this.daraform = daraform;
    this.options = daraform.getOptions();
    this.formElement = formElement;

    this.fieldInfoMap = fieldInfoMap;
  }

  /**
   * field row 추가.
   *
   * @param field
   */
  public addRow(field: EditRenderer) {
    if (this.checkHiddenField(field)) {
      return;
    }

    this.addRowFields = [];

    this.addRowTemplate(field);
  }

  /**
   * 그룹 템플릿
   *
   * @param {EditRenderer} field
   * @returns {string} row template
   */
  public addRowTemplate(field: EditRenderer): void {
    let labelHideFlag = this.isLabelHide(field);

    let fieldStyle: FieldStyle = styleUtils.fieldStyle(this.options, field, null, labelHideFlag);

    this.addRowFieldInfo(field);

    const rowElement = utils.templateToElement(`
        <div class="df-row form-group ${fieldStyle.fieldClass}" id="${field.$key}">
          ${labelHideFlag ? "" : `<div class="df-label ${fieldStyle.labelClass} ${fieldStyle.labelAlignClass}" title="${field.label ?? ""}" style="${fieldStyle.labelStyle}">${this.getLabelTemplate(field)}</div>`}

          <div class="df-field-container ${fieldStyle.valueClass} ${field.required ? "required" : ""}" style="${fieldStyle.valueStyle}"></div>
        </div>
    `);

    if (rowElement) {
      this.createField(field, rowElement);
      this.formElement.append(rowElement);

      if (field.children) {
        this.childTemplate(field, fieldStyle);
      }
    }
  }

  public createField(field: EditRenderer, element: Element): void {
    field.$instance = new (field.$renderType as any)(field, element, this.daraform);
  }

  /**
   * child template
   *
   * @param {EditRenderer} field
   * @param {FieldStyle} parentFieldStyle
   * @returns {*}
   */
  public childTemplate(field: EditRenderer, parentFieldStyle: FieldStyle): void {
    let beforeField: EditRenderer = null as any;
    let firstFlag = true;
    let isEmptyLabel = false;

    if (!(field.$renderType as any).isChildrenCreate()) {
      return;
    }

    const rowElement = document.createElement("div");
    rowElement.classList.add("df-row", parentFieldStyle.rowStyleClass ?? "");

    let idx = 0;

    for (const childField of field.children) {
      if (utils.isEmpty(childField)) {
        throw new Error(`parent field :[${field.$validName}], children index ${idx},  empty [${childField}]`);
      }

      childField.$parent = field;
      ++idx;

      if (this.checkHiddenField(childField)) {
        continue;
      }

      this.addRowFieldInfo(childField);

      if (firstFlag) {
        beforeField = childField;
      }

      let labelHideFlag = this.isLabelHide(childField);

      let childFieldStyle;

      let labelTemplate = "";
      if (labelHideFlag) {
        childFieldStyle = styleUtils.fieldStyle(this.options, childField, beforeField, !isEmptyLabel);
        labelTemplate = isEmptyLabel ? `<span class="df-label empty ${childFieldStyle.labelClass}" style="${childFieldStyle.labelStyle}"></span>` : "";
      } else {
        childFieldStyle = styleUtils.fieldStyle(this.options, childField, beforeField, false);
        labelTemplate = `<span class="df-label ${childFieldStyle.labelClass} ${childFieldStyle.labelAlignClass}" title="${childField.label ?? ""}" style="${childFieldStyle.labelStyle}">${this.getLabelTemplate(childField)}</span>`;
      }

      const groupElement = utils.templateToElement(`<div class="form-group ${childFieldStyle.fieldClass}" style="${childFieldStyle.fieldStyle}" id="${childField.$key}">
        ${labelTemplate}
        <span class="df-field-container ${childFieldStyle.valueClass} ${childField.required ? "required" : ""}" style="${childFieldStyle.valueStyle}"></span>
      </div>`);

      if (groupElement) {
        this.createField(childField, groupElement);
        rowElement.append(groupElement);

        if (childField.children) {
          this.childTemplate(childField, childField.children ? childFieldStyle : parentFieldStyle);
        }
      }
      if (!labelHideFlag) {
        isEmptyLabel = true;
      }

      firstFlag = false;
    }

    field.$instance.addChildField(rowElement);
  }

  /**
   * label template
   *
   * @param {EditRenderer} field form field
   * @returns {string} template string
   */
  public getLabelTemplate(field: EditRenderer) {
    const requiredTemplate = field.required ? `<span class="required"></span>` : "";
    const tooltipTemplate = utils.isBlank(field.tooltip) ? "" : `<span class="df-tooltip">?<span class="tooltip">${field.tooltip}</span></span>`;

    return `${field.label ?? ""} ${tooltipTemplate} ${requiredTemplate}`;
  }

  /**
   * label 숨김 여부
   *
   * @param field EditRenderer
   * @returns
   */
  public isLabelHide(field: EditRenderer): boolean {
    return field.style?.labelHide || utils.isUndefined(field.label);
  }

  public checkHiddenField(field: EditRenderer) {
    if (utils.isHiddenField(field)) {
      this.fieldInfoMap.addField(field);
      field.$instance = new (field.$renderType as any)(field, null, this.daraform);

      return true;
    }

    return false;
  }

  /**
   * add row file map
   *
   * @param {EditRenderer} field
   */
  public addRowFieldInfo(field: EditRenderer) {
    if (!utils.isBlank(field.name) && this.fieldInfoMap.hasFieldName(field.name)) {
      throw new Error(`Duplicate field name "${field.name}"`);
    }

    this.fieldInfoMap.addField(field);
    this.addRowFields.push(field.$key);
  }
}
