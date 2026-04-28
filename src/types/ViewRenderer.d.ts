import { REGEXP_TYPE, ORIENTATION_TYPE, VIEW_RENDER_TYPE } from '@/constants';
import { OptionCallback } from '@t/Common';

export interface ValuesInfo {
  labelField: string;
  valueField: string;
  list: any[];
  orientation: ORIENTATION_TYPE;
}

/**
 * form field
 *
 * @interface EditRenderer
 * @typedef {EditRenderer}
 */
export interface EditRenderer {
  type?: VIEW_RENDER_TYPE | string;
  customOptions: any;
  tooltip: string; // 툴팁 문구
  disabled?: boolean; // disabled
  placeholder: string; // input , textarea 문구
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
  defaultValue: string | boolean | number; // 기본값
  listItem: ValuesInfo; // dropdown, radio, checkbox
  validator?: OptionCallback; // custom validator
  onChange: OptionCallback; //  입력값 변경시 체크 function
  onClick: OptionCallback; // button onclick function
  fileDownload: OptionCallback; // file download function
  renderer: Render; // custom renderer
  conditional: ConditionInfo; // 보이기 여부
}
