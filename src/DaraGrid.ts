import { GridOptions } from "@t/GridOptions";
import { defaultOptions } from "./defaultGridOption";
import { EditRenderer } from "@t/EditRenderer";
import * as utils from "./util/utils";
import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "./util/Lanauage";
import { stringValidator } from "./rule/stringValidator";
import { numberValidator } from "./rule/numberValidator";
import { regexpValidator } from "./rule/regexpValidator";
import FieldInfoMap from "src/FieldInfoMap";
import FormTemplate from "./GridTemplate";
import { FORM_MODE } from "./constants";

declare const APP_VERSION: string;

interface FieldMap {
  [key: string]: EditRenderer;
}

interface DaraGridMap {
  [key: string]: DaraGrid;
}

// all instance
const allInstance: DaraGridMap = {};

const SEQ_ATTR_KEY = "daracl-grid-uid";

let DARA_GRID_SEQ = 0;
/**
 * DaraGrid class
 *
 * @class DaraGrid
 * @typedef {DaraGrid}
 */
export default class DaraGrid {
  public static VERSION = `${APP_VERSION}`;

  private readonly options;

  private orginFormStyleClass;

  /**
   * grid unique id
   */
  private $uid: string;

  private gridElement: Element;

  private fieldInfoMap: FieldInfoMap;

  private formValue: any = {};

  public formTemplate: FormTemplate;

  constructor(gridElement: Element, options: GridOptions, message?: Message) {
    this.options = utils.merge({}, defaultOptions, options) as GridOptions;

    Lanauage.set(message);

    if (gridElement == null || typeof gridElement === "undefined") {
      throw new Error(`${gridElement} grid element not found`);
    }

    this.orginFormStyleClass = gridElement.className;
    gridElement.classList.add("daracl-grid");

    this.$uid = `dg_${++DARA_GRID_SEQ}`;
    gridElement.setAttribute(SEQ_ATTR_KEY, this.$uid);

    if (this.options.width) {
      gridElement.setAttribute("style", `width:${this.options.width};`);
    }

    this.gridElement = gridElement;

    allInstance[this.$uid] = this;
    this.createGrid(this.options.fields);
  }

  public static create(gridElement: Element, options: GridOptions, message?: Message): DaraGrid {
    return new DaraGrid(gridElement, options, message);
  }

  public static setMessage(message: Message): void {
    Lanauage.set(message);
  }

  private createForm(fields: EditRenderer[]) {
    this.fieldInfoMap = new FieldInfoMap(this.$uid, this);
    //this.gridElement.innerHTML = "";
    this.formTemplate = new FormTemplate(this, this.gridElement, this.fieldInfoMap);

    if (this.options.autoCreate === false) {
      return;
    }

    fields.forEach((field) => {
      this.formTemplate.addRow(field);
    });
    this.conditionCheck();

    if (this.options.onMounted) {
      this.options.onMounted.call(this);
    }
  }

  /**
   * change mode
   *
   * @param mode form_mode default new
   */
  public changeMode = (mode: FORM_MODE): void => {
    this.options.mode = mode;
    this.gridElement.setAttribute("data-df-mode", mode);
  };

  /**
   * 폼 데이터 reset
   */
  public resetForm = () => {
    const fieldMap = this.fieldInfoMap.getAllFieldInfo();
    for (const seq in fieldMap) {
      const fieldInfo = fieldMap[seq];
      const renderInfo = fieldInfo.$instance;

      if (renderInfo && typeof renderInfo.reset === "function") {
        renderInfo.reset();
      }
    }
    this.formValue = {};
    this.conditionCheck();
  };

  /**
   * field 값 reset
   * @param fieldName 필드명
   */
  public resetField = (fieldName: string) => {
    this.fieldInfoMap.getFieldName(fieldName).$instance.reset();
    this.formValue[fieldName] = "";
    this.conditionCheck();
  };

  /**
   * 필드 element 얻기
   *
   * @param {string} fieldName
   * @returns {*}
   */
  public getFieldElement(fieldName: string) {
    const field = this.fieldInfoMap.getFieldName(fieldName);

    if (field?.$instance) {
      return field.$instance.getElement();
    }

    return null;
  }

  public getField(fieldName: string): EditRenderer {
    return this.fieldInfoMap.getFieldName(fieldName);
  }

  /**
   * field 값 얻기
   *
   * @param fieldName  필드명
   * @returns
   */
  public getFieldValue = (fieldName: string) => {
    const field = this.fieldInfoMap.getFieldName(fieldName);

    if (field) {
      return field.$instance.getValue();
    }
    return null;
  };

  /**
   * 폼 필드 값 얻기
   * @param isValid 폼 유효성 검사 여부 default:false|undefined true일경우 검사.
   * @returns
   */
  public getValue = (isValid: boolean): any => {
    return this.fieldInfoMap.getAllFieldValue(this.formValue, isValid);
  };

  public getFormDataValue = (isValid: boolean): any => {
    return this.fieldInfoMap.getFormDataValue(this.formValue, isValid);
  };

