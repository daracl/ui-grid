import { RENDERER_TYPE, REGEXP_TYPE, TEXT_ALIGN_TYPE, FIELD_POSITION, ORIENTATION_TYPE, EDIT_RENDER_TYPE } from "src/constants";
import { OptionCallback } from "@t/Common";
import { AbstaractRenderer } from "../renderer/AbstractRenderer";

export interface ValuesInfo {
  labelField: string;
  valueField: string;
  list: any[];
  orientation: ORIENTATION_TYPE;
}

/**
 * form field
 *
 * @export
 * @interface EditRenderer
 * @typedef {EditRenderer}
 */
export interface RendererInfo {
  type?: RENDERER_TYPE | string;
  customOptions: any;
  tooltip: string; // 툴팁 문구
  required?: boolean; //true // 필수 여부
  regexpType?: REGEXP_TYPE; // 정규식 타입
  rule: {
    // 규칙
    minLength: number; // 3
    maxLength: number; //100
    minimum: number;
    exclusiveMinimum: boolean;
    maximum: number;
    exclusiveMaximum: boolean;
  };
  different: {
    // field 값이 다른지 비교
    field: string;
    message: string;
  };
  identical: {
    // field 값이 같은지 비교
    field: string;
    message: string;
  };
  defaultValue: string; // 기본값
  listItem: ValuesInfo; // dropdown, radio, checkbox
  validator?: OptionCallback; // custom validator
  onChange?: OptionCallback; //  입력값 변경시 체크 function
  onClick?: OptionCallback; // button onclick function
  editRender?: AbstaractRenderer;
  conditional?: ConditionInfo; // 보이기 여부
}
