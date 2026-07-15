import { ORIENTATION_TYPE, REGEXP_TYPE } from '@/constants';
import { OptionCallback } from '@t/Common';

export interface ValuesInfo {
  labelField: string;
  valueField: string;
  multiple?: boolean;
  delimiter: string;
  list: any[] | OptionCallback;
  orientation: ORIENTATION_TYPE;
  labelOnly?: boolean;
  includeAllOption?: boolean;
}

/**
 * renderer info
 *
 * @interface RendererInfo
 * @typedef {RendererInfo}
 */
export interface RendererInfo {
  type: string;
  customOptions?: any;
  rule?: {
    // 규칙
    minLength: number; // 3
    maxLength: number; //100
    minimum: number;
    maximum: number;
  };
  tooltip?: string; // 툴팁 문구
  refValue?: OptionCallback | any; // value에 대한 참조값 {key: {}} 참조값
  click?: OptionCallback; // button onclick function
  conditional?: ConditionInfo; // 보이기 여부
}

export interface EditRendererInfo {
  type: string;
  customOptions?: any;
  required?: boolean; //true // 필수 여부
  regexpType?: REGEXP_TYPE; // 정규식 타입
  rule?: {
    // 규칙
    minLength: number; // 3
    maxLength: number; //100
    minimum: number;
    exclusiveMinimum: boolean;
    maximum: number;
    exclusiveMaximum: boolean;
  };
  different?: {
    // field 값이 다른지 비교
    field: string;
    message: string;
  };
  identical?: {
    // field 값이 같은지 비교
    field: string;
    message: string;
  };

  defaultValue?: string; // 기본값
  listItem?: ValuesInfo; // dropdown, radio, checkbox
  validator?: OptionCallback; // custom validator
  change?: OptionCallback; //  입력값 변경시 체크 function
  click?: OptionCallback; // button onclick function
  conditional?: ConditionInfo; // 보이기 여부
  // checkbox, Switch true or false 값
  trueValue?: string | boolean;
  falseValue?: string | boolean;
  //label 보이기 여부
  showLabel?: boolean;
  // icon style class
  iconStyle?: 'string';
  icon?: 'string';
}