  /**
   * 폼 필드 value 셋팅
   * @param values
   */
  public setValue = (values: any, dataClear?: boolean | undefined) => {
    if (dataClear !== false) {
      this.resetForm();
    }

    Object.keys(values).forEach((fieldName) => {
      this._setFieldValue(fieldName, values[fieldName]);
    });
    this.conditionCheck();
  };

  public setFieldValue = (fieldName: string, value: any) => {
    this._setFieldValue(fieldName, value);
    this.conditionCheck();
  };

  private _setFieldValue(fieldName: string, value: any) {
    this.formValue[fieldName] = value;
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);

    if (fieldInfo) {
      fieldInfo.$instance.setValue(value);
    }
  }

  public setFieldItems = (fieldName: string, values: any) => {
    const field = this.fieldInfoMap.getFieldName(fieldName);

    if (field) {
      return field.$instance.setValueItems(values);
    }
  };

  /**
   * field 추가
   *
   * @param {EditRenderer} field
   */
  public addField = (field: EditRenderer) => {
    this.options.fields.push(field);
    this.formTemplate.addRow(field);
    this.conditionCheck();
  };

  /**
   * field 제거
   *
   * @param {string} fieldName
   */
  public removeField = (fieldName: string) => {
    const element = this.getFieldElement(fieldName);

    if (element != null) {
      element.closest(".df-row")?.remove();
    }

    this.fieldInfoMap.removeFieldInfo(fieldName);
  };

  /**
   * 폼 유효성 검증 여부
   *
   * @returns {boolean}
   */
  public isValidForm = (): boolean => {
    const result = this.validForm();

    return result.length < 1;
  };

  /**
   * 유효성 검증 폼 검증여부 리턴
   *
   * @returns {any[]}
   */
  public validForm = (): any[] => {
    let validResult = [] as any;
    let autoFocusFlag = this.options.autoFocus !== false;
    let firstFlag = true;

    const fieldMap = this.fieldInfoMap.getAllFieldInfo();
    for (const fieldKey in fieldMap) {
      const fieldInfo = fieldMap[fieldKey];

      let fieldValid = this.fieldInfoMap.getFieldValidation(fieldInfo, autoFocusFlag);

      if (fieldValid !== true) {
        autoFocusFlag = false;

        if (utils.isGridType(fieldInfo)) {
          validResult = validResult.concat(fieldValid);
        } else {
          if (firstFlag) {
            this.validTabCheck(fieldInfo);
            firstFlag = false;
          }
          validResult.push(fieldValid);
        }
      }
    }

    return validResult;
  };

  private validTabCheck(fieldInfo: EditRenderer) {
    if (fieldInfo.$parent) {
      if (fieldInfo.$parent.renderType == "tab") {
        fieldInfo.$parent.$instance.setActive(fieldInfo.$key);
      }
      this.validTabCheck(fieldInfo.$parent);
    }
  }

  public isValidField = (fieldName: string): boolean => {
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);

    if (utils.isUndefined(fieldInfo)) {
      throw new Error(`Field name [${fieldName}] not found`);
    }

    const renderInfo = fieldInfo.$instance;
    if (renderInfo) {
      return renderInfo.valid() === true;
    }

    return true;
  };

  /**
   * 설정 옵션 얻기
   */
  public getOptions = () => {
    return this.options;
  };

  public conditionCheck() {
    this.fieldInfoMap.conditionCheck();
  }

  public setFieldDisabled(fieldName: string, flag: boolean) {
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);
    fieldInfo.$instance.setDisabled(flag);
  }

  /**
   * 설명 추가
   *
   * @public
   * @param {string} fieldName
   * @param {string} desc
   */
  public setFieldDescription(fieldName: string, desc: string) {
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);
    fieldInfo.$instance.setDescription(desc);
  }

  public destroy = () => {
    this.gridElement.className = this.orginFormStyleClass;
    this.gridElement.replaceChildren();

    for (const key in this) {
      if (utils.hasOwnProp(this, key)) {
        delete this[key];
        delete allInstance[this.$uid];
      }
    }
  };

  public static validator = {
    string: (value: string, field: EditRenderer) => {
      return stringValidator(value, field);
    },
    number: (value: string, field: EditRenderer) => {
      return numberValidator(value, field);
    },
    regexp: (value: string, field: EditRenderer) => {
      let result: ValidResult = { name: field.name, constraint: [] };
      return regexpValidator(value, field, result);
    },
  };

  public static instance(ele: Element | String) {
    let element;
    if (utils.isString(ele)) {
      element = document.querySelector(ele);
    } else {
      element = ele;
    }
    element = element as Element;
    let uid = element.getAttribute(SEQ_ATTR_KEY);

    if (utils.isUndefined(uid) || utils.isBlank(uid)) {
      const keys = Object.keys(allInstance);
      if (keys.length > 1) {
        throw new Error(`uid empty : [${uid}]`);
      }
      uid = keys[0];

      return allInstance[uid];
    }
  }
  /**
   * 모든 field 얻기
   */
  public getFields = (): any[] => {
    return this.options.fields;
  };

  /**
   * field setting
   * @param fields
   */
  public setFields = (fields: any[]) => {
    this.options.fields = fields;
    this.createForm(fields);
  };

  public getFieldInfoMap() {
    return this.fieldInfoMap;
  }
}
