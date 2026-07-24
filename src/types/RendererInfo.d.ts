import { ORIENTATION_TYPE, REGEXP_TYPE } from '@/constants';
import { RendererVariant } from '@/constantStyles';
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
 * Renderer info
 *
 * @export
 * @interface RendererInfo
 * @typedef {RendererInfo}
 */
export interface RendererInfo {
  /**
   * Renderer type
   */
  type: string;

  /**
   * Renderer variant.
   *
   * Used to apply a predefined renderer style such as
   * `round`, `box`, `outline`, etc.
   */
  variant?: RendererVariant;

  /**
   * Click callback
   */
  click?: OptionCallback;

  /**
   * Display condition
   */
  conditional?: ConditionInfo;
}

/**
 * view renderer
 *
 * @export
 * @interface ViewRendererInfo
 * @typedef {ViewRendererInfo}
 * @extends {RendererInfo}
 */
export interface ViewRendererInfo extends RendererInfo {
  /**
   * Tooltip text
   */
  tooltip?: string;

  /**
   * Reference value
   */
  refValue?: OptionCallback | any;

  rule?: {
    // 규칙
    minLength: number; // 3
    maxLength: number; //100
    minimum: number;
    maximum: number;
  };
}

export interface EditRendererInfo extends RendererInfo {
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

  // 기본값
  defaultValue?: string;

  // dropdown, radio, checkbox
  listItem?: ValuesInfo;

  // custom validator
  validator?: OptionCallback;

  //  입력값 변경시 체크 function
  change?: OptionCallback;

  // checkbox, Switch true or false 값
  trueValue?: string | boolean;
  falseValue?: string | boolean;

  //label 보이기 여부
  showLabel?: boolean;

  // icon style class
  iconStyle?: 'string';

  // icon type
  icon?: 'string';
}
